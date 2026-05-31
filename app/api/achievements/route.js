import { NextResponse } from "next/server";
import { prisma } from "../../../libs/prisma";
import cloudinary from "../../../libs/cloudinary";
import {
  ACHIEVEMENT_CATEGORIES,
  getDefaultAchievements,
} from "../../data/defaultAchievements";

// ==================== AUTHENTICATION UTILITIES ====================

class DeviceTokenManager {
  static validateTokensFromHeaders(headers, options = {}) {
    try {
      const adminToken = headers.get('x-admin-token') || headers.get('authorization')?.replace('Bearer ', '');
      const deviceToken = headers.get('x-device-token');

      if (!adminToken) {
        return { valid: false, reason: 'no_admin_token', message: 'Admin token is required' };
      }

      if (!deviceToken) {
        return { valid: false, reason: 'no_device_token', message: 'Device token is required' };
      }

      const adminParts = adminToken.split('.');
      if (adminParts.length !== 3) {
        return { valid: false, reason: 'invalid_admin_token_format', message: 'Invalid admin token format' };
      }

      const deviceValid = this.validateDeviceToken(deviceToken);
      if (!deviceValid.valid) {
        return { 
          valid: false, 
          reason: `device_${deviceValid.reason}`,
          message: `Device token ${deviceValid.reason}: ${deviceValid.error || ''}`
        };
      }

      let adminPayload;
      try {
        adminPayload = JSON.parse(atob(adminParts[1]));
        
        const currentTime = Date.now() / 1000;
        if (adminPayload.exp < currentTime) {
          return { valid: false, reason: 'admin_token_expired', message: 'Admin token has expired' };
        }
        
        const userRole = adminPayload.role || adminPayload.userRole;
        const validRoles = ['ADMIN', 'SUPER_ADMIN', 'ADMINISTRATOR', 'PRINCIPAL'];
        
        if (!userRole || !validRoles.includes(userRole.toUpperCase())) {
          return { 
            valid: false, 
            reason: 'invalid_role', 
            message: 'User does not have permission to manage achievements' 
          };
        }
        
      } catch (error) {
        return { valid: false, reason: 'invalid_admin_token', message: 'Invalid admin token' };
      }

      console.log('✅ Achievements management authentication successful');
      
      return { 
        valid: true, 
        user: {
          id: adminPayload.userId || adminPayload.id,
          name: adminPayload.name,
          email: adminPayload.email,
          role: adminPayload.role || adminPayload.userRole
        },
        deviceInfo: deviceValid.payload
      };

    } catch (error) {
      console.error('❌ Token validation error:', error);
      return { 
        valid: false, 
        reason: 'validation_error', 
        message: 'Authentication validation failed',
        error: error.message 
      };
    }
  }

  static validateDeviceToken(token) {
    try {
      const payloadStr = Buffer.from(token, 'base64').toString('utf-8');
      const payload = JSON.parse(payloadStr);
      
      if (payload.exp && payload.exp * 1000 <= Date.now()) {
        return { valid: false, reason: 'expired', payload, error: 'Device token has expired' };
      }
      
      const createdAt = new Date(payload.createdAt || payload.iat * 1000);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      if (createdAt < thirtyDaysAgo) {
        return { valid: false, reason: 'age_expired', payload, error: 'Device token is too old' };
      }
      
      return { valid: true, payload };
    } catch (error) {
      return { valid: false, reason: 'invalid_format', error: error.message };
    }
  }
}

const authenticateRequest = (req) => {
  const headers = req.headers;
  const validationResult = DeviceTokenManager.validateTokensFromHeaders(headers);
  
  if (!validationResult.valid) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { 
          success: false, 
          error: "Access Denied",
          message: "Authentication required to manage achievements.",
          details: validationResult.message
        },
        { status: 401 }
      )
    };
  }

  return {
    authenticated: true,
    user: validationResult.user,
    deviceInfo: validationResult.deviceInfo
  };
};

// ============ HELPER FUNCTIONS ============

const normalizeJsonArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn("Failed to parse JSON array:", error);
      return [];
    }
  }
  return [];
};

const parseJsonField = (value, fieldName) => {
  if (Array.isArray(value)) return value;
  const raw = value === undefined || value === null ? "" : String(value);

  if (raw.trim() === '') {
    return fieldName === 'images' || fieldName === 'recipients' ? [] : null;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (parseError) {
    console.warn(`Failed to parse ${fieldName}, using empty array:`, parseError);
    return [];
  }
};

const parseNumber = (value) => {
  if (value === undefined || value === null || String(value).trim() === '') return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
};

const parseIntField = (value) => {
  if (value === undefined || value === null || String(value).trim() === '') return null;
  const num = parseInt(value);
  return isNaN(num) ? null : num;
};

const parseDate = (dateString) => {
  if (!dateString || String(dateString).trim() === '') return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (typeof value === 'boolean') return value;
  return ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase());
};

const normalizePresetImages = (value) =>
  parseJsonField(value || "[]", "images")
    .map((image, index) => {
      const source = typeof image === "string" ? { url: image } : image || {};
      const url = typeof source.url === "string" ? source.url.trim() : "";
      if (!url || (!url.startsWith("/") && !url.startsWith("https://"))) return null;

      return {
        url,
        public_id: source.public_id || `kinyui-home-achievement-${index + 1}`,
        caption: source.caption || "",
      };
    })
    .filter(Boolean);

const getFormString = (formData, keys, fallback = "") => {
  const keyList = Array.isArray(keys) ? keys : [keys];
  for (const key of keyList) {
    const value = formData.get(key);
    if (value !== null && value !== undefined) {
      const normalized = String(value).trim();
      if (normalized) return normalized;
    }
  }
  return fallback;
};

const validateAchievementDetails = ({ title, category, year }) => {
  const fieldErrors = {};

  if (!title) fieldErrors.name = "Achievement name is required";
  if (!category) fieldErrors.category = "Category is required";
  if (!year) fieldErrors.year = "Year is required";
  if (year && (year < 1900 || year > new Date().getFullYear() + 1)) {
    fieldErrors.year = `Year must be between 1900 and ${new Date().getFullYear() + 1}`;
  }
  if (category && !ACHIEVEMENT_CATEGORIES.includes(category)) {
    fieldErrors.category = `Category must be one of: ${ACHIEVEMENT_CATEGORIES.join(", ")}`;
  }

  return {
    valid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
};

// ============ CLOUDINARY FUNCTIONS ============

const uploadToCloudinary = async (file, folder, resourceType = 'image') => {
  if (!file || file.size === 0) return null;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const originalName = file.name;
    const sanitizedFileName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
    
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder: `achievements/${folder}`,
          public_id: `${timestamp}-${sanitizedFileName}`,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });
    
    return {
      url: result.secure_url,
      public_id: result.public_id,
      bytes: result.bytes,
      format: result.format
    };
  } catch (error) {
    console.error(`❌ Cloudinary upload error for ${folder}:`, error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

const deleteFromCloudinary = async (url) => {
  if (!url) return;
  
  try {
    const matches = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
    if (matches && matches[1]) {
      const publicId = matches[1];
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error('❌ Cloudinary delete error:', error);
  }
};

const handleImagesUpload = async (imageFiles, existingImages = [], captions = []) => {
  const images = [...existingImages];
  
  if (!imageFiles || imageFiles.length === 0) {
    return images;
  }

  for (const [index, file] of imageFiles.entries()) {
    if (file && file.size > 0) {
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }
      
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size must be less than 5MB');
      }
      
      const result = await uploadToCloudinary(file, 'images', 'image');
      images.push({
        url: result.url,
        public_id: result.public_id,
        caption: captions[index] || ''
      });
    }
  }
  
  return images;
};

// Clean achievement response
const cleanAchievementResponse = (achievement) => {
  try {
    let images = [];
    let recipients = [];
    
    try {
      images = normalizeJsonArray(achievement.images);
    } catch (e) {
      console.warn("Error parsing images:", e);
    }
    
    try {
      recipients = normalizeJsonArray(achievement.recipients);
    } catch (e) {
      console.warn("Error parsing recipients:", e);
    }

    return {
      id: achievement.id,
      title: achievement.title,
      description: achievement.description,
      category: achievement.category,
      year: achievement.year,
      images,
      featured: achievement.featured,
      displayOrder: achievement.displayOrder,
      isActive: achievement.isActive,
      awardingBody: achievement.awardingBody,
      recipients,
      createdBy: achievement.createdBy,
      createdByName: achievement.createdByName,
      updatedBy: achievement.updatedBy,
      updatedByName: achievement.updatedByName,
      achievedDate: achievement.achievedDate,
      createdAt: achievement.createdAt,
      updatedAt: achievement.updatedAt
    };
  } catch (error) {
    console.error("Error cleaning achievement response:", error);
    return achievement;
  }
};

const getGroupedAchievements = (achievements) => {
  const groupedAchievements = ACHIEVEMENT_CATEGORIES.reduce((groups, category) => {
    groups[category] = [];
    return groups;
  }, {});

  achievements.forEach((achievement) => {
    const cleaned = cleanAchievementResponse(achievement);
    const category = groupedAchievements[cleaned.category] ? cleaned.category : "Other";
    groupedAchievements[category].push(cleaned);
  });

  return groupedAchievements;
};

const sortAchievements = (achievements) =>
  [...achievements].sort((a, b) => {
    if ((a.displayOrder ?? 0) !== (b.displayOrder ?? 0)) {
      return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
    }
    if ((b.year ?? 0) !== (a.year ?? 0)) return (b.year ?? 0) - (a.year ?? 0);
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

const filterAchievementList = (achievements, { category, year, featured, activeOnly }) => {
  const filtered = achievements.filter((achievement) => {
    if (category && achievement.category !== category) return false;
    if (year && achievement.year !== parseInt(year)) return false;
    if (featured === "true" && achievement.featured !== true) return false;
    if (activeOnly && achievement.isActive === false) return false;
    return true;
  });

  return sortAchievements(filtered);
};

const toPrismaAchievementData = (achievement) => ({
  title: achievement.title,
  description: achievement.description,
  category: achievement.category,
  year: achievement.year,
  images: achievement.images,
  featured: achievement.featured,
  displayOrder: achievement.displayOrder,
  isActive: achievement.isActive,
  awardingBody: achievement.awardingBody,
  recipients: achievement.recipients,
  achievedDate: achievement.achievedDate ? new Date(achievement.achievedDate) : null,
});

const ensureKinyuiDefaultAchievements = async () => {
  const defaults = getDefaultAchievements();

  for (const achievement of defaults) {
    const existing = await prisma.achievement.findFirst({
      where: { title: achievement.title },
      select: { id: true },
    });

    if (!existing) {
      await prisma.achievement.create({
        data: toPrismaAchievementData(achievement),
      });
    } else {
      await prisma.achievement.update({
        where: { id: existing.id },
        data: {
          images: achievement.images,
          displayOrder: achievement.displayOrder,
          featured: achievement.featured,
          isActive: achievement.isActive,
        },
      });
    }
  }
};

const getFallbackAchievementsPayload = ({ category, year, featured, activeOnly }) => {
  const fallbackAchievements = filterAchievementList(getDefaultAchievements(), {
    category,
    year,
    featured,
    activeOnly,
  });

  return {
    success: true,
    message: "Default Kinyui achievements retrieved successfully",
    achievements: getGroupedAchievements(fallbackAchievements),
    allAchievements: fallbackAchievements.map((achievement) => cleanAchievementResponse(achievement)),
    total: fallbackAchievements.length,
    source: "defaults",
  };
};

// ============ API ROUTES ============

// 🟡 GET all achievements (PUBLIC - no authentication required)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const year = searchParams.get('year');
    const featured = searchParams.get('featured');
    const activeOnly = searchParams.get('activeOnly') !== 'false';
    const id = searchParams.get('id');
    
    console.log("🔍 GET /api/achievements - Fetching achievements");
    
    // If ID is provided, return single achievement
    if (id) {
      const parsedId = parseInt(id, 10);
      const fallbackAchievement = getDefaultAchievements().find(
        (achievement) => achievement.id === parsedId
      );

      if (fallbackAchievement) {
        return NextResponse.json({
          success: true,
          achievement: cleanAchievementResponse(fallbackAchievement),
          source: "defaults",
        });
      }

      if (Number.isNaN(parsedId)) {
        return NextResponse.json(
          { success: false, error: "Invalid achievement ID" },
          { status: 400 }
        );
      }

      const achievement = await prisma.achievement.findUnique({
        where: { id: parsedId }
      });
      
      if (!achievement) {
        return NextResponse.json(
          { success: false, error: "Achievement not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ 
        success: true, 
        achievement: cleanAchievementResponse(achievement)
      });
    }
    
    const whereClause = {};
    
    if (category) whereClause.category = category;
    if (year) whereClause.year = parseInt(year);
    if (featured === 'true') whereClause.featured = true;
    if (activeOnly) whereClause.isActive = true;

    await ensureKinyuiDefaultAchievements();
    
    const achievements = await prisma.achievement.findMany({
      where: whereClause,
      orderBy: [
        { displayOrder: 'asc' },
        { year: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    
    console.log(`✅ Found ${achievements.length} achievements`);
    const cleanedAchievements = achievements.map(a => cleanAchievementResponse(a));
    
    return NextResponse.json({ 
      success: true, 
      message: "Achievements retrieved successfully",
      achievements: getGroupedAchievements(cleanedAchievements),
      allAchievements: cleanedAchievements,
      total: achievements.length
    });

  } catch (error) {
    console.error("❌ GET Error:", error);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const fallbackAchievement = getDefaultAchievements().find(
        (achievement) => achievement.id === parseInt(id)
      );

      if (fallbackAchievement) {
        return NextResponse.json({
          success: true,
          achievement: cleanAchievementResponse(fallbackAchievement),
          source: "defaults",
        });
      }
    }

    return NextResponse.json(
      getFallbackAchievementsPayload({
        category: searchParams.get("category"),
        year: searchParams.get("year"),
        featured: searchParams.get("featured"),
        activeOnly: searchParams.get("activeOnly") !== "false",
      })
    );
  }
}

// 🟢 CREATE Achievement (POST - PROTECTED)
export async function POST(req) {
  try {
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log("📝 POST /api/achievements - Creating achievement");
    console.log(`Request from: ${auth.user.name} (${auth.user.role})`);
    
    const formData = await req.formData();
    
    // Validate required fields. The admin UI calls this "Achievement Name";
    // the API accepts both name and title for backwards compatibility.
    const title = getFormString(formData, ["name", "title"]);
    const category = getFormString(formData, "category");
    const year = parseIntField(formData.get("year"));
    const validation = validateAchievementDetails({ title, category, year });

    if (!validation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Please enter the required achievement details.",
          requiredFields: ["name", "category", "year"],
          fieldErrors: validation.fieldErrors,
          allowedCategories: ACHIEVEMENT_CATEGORIES,
          authenticated: true
        },
        { status: 400 }
      );
    }

    // Handle images upload
    const imageFiles = formData.getAll("images");
    const imageCaptions = parseJsonField(formData.get("imageCaptions") || "[]", "imageCaptions") || [];
    const presetImages = normalizePresetImages(formData.get("presetImages"));
    let images = [...presetImages];
    
    try {
      const uploadedImages = await handleImagesUpload(imageFiles.filter(f => f && f.size > 0), [], imageCaptions);
      images = [...images, ...uploadedImages];
    } catch (imageError) {
      return NextResponse.json(
        { 
          success: false, 
          error: imageError.message,
          authenticated: true
        },
        { status: 400 }
      );
    }

    // Parse recipients
    let recipients = [];
    try {
      recipients = parseJsonField(formData.get("recipients") || "[]", "recipients");
    } catch (parseError) {
      console.warn("Error parsing recipients:", parseError);
    }

    // Create achievement
    const achievementData = {
      title,
      description: getFormString(formData, "description") || null,
      category,
      year,
      images,
      featured: parseBoolean(formData.get("featured")),
      displayOrder: parseIntField(formData.get("displayOrder")) || 0,
      isActive: parseBoolean(formData.get("isActive"), true),
      awardingBody: getFormString(formData, "awardingBody") || null,
      recipients,
      createdBy: auth.user.id || null,
      createdByName: auth.user.name || auth.user.email || null,
      updatedBy: auth.user.id || null,
      updatedByName: auth.user.name || auth.user.email || null,
      achievedDate: parseDate(formData.get("achievedDate"))
    };

    const achievement = await prisma.achievement.create({
      data: achievementData
    });
    
    console.log(`✅ Achievement created successfully: ${achievement.title}`);
    
    return NextResponse.json({ 
      success: true, 
      message: "Achievement created successfully",
      achievement: cleanAchievementResponse(achievement),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("❌ POST Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Internal server error",
        message: "Failed to create achievement",
        authenticated: true
      }, 
      { status: 500 }
    );
  }
}

// 🔵 UPDATE Achievement (PUT - PROTECTED)
export async function PUT(req) {
  try {
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    console.log("✏️ PUT /api/achievements - Updating achievement");
    
    const formData = await req.formData();
    const id = formData.get("id");
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Achievement ID is required",
          authenticated: true
        }, 
        { status: 400 }
      );
    }

    const existing = await prisma.achievement.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existing) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Achievement not found",
          authenticated: true
        }, 
        { status: 404 }
      );
    }

    // Handle images
    const imageFiles = formData.getAll("images");
    const keepExistingImages = formData.get("keepExistingImages") === 'true';
    const imagesToDelete = formData.get("imagesToDelete");
    
    let images = keepExistingImages ? normalizeJsonArray(existing.images) : [];
    
    // Delete images marked for removal
    if (imagesToDelete) {
      try {
        const deleteUrls = normalizeJsonArray(imagesToDelete);
        for (const url of deleteUrls) {
          await deleteFromCloudinary(url);
        }
        images = images.filter(img => !deleteUrls.includes(img.url));
      } catch (e) {
        console.warn("Error parsing imagesToDelete:", e);
      }
    }
    
    // Upload new images
    const imageCaptions = parseJsonField(formData.get("imageCaptions") || "[]", "imageCaptions") || [];
    try {
      const newImages = await handleImagesUpload(imageFiles.filter(f => f && f.size > 0), [], imageCaptions);
      images = [...images, ...newImages];
    } catch (imageError) {
      return NextResponse.json(
        { 
          success: false, 
          error: imageError.message,
          authenticated: true
        },
        { status: 400 }
      );
    }

    // Parse recipients
    let recipients = normalizeJsonArray(existing.recipients);
    const recipientsField = formData.get("recipients");
    if (recipientsField !== null) {
      try {
        recipients = parseJsonField(recipientsField, "recipients");
      } catch (parseError) {
        console.warn("Error parsing recipients:", parseError);
      }
    }

    const nextTitle = getFormString(formData, ["name", "title"], existing.title);
    const nextCategory = getFormString(formData, "category", existing.category);
    const nextYear = formData.has("year") ? parseIntField(formData.get("year")) : existing.year;
    const validation = validateAchievementDetails({
      title: nextTitle,
      category: nextCategory,
      year: nextYear,
    });

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter the required achievement details.",
          requiredFields: ["name", "category", "year"],
          fieldErrors: validation.fieldErrors,
          allowedCategories: ACHIEVEMENT_CATEGORIES,
          authenticated: true,
        },
        { status: 400 }
      );
    }

    const presetImages = normalizePresetImages(formData.get("presetImages"));
    if (presetImages.length > 0) {
      const currentUrls = new Set(images.map((image) => image.url));
      images = [
        ...images,
        ...presetImages.filter((image) => !currentUrls.has(image.url)),
      ];
    }

    // Prepare update data
    const updateData = {
      title: nextTitle,
      description: formData.has("description") ? getFormString(formData, "description") || null : existing.description,
      category: nextCategory,
      year: nextYear,
      images,
      featured: formData.has("featured") ? parseBoolean(formData.get("featured")) : existing.featured,
      displayOrder: formData.has("displayOrder") ? parseIntField(formData.get("displayOrder")) || 0 : existing.displayOrder,
      isActive: formData.has("isActive") ? parseBoolean(formData.get("isActive"), true) : existing.isActive,
      awardingBody: formData.has("awardingBody") ? getFormString(formData, "awardingBody") || null : existing.awardingBody,
      recipients,
      achievedDate: formData.has("achievedDate") ? parseDate(formData.get("achievedDate")) : existing.achievedDate,
      updatedBy: auth.user.id || null,
      updatedByName: auth.user.name || auth.user.email || null,
      updatedAt: new Date()
    };

    const updated = await prisma.achievement.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    console.log(`✅ Achievement updated successfully: ${updated.title}`);
    
    return NextResponse.json({ 
      success: true, 
      message: "Achievement updated successfully",
      achievement: cleanAchievementResponse(updated),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("❌ PUT Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Internal server error",
        message: "Failed to update achievement",
        authenticated: true
      }, 
      { status: 500 }
    );
  }
}

// 🔴 DELETE Achievement (DELETE - PROTECTED)
export async function DELETE(req) {
  try {
    const auth = authenticateRequest(req);
    if (!auth.authenticated) {
      return auth.response;
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Achievement ID is required",
          authenticated: true
        }, 
        { status: 400 }
      );
    }

    console.log(`🗑️ DELETE /api/achievements - Deleting achievement ${id}`);
    console.log(`Request from: ${auth.user.name} (${auth.user.role})`);
    
    const existing = await prisma.achievement.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!existing) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Achievement not found",
          authenticated: true
        }, 
        { status: 404 }
      );
    }

    // Delete images from Cloudinary
    const existingImages = normalizeJsonArray(existing.images);
    if (existingImages.length > 0) {
      for (const image of existingImages) {
        if (image.url) {
          await deleteFromCloudinary(image.url);
        }
      }
    }

    await prisma.achievement.delete({
      where: { id: parseInt(id) }
    });
    
    console.log(`✅ Achievement deleted successfully: ${existing.title}`);
    
    return NextResponse.json({ 
      success: true, 
      message: "Achievement deleted successfully",
      deletedId: id,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("❌ DELETE Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Internal server error",
        message: "Failed to delete achievement",
        authenticated: true
      }, 
      { status: 500 }
    );
  }
}
