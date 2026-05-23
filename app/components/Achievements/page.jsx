'use client';
import { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'sonner';
import { 
  FaTrophy, FaTrash, FaPlus, FaTimes, FaSave,
  FaImage, FaStar, FaMedal,
  FaGraduationCap, FaFutbol, FaPalette, FaUsersCog,
  FaChartLine, FaBullseye, FaQuoteRight, FaSync,
  FaChevronDown, FaChevronUp, FaEyeSlash
} from 'react-icons/fa';
import { CircularProgress, Modal, Box, TextareaAutosize } from '@mui/material';
import {
  ACHIEVEMENT_CATEGORIES,
  getAchievementImageForCategory,
  getDefaultAchievements,
} from '../../data/defaultAchievements';

const ACHIEVEMENT_PRESET_IMAGES = [
  {
    category: 'Academic',
    label: 'Academic Excellence',
    url: getAchievementImageForCategory('Academic'),
    caption: 'Kinyui Boys academic excellence and learner leadership',
  },
  {
    category: 'Arts',
    label: 'Music & Talent',
    url: getAchievementImageForCategory('Arts'),
    caption: 'Kinyui Boys music and talent team',
  },
  {
    category: 'Sports',
    label: 'School Pride',
    url: getAchievementImageForCategory('Sports'),
    caption: 'Kinyui Boys student life and school pride',
  },
  {
    category: 'Leadership',
    label: 'Student Leaders',
    url: getAchievementImageForCategory('Leadership'),
    caption: 'Kinyui Boys prefects and student leadership',
  },
  {
    category: 'Cultural',
    label: 'Student Voice',
    url: getAchievementImageForCategory('Cultural'),
    caption: 'Kinyui Boys student voice and campus life',
  },
  {
    category: 'Debate',
    label: 'Public Speaking',
    url: getAchievementImageForCategory('Debate'),
    caption: 'Kinyui Boys student presenters and speakers',
  },
];

const getStoredAdminAuth = () => {
  if (typeof window === 'undefined') {
    return { adminToken: null, deviceToken: null };
  }

  const adminToken = ['admin_token', 'token', 'auth_token', 'jwt_token', 'access_token']
    .map((key) => localStorage.getItem(key))
    .find(Boolean);
  const deviceToken = ['device_token', 'deviceToken']
    .map((key) => localStorage.getItem(key))
    .find(Boolean);

  return { adminToken, deviceToken };
};

// ==================== LOADING SPINNER ====================
function ModernLoadingSpinner({ message = "Loading achievements...", size = "medium" }) {
  const sizes = {
    small: { outer: 48, inner: 24 },
    medium: { outer: 64, inner: 32 },
    large: { outer: 80, inner: 40 }
  };

  const { outer, inner } = sizes[size];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-green-50/30 to-yellow-50/20 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative inline-block">
          <CircularProgress 
            size={outer} 
            thickness={5}
            className="text-green-600"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gradient-to-r from-green-500 to-yellow-600 rounded-full animate-ping opacity-25"
                 style={{ width: inner, height: inner }}></div>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <span className="block text-lg font-bold text-gray-800">{message}</span>
          <div className="flex justify-center space-x-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 bg-green-500 rounded-full animate-bounce" 
                   style={{ animationDelay: `${i * 0.15}s` }}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== TAG INPUT COMPONENT ====================
function TagInput({ label, tags, onTagsChange, placeholder = "Type and press Enter..." }) {
  const [inputValue, setInputValue] = useState('');

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTags = [...tags, inputValue.trim()];
      onTagsChange(newTags);
      setInputValue('');
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    onTagsChange(newTags);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white text-sm font-bold"
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
          Press Enter to add
        </span>
      </div>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1 bg-gradient-to-r from-green-50 to-green-100 text-green-700 px-3 py-2 rounded-lg border border-green-200 text-sm font-bold"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(index)}
                className="ml-1 text-green-500"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== IMAGE UPLOAD COMPONENT ====================
function ImageUpload({ images, onImagesChange, onImageRemove, maxImages = 5 }) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images];
    
    files.forEach(file => {
      if (newImages.length >= maxImages) {
        toast.warning(`Maximum ${maxImages} images allowed`);
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      const preview = URL.createObjectURL(file);
      newImages.push({
        file,
        preview,
        caption: ''
      });
    });
    
    onImagesChange(newImages);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    const removedImage = newImages[index];

    if (removedImage?.file && removedImage.preview) {
      URL.revokeObjectURL(removedImage.preview);
    }
    if (!removedImage?.file && removedImage?.url) {
      onImageRemove?.(removedImage);
    }

    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  const handleCaptionChange = (index, caption) => {
    const newImages = [...images];
    newImages[index].caption = caption;
    onImagesChange(newImages);
  };

  const handlePresetSelect = (preset) => {
    if (images.length >= maxImages) {
      toast.warning(`Maximum ${maxImages} images allowed`);
      return;
    }

    if (images.some((image) => image.url === preset.url)) {
      toast.info('That photo is already selected');
      return;
    }

    onImagesChange([
      ...images,
      {
        url: preset.url,
        preview: preset.url,
        public_id: `kinyui-home-${preset.category.toLowerCase()}`,
        caption: preset.caption,
      },
    ]);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-bold text-gray-700">Images ({images.length}/{maxImages})</label>
      
      <div
        className={`border-3 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer ${
          dragOver 
            ? 'border-green-500 bg-green-50' 
            : 'border-gray-300 bg-gray-50/50'
        } ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}`}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (images.length < maxImages) {
            const files = Array.from(e.dataTransfer.files);
            handleFileSelect({ target: { files } });
          }
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => images.length < maxImages && fileInputRef.current?.click()}
      >
        <FaImage className="mx-auto text-4xl text-gray-400 mb-2" />
        <p className="text-gray-700 font-bold">Click or drag to upload images</p>
        <p className="text-sm text-gray-500">PNG, JPG, JPEG (Max 5MB each)</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={images.length >= maxImages}
        />
      </div>
      
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.preview || image.url}
                alt={image.caption || 'Achievement image'}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-2 -right-2 bg-teal-500 text-white rounded-full p-1"
              >
                <FaTimes className="w-3 h-3" />
              </button>
              <input
                type="text"
                value={image.caption || ''}
                onChange={(e) => handleCaptionChange(index, e.target.value)}
                placeholder="Caption"
                className="w-full mt-1 px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-green-500"
              />
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">School photo presets</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">Use the new home photos without uploading again.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase text-slate-500">
            {ACHIEVEMENT_PRESET_IMAGES.length} ready
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ACHIEVEMENT_PRESET_IMAGES.map((preset) => {
            const selected = images.some((image) => image.url === preset.url);
            return (
              <button
                type="button"
                key={preset.url}
                onClick={() => handlePresetSelect(preset)}
                className={`group overflow-hidden rounded-xl border text-left transition active:scale-[0.98] ${
                  selected ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="relative h-20 overflow-hidden">
                  <img src={preset.url} alt={preset.label} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  {selected && (
                    <span className="absolute right-2 top-2 rounded-full bg-emerald-600 px-2 py-1 text-[9px] font-black uppercase text-white">
                      Added
                    </span>
                  )}
                </div>
                <div className="p-2">
                  <p className="truncate text-[11px] font-black text-slate-800">{preset.label}</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{preset.category}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const ACHIEVEMENT_CARD_STYLES = {
  Academic: {
    badge: 'bg-blue-50 text-blue-700 border-blue-100',
    icon: 'bg-blue-100 text-blue-700',
    dot: 'bg-blue-500',
    panel: 'bg-blue-50 border-blue-100 text-blue-800',
  },
  Sports: {
    badge: 'bg-red-50 text-red-700 border-red-100',
    icon: 'bg-red-100 text-red-700',
    dot: 'bg-red-500',
    panel: 'bg-red-50 border-red-100 text-red-800',
  },
  Arts: {
    badge: 'bg-purple-50 text-purple-700 border-purple-100',
    icon: 'bg-purple-100 text-purple-700',
    dot: 'bg-purple-500',
    panel: 'bg-purple-50 border-purple-100 text-purple-800',
  },
  Leadership: {
    badge: 'bg-orange-50 text-orange-700 border-orange-100',
    icon: 'bg-orange-100 text-orange-700',
    dot: 'bg-orange-500',
    panel: 'bg-orange-50 border-orange-100 text-orange-800',
  },
  Cultural: {
    badge: 'bg-amber-50 text-amber-700 border-amber-100',
    icon: 'bg-amber-100 text-amber-700',
    dot: 'bg-amber-500',
    panel: 'bg-amber-50 border-amber-100 text-amber-800',
  },
  Debate: {
    badge: 'bg-cyan-50 text-cyan-700 border-cyan-100',
    icon: 'bg-cyan-100 text-cyan-700',
    dot: 'bg-cyan-500',
    panel: 'bg-cyan-50 border-cyan-100 text-cyan-800',
  },
  Other: {
    badge: 'bg-slate-50 text-slate-700 border-slate-100',
    icon: 'bg-slate-100 text-slate-700',
    dot: 'bg-slate-500',
    panel: 'bg-slate-50 border-slate-100 text-slate-800',
  },
};

function AchievementItemCard({ achievement, category, icon: Icon, onEdit, onDelete }) {
  const styles = ACHIEVEMENT_CARD_STYLES[category] || ACHIEVEMENT_CARD_STYLES.Other;
  const image = achievement?.images?.[0]?.url || getAchievementImageForCategory(category);
  const photoCount = Array.isArray(achievement?.images) ? achievement.images.length : 0;
  const recipients = Array.isArray(achievement?.recipients) ? achievement.recipients : [];
  const achievedDate = achievement?.achievedDate
    ? new Date(achievement.achievedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : null;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-gray-300">
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={achievement.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-gray-950/20 to-transparent" />

        {/* Category & Status Badges */}
        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-wider ${styles.badge} shadow-lg backdrop-blur-sm`}>
            <Icon className="text-sm" /> {category}
          </span>

          <div className="flex flex-col items-end gap-2">
            {achievement.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 text-white px-3 py-1 text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-sm">
                <FaStar className="text-xs" /> Featured
              </span>
            )}
            {!achievement.isActive && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-700 text-white px-3 py-1 text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-sm">
                <FaEyeSlash className="text-xs" /> Hidden
              </span>
            )}
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs font-black uppercase tracking-widest text-white/70 mb-2">
            {achievement.awardingBody || category}
          </p>
          <h3 className="line-clamp-2 text-base font-black leading-tight text-white">
            {achievement.title}
          </h3>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4">
        {/* Description */}
        <p className="text-xs font-medium leading-5 text-gray-600 line-clamp-2 mb-4">
          {achievement.description || 'No description available.'}
        </p>

        {/* Info Grid */}
        <div className="space-y-3 mb-4 flex-1">
          {/* Year */}
          <div className="rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 p-2.5 border border-gray-200">
            <span className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Year</span>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 shrink-0 rounded-full ${styles.dot}`} />
              <span className="text-sm font-black text-gray-800">{achievement.year}</span>
            </div>
          </div>

          {/* Photos & Date Row */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 p-2.5 border border-gray-200">
              <span className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Photos</span>
              <span className="text-sm font-black text-gray-800">{photoCount || 0}</span>
            </div>

            {achievedDate && (
              <div className="rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 p-2.5 border border-gray-200">
                <span className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-1">Date</span>
                <span className="text-xs font-black text-gray-800">{achievedDate}</span>
              </div>
            )}
          </div>

          {/* Recipients Count */}
          {recipients.length > 0 && (
            <div className={`rounded-xl border p-2.5 ${styles.panel}`}>
              <span className="block text-xs font-black uppercase tracking-widest opacity-80 mb-1">
                Recipients
              </span>
              <span className="text-sm font-black">{recipients.length}</span>
            </div>
          )}
        </div>

        {/* Recipients List */}
        {recipients.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {recipients.slice(0, 2).map((recipient, index) => (
              <span key={`${recipient}-${index}`} className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700 border border-gray-200">
                {recipient}
              </span>
            ))}
            {recipients.length > 2 && (
              <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700 border border-gray-200">
                +{recipients.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto flex items-center gap-2 border-t border-gray-100 pt-3">
          <button
            type="button"
            onClick={() => onEdit(achievement)}
            className="flex-1 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all active:scale-95"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(achievement.id, achievement.title)}
            className="rounded-lg border-2 border-red-100 bg-red-50 hover:bg-red-100 p-2 text-red-600 transition-colors active:scale-95"
            aria-label={`Delete ${achievement.title}`}
          >
            <FaTrash className="text-sm" />
          </button>
        </div>
      </div>
    </article>
  );
}

// ==================== ACHIEVEMENT MODAL ====================
function AchievementModal({ onClose, onSave, achievement, loading }) {
  const isEditMode = !!achievement;
  const [formData, setFormData] = useState({
    title: achievement?.title || '',
    description: achievement?.description || '',
    category: achievement?.category || 'Academic',
    year: achievement?.year?.toString() || new Date().getFullYear().toString(),
    awardingBody: achievement?.awardingBody || '',
    recipients: achievement?.recipients || [],
    featured: achievement?.featured || false,
    isActive: achievement?.isActive !== false,
    displayOrder: achievement?.displayOrder?.toString() || '0',
    achievedDate: achievement?.achievedDate ? new Date(achievement.achievedDate).toISOString().split('T')[0] : ''
  });
  
  const [images, setImages] = useState(() => {
    if (achievement?.images) {
      return achievement.images.map(img => ({
        ...img,
        preview: img.url
      }));
    }
    return [];
  });
  
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  const categories = ACHIEVEMENT_CATEGORIES;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const missingFields = [
      !formData.title.trim() && 'Achievement name',
      !formData.category && 'Category',
      !formData.year && 'Year',
    ].filter(Boolean);

    if (missingFields.length > 0) {
      toast.error(`Please enter: ${missingFields.join(', ')}`);
      return;
    }

    const parsedYear = Number.parseInt(formData.year, 10);
    if (Number.isNaN(parsedYear) || parsedYear < 1900 || parsedYear > new Date().getFullYear() + 1) {
      toast.error(`Year must be between 1900 and ${new Date().getFullYear() + 1}`);
      return;
    }
    
    setActionLoading(true);
    
    try {
      const { adminToken, deviceToken } = getStoredAdminAuth();
      
      if (!adminToken || !deviceToken) {
        throw new Error('Authentication required. Please login again.');
      }
      
      const formDataObj = new FormData();
      
      if (isEditMode) {
        formDataObj.append('id', achievement.id);
      }
      
      formDataObj.append('name', formData.title.trim());
      formDataObj.append('title', formData.title.trim());
      formDataObj.append('description', formData.description.trim());
      formDataObj.append('category', formData.category);
      formDataObj.append('year', formData.year);
      formDataObj.append('awardingBody', formData.awardingBody.trim());
      formDataObj.append('recipients', JSON.stringify(formData.recipients));
      formDataObj.append('featured', String(formData.featured));
      formDataObj.append('isActive', String(formData.isActive));
      formDataObj.append('displayOrder', formData.displayOrder);
      formDataObj.append('achievedDate', formData.achievedDate);
      formDataObj.append(
        'imageCaptions',
        JSON.stringify(images.filter((img) => img.file).map((img) => img.caption || ''))
      );
      const originalImageUrls = new Set((achievement?.images || []).map((img) => img.url));
      const presetImages = images
        .filter((img) => !img.file && img.url && (!isEditMode || !originalImageUrls.has(img.url)))
        .map((img) => ({
          url: img.url,
          public_id: img.public_id || `kinyui-home-${img.url.split('/').pop()?.replace(/\.[^.]+$/, '') || 'achievement'}`,
          caption: img.caption || '',
        }));
      formDataObj.append('presetImages', JSON.stringify(presetImages));
      
      // Add new images
      images.forEach(img => {
        if (img.file) {
          formDataObj.append('images', img.file);
        }
      });
      
      // Handle existing images
      if (isEditMode) {
        formDataObj.append('keepExistingImages', 'true');
        if (imagesToDelete.length > 0) {
          formDataObj.append('imagesToDelete', JSON.stringify(imagesToDelete));
        }
      }
      
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch('/api/achievements', {
        method,
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'x-admin-token': adminToken,
          'x-device-token': deviceToken
        },
        body: formDataObj
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        const fieldErrors = data.fieldErrors ? Object.values(data.fieldErrors).join(', ') : '';
        throw new Error(fieldErrors || data.error || 'Failed to save achievement');
      }
      
      toast.success(data.message);
      onSave(data.achievement);
      onClose();
      
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '95vw', maxWidth: '700px', maxHeight: '90vh',
        bgcolor: 'background.paper', borderRadius: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        overflow: 'hidden', background: 'white'
      }}>
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                <FaTrophy className="text-2xl text-white" />
              </div>
              <h2 className="text-2xl font-black">{isEditMode ? 'Edit Achievement' : 'Add Achievement'}</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/20 transition-colors">
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>
        
        <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
              <p className="text-xs font-black uppercase tracking-widest text-indigo-700">Required Details</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-indigo-900">
                Enter the achievement name, category, and year before saving.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Achievement Name <span className="text-indigo-600 font-black">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g., Kenya Science Fair Winner"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-semibold"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Category <span className="text-indigo-600 font-black">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-semibold"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Year <span className="text-indigo-600 font-black">*</span>
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleChange('year', e.target.value)}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-semibold"
                  required
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <TextareaAutosize
                  minRows={3}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe the achievement, its significance, and impact..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all font-semibold"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Awarding Body</label>
                <input
                  type="text"
                  value={formData.awardingBody}
                  onChange={(e) => handleChange('awardingBody', e.target.value)}
                  placeholder="e.g., Kenya Science Association"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-semibold"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Achievement Date</label>
                <input
                  type="date"
                  value={formData.achievedDate}
                  onChange={(e) => handleChange('achievedDate', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-semibold"
                />
              </div>
              
              <div className="col-span-2">
                <TagInput
                  label="Recipients"
                  tags={formData.recipients}
                  onTagsChange={(tags) => handleChange('recipients', tags)}
                  placeholder="Type recipient name and press Enter..."
                />
              </div>
              
              <div className="col-span-2">
                <ImageUpload
                  images={images}
                  onImagesChange={setImages}
                  onImageRemove={(image) => {
                    if (image?.url) {
                      setImagesToDelete((prev) => [...new Set([...prev, image.url])]);
                    }
                  }}
                  maxImages={5}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => handleChange('displayOrder', e.target.value)}
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-semibold"
                  />
                </div>
                
                <div className="flex items-center gap-4 pt-8">
                  <label className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => handleChange('featured', e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                    />
                    <span className="text-sm font-bold text-gray-700">Featured</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => handleChange('isActive', e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                    />
                    <span className="text-sm font-bold text-gray-700">Active</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-3 rounded-xl font-bold disabled:opacity-50 transition-all active:scale-95"
              >
                {actionLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <CircularProgress size={16} className="text-white" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <FaSave />
                    {isEditMode ? 'Update' : 'Create'} Achievement
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
}

// ==================== SCHOOL STATS MODAL ====================
function SchoolStatsModal({ onClose, onSave, stats, loading }) {
  const [formData, setFormData] = useState({
    meanScore: stats?.meanScore?.toString() || '',
    lastYearMean: stats?.lastYearMean?.toString() || '',
    targetMean: stats?.targetMean?.toString() || '',
    slogan: stats?.slogan || '',
    sloganDescription: stats?.sloganDescription || '',
    sloganAuthor: stats?.sloganAuthor || ''
  });
  
  const [actionLoading, setActionLoading] = useState(false);
  const isEditMode = !!stats;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    
    try {
      const { adminToken, deviceToken } = getStoredAdminAuth();
      
      if (!adminToken || !deviceToken) {
        throw new Error('Authentication required. Please login again.');
      }
      
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch('/api/school-stats', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
          'x-admin-token': adminToken,
          'x-device-token': deviceToken
        },
        body: JSON.stringify({
          meanScore: formData.meanScore ? parseFloat(formData.meanScore) : null,
          lastYearMean: formData.lastYearMean ? parseFloat(formData.lastYearMean) : null,
          targetMean: formData.targetMean ? parseFloat(formData.targetMean) : null,
          slogan: formData.slogan || null,
          sloganDescription: formData.sloganDescription || null,
          sloganAuthor: formData.sloganAuthor || null
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please login again.');
        }
        throw new Error(data.error || 'Failed to save school stats');
      }
      
      toast.success(data.message);
      onSave(data.stats);
      onClose();
      
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '95vw', maxWidth: '600px', maxHeight: '90vh',
        bgcolor: 'background.paper', borderRadius: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        overflow: 'hidden'
      }}>
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                <FaChartLine className="text-2xl text-white" />
              </div>
              <h2 className="text-2xl font-black">{isEditMode ? 'Edit School Stats' : 'Set School Stats'}</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/20 transition-colors">
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>
        
        <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FaChartLine className="text-emerald-600" />
                Current Mean Score
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.meanScore}
                onChange={(e) => handleChange('meanScore', e.target.value)}
                placeholder="e.g., 5.6"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Last Year Mean
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.lastYearMean}
                  onChange={(e) => handleChange('lastYearMean', e.target.value)}
                  placeholder="e.g., 5.6"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <FaBullseye className="text-emerald-600" />
                  Target Mean
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.targetMean}
                  onChange={(e) => handleChange('targetMean', e.target.value)}
                  placeholder="e.g., 7.00"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold"
                />
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <FaQuoteRight className="text-emerald-600" />
                School Slogan
              </label>
              <input
                type="text"
                value={formData.slogan}
                onChange={(e) => handleChange('slogan', e.target.value)}
                placeholder="e.g., Strive To Excellence"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Slogan Description</label>
              <TextareaAutosize
                minRows={2}
                value={formData.sloganDescription}
                onChange={(e) => handleChange('sloganDescription', e.target.value)}
                placeholder="Explain the meaning and significance of the slogan..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none transition-all font-semibold"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Slogan Author</label>
              <input
                type="text"
                value={formData.sloganAuthor}
                onChange={(e) => handleChange('sloganAuthor', e.target.value)}
                placeholder="e.g., School Administrator"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-semibold"
              />
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-3 rounded-xl font-bold disabled:opacity-50 transition-all active:scale-95"
              >
                {actionLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <CircularProgress size={16} className="text-white" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <FaSave />
                    {isEditMode ? 'Update' : 'Save'} Stats
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </Box>
    </Modal>
  );
}

// ==================== DELETE CONFIRMATION MODAL ====================
function DeleteConfirmationModal({ onClose, onConfirm, title, loading }) {
  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '95vw', maxWidth: '450px',
        bgcolor: 'background.paper', borderRadius: '24px', boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        overflow: 'hidden'
      }}>
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
              <FaTrash className="text-xl text-white" />
            </div>
            <h2 className="text-2xl font-black">Confirm Deletion</h2>
          </div>
        </div>
        
        <div className="p-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200">
            <p className="text-gray-800">
              Are you sure you want to delete <span className="font-black text-red-700">"{title}"</span>?
            </p>
            <p className="text-sm text-gray-600 mt-2">This action cannot be undone and all associated data will be permanently removed.</p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 py-3 rounded-xl font-bold disabled:opacity-50 transition-all active:scale-95"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <CircularProgress size={16} className="text-white" />
                  Deleting...
                </span>
              ) : (
                'Delete Achievement'
              )}
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
}

// ==================== MAIN COMPONENT ====================
export default function AchievementsPage() {
  const [achievements, setAchievements] = useState({
    Academic: [], Sports: [], Arts: [], Leadership: [], Cultural: [], Debate: [], Other: []
  });
  const [schoolStats, setSchoolStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteTitle, setDeleteTitle] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({
    Academic: true, Sports: true, Arts: true, Leadership: true, Cultural: true, Debate: true, Other: true
  });
  const [refreshing, setRefreshing] = useState(false);

  const categoryIcons = {
    Academic: FaGraduationCap,
    Sports: FaFutbol,
    Arts: FaPalette,
    Leadership: FaUsersCog,
    Cultural: FaPalette,
    Debate: FaUsersCog,
    Other: FaMedal
  };

  const categoryColors = {
    Academic: 'from-blue-600 to-cyan-600',
    Sports: 'from-red-700 to-orange-600',
    Arts: 'from-purple-700 to-pink-600',
    Leadership: 'from-orange-800 to-amber-600',
    Cultural: 'from-amber-700 to-emerald-600',
    Debate: 'from-cyan-700 to-blue-600',
    Other: 'from-gray-700 to-slate-700'
  };

  const createEmptyAchievementGroups = () => ({
    Academic: [],
    Sports: [],
    Arts: [],
    Leadership: [],
    Cultural: [],
    Debate: [],
    Other: []
  });

  const categorizeAchievements = (items = []) => {
    const grouped = createEmptyAchievementGroups();

    items.forEach((achievement) => {
      const category = grouped[achievement.category] ? achievement.category : 'Other';
      grouped[category].push(achievement);
    });

    return grouped;
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load achievements
      const achievementsRes = await fetch('/api/achievements');
      const achievementsData = await achievementsRes.json();
      
      if (achievementsData.success) {
        const grouped = {
          ...createEmptyAchievementGroups(),
          ...(achievementsData.achievements || {})
        };

        if (Object.values(grouped).flat().length > 0) {
          setAchievements(grouped);
        } else {
          setAchievements(categorizeAchievements(getDefaultAchievements()));
        }
      } else {
        setAchievements(categorizeAchievements(getDefaultAchievements()));
      }
      
      // Load school stats
      const statsRes = await fetch('/api/school-stats');
      const statsData = await statsRes.json();
      
      if (statsData.success) {
        setSchoolStats(statsData.stats);
      }
      
    } catch (error) {
      console.error('Error loading data:', error);
      setAchievements(categorizeAchievements(getDefaultAchievements()));
      toast.error('Using default Kinyui achievements');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSaveAchievement = async (achievement) => {
    // Immediately add the achievement to the state to show instant feedback
    if (achievement && achievement.category) {
      setAchievements(prev => {
        const updated = { ...prev };
        const category = achievement.category;
        
        // Update existing or add new
        const existingIndex = updated[category]?.findIndex(a => a.id === achievement.id);
        if (existingIndex >= 0) {
          updated[category][existingIndex] = achievement;
        } else {
          updated[category] = [...(updated[category] || []), achievement];
        }
        
        return updated;
      });
    }
    
    // Then reload to ensure sync
    setTimeout(() => loadData(), 500);
  };

  const handleSaveStats = (stats) => {
    setSchoolStats(stats);
  };

  const handleDeleteClick = (id, title) => {
    setDeleteId(id);
    setDeleteTitle(title);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const adminToken = localStorage.getItem('admin_token');
      const deviceToken = localStorage.getItem('device_token');
      
      if (!adminToken || !deviceToken) {
        throw new Error('Authentication required. Please login again.');
      }
      
      const response = await fetch(`/api/achievements?id=${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'x-device-token': deviceToken
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete achievement');
      }
      
      toast.success('Achievement deleted successfully');
      setShowDeleteModal(false);
      setDeleteId(null);
      setDeleteTitle('');
      loadData();
      
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message);
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  if (loading && Object.values(achievements).every(arr => arr.length === 0)) {
    return <ModernLoadingSpinner message="Loading achievements..." />;
  }

  const totalAchievements = Object.values(achievements).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/20 p-4 md:p-8">
      <Toaster position="top-right" richColors />
      
      {/* Modern Header Section */}
      <div className="relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 p-8 md:p-12 shadow-2xl border border-indigo-700/20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-40%] right-[-10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-gradient-to-br from-indigo-400/20 via-purple-400/10 to-transparent rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-30%] left-[-5%] w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-gradient-to-tr from-purple-400/15 via-indigo-400/10 to-transparent rounded-full blur-[100px]" />
          <div className="absolute top-1/2 right-1/4 w-[200px] h-[200px] bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '50px 50px' }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-400 text-white">
                <FaTrophy className="text-2xl" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white">Achievements</h1>
                <p className="text-indigo-200 text-sm mt-1 font-semibold">Celebrating excellence and success</p>
              </div>
            </div>
            
            {/* School Slogan Display */}
            {schoolStats?.slogan && (
              <div className="mt-6 inline-block">
                <div className="flex items-start gap-3 bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 hover:border-white/40 transition-all">
                  <FaQuoteRight className="text-indigo-300 text-xl flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-white font-bold italic text-lg leading-relaxed">"{schoolStats.slogan}"</p>
                    {schoolStats.sloganAuthor && (
                      <p className="text-indigo-200 text-xs font-semibold mt-2">— {schoolStats.sloganAuthor}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 w-full md:w-auto md:flex-col lg:flex-row">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold flex items-center justify-center gap-2 transition-all border border-white/20 hover:border-white/40 active:scale-95"
            >
              <FaSync className={`text-sm ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            
            <button
              onClick={() => setShowStatsModal(true)}
              className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold flex items-center justify-center gap-2 transition-all border border-white/20 hover:border-white/40 active:scale-95"
            >
              <FaChartLine className="text-sm" />
              <span className="hidden sm:inline">{schoolStats ? 'Edit' : 'Set'} Stats</span>
            </button>
            
            <button
              onClick={() => {
                setSelectedAchievement(null);
                setShowAchievementModal(true);
              }}
              className="flex-1 md:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-300 hover:to-purple-300 text-white font-black flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              <FaPlus className="text-sm" />
              <span>Add Achievement</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Performance Metrics Section */}
      {schoolStats && (schoolStats.meanScore || schoolStats.lastYearMean || schoolStats.targetMean) && (
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100 mb-10 hover:shadow-xl transition-shadow">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-indigo-600">
                <FaChartLine className="text-lg" />
                <span className="text-xs font-black uppercase tracking-widest">Performance Metrics</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                Academic <span className="text-indigo-600">Analytics</span>
              </h2>
            </div>
            
            <div className="px-4 py-2 bg-indigo-50 rounded-2xl border border-indigo-100">
              <p className="text-xs font-black text-indigo-600 uppercase tracking-widest">Current Cycle</p>
              <p className="text-sm font-bold text-indigo-900">Academic Year 2026</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {schoolStats.lastYearMean && (
              <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all">
                <p className="text-xs font-black text-gray-600 uppercase tracking-widest">Previous Cycle</p>
                <p className="text-3xl font-black text-gray-900 mt-4">{schoolStats.lastYearMean}</p>
                <p className="text-xs font-bold text-gray-500 mt-2 uppercase">Last Year Mean</p>
              </div>
            )}

            {schoolStats.meanScore && (
              <div className="p-8 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all border border-indigo-700/50 md:col-span-1">
                <div className="flex justify-between items-start mb-6">
                  <p className="text-xs font-black text-indigo-300 uppercase tracking-widest">Current Performance</p>
                  {schoolStats.lastYearMean && (
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-black ${
                      schoolStats.meanScore > schoolStats.lastYearMean ? 'bg-emerald-500/30 text-emerald-300' : 'bg-red-500/30 text-red-300'
                    }`}>
                      {schoolStats.meanScore > schoolStats.lastYearMean ? '↑' : '↓'}
                      {Math.abs(schoolStats.meanScore - schoolStats.lastYearMean).toFixed(2)}
                    </div>
                  )}
                </div>
                <p className="text-5xl font-black">{schoolStats.meanScore}</p>
                <p className="text-xs font-semibold text-indigo-200 mt-4">Institutional Mean Score</p>
              </div>
            )}

            {schoolStats.targetMean && (
              <div className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200 hover:border-emerald-300 transition-all">
                <p className="text-xs font-black text-emerald-700 uppercase tracking-widest">Growth Target</p>
                <p className="text-3xl font-black text-emerald-900 mt-4">{schoolStats.targetMean}</p>
                <div className="space-y-3 mt-6">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-black text-emerald-700 uppercase">Achievement</p>
                    <p className="text-lg font-black text-emerald-900">{((schoolStats.meanScore / schoolStats.targetMean) * 100).toFixed(1)}%</p>
                  </div>
                  <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-emerald-300">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: `${Math.min((schoolStats.meanScore / schoolStats.targetMean) * 100, 100)}%` }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Achievements Grid Section */}
      <div className="space-y-8">
        {Object.entries(achievements).map(([category, items]) => {
          const Icon = categoryIcons[category];
          const gradientClass = categoryColors[category];
          const sortedItems = [...items].sort((a, b) => {
            if ((a.displayOrder ?? 0) !== (b.displayOrder ?? 0)) {
              return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
            }
            if ((b.year ?? 0) !== (a.year ?? 0)) return (b.year ?? 0) - (a.year ?? 0);
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          });
          
          if (items.length === 0) return null;
          
          return (
            <section key={category} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <button
                onClick={() => toggleCategory(category)}
                className={`w-full bg-gradient-to-r ${gradientClass} p-6 md:p-8 flex items-center justify-between gap-4 text-white hover:brightness-110 transition-all`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                    <Icon className="text-2xl" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-2xl font-black truncate">{category} Achievements</h2>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/75 mt-1">
                      {items.length} {items.length === 1 ? 'achievement' : 'achievements'}
                    </p>
                  </div>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  {expandedCategories[category] ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </button>
              
              {expandedCategories[category] && (
                <div className="bg-gradient-to-b from-gray-50/50 to-white p-6 md:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedItems.map((achievement) => (
                      <AchievementItemCard
                        key={achievement.id}
                        achievement={achievement}
                        category={category}
                        icon={Icon}
                        onEdit={(item) => {
                          setSelectedAchievement(item);
                          setShowAchievementModal(true);
                        }}
                        onDelete={handleDeleteClick}
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
      
      {/* Empty State */}
      {totalAchievements === 0 && (
        <div className="bg-white rounded-3xl shadow-lg p-12 md:p-16 text-center border border-gray-100 my-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-100 mb-6">
            <FaTrophy className="text-4xl text-indigo-600" />
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-3">No Achievements Yet</h3>
          <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto">Celebrate your school's success by adding achievements that showcase excellence and student accomplishments.</p>
          <button
            onClick={() => {
              setSelectedAchievement(null);
              setShowAchievementModal(true);
            }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-4 rounded-2xl font-black inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95"
          >
            <FaPlus /> Add Your First Achievement
          </button>
        </div>
      )}
      
      {/* Modals */}
      {showAchievementModal && (
        <AchievementModal
          onClose={() => {
            setShowAchievementModal(false);
            setSelectedAchievement(null);
          }}
          onSave={handleSaveAchievement}
          achievement={selectedAchievement}
        />
      )}
      
      {showStatsModal && (
        <SchoolStatsModal
          onClose={() => setShowStatsModal(false)}
          onSave={handleSaveStats}
          stats={schoolStats}
        />
      )}
      
      {showDeleteModal && (
        <DeleteConfirmationModal
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteId(null);
            setDeleteTitle('');
          }}
          onConfirm={handleDeleteConfirm}
          title={deleteTitle}
        />
      )}
    </div>
  );
}
