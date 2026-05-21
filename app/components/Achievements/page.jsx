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
    ? new Date(achievement.achievedDate).toLocaleDateString()
    : null;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl shadow-slate-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-300/70">
      <div className="relative h-60 w-full overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={achievement.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />

        <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-sm backdrop-blur-md ${styles.badge}`}>
            <Icon className="text-xs" /> {category}
          </span>

          <div className="flex flex-col items-end gap-2">
            {achievement.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                <FaStar className="text-xs" /> Featured
              </span>
            )}
            {!achievement.isActive && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                <FaEyeSlash className="text-xs" /> Hidden
              </span>
            )}
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/60">
            {achievement.awardingBody || 'School Award'}
          </p>
          <h3 className="mt-1 line-clamp-2 text-xl font-black leading-tight text-white">
            {achievement.title}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-5">
          <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-slate-500">
            {achievement.description || 'No description has been added yet.'}
          </p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="space-y-1 rounded-2xl bg-slate-50 p-3">
            <span className="block text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">Year</span>
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${styles.dot}`} />
              <span className="text-xs font-black text-slate-800">{achievement.year}</span>
            </div>
          </div>

          <div className="space-y-1 rounded-2xl bg-slate-50 p-3">
            <span className="block text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">Photos</span>
            <div className="flex items-center gap-2">
              <FaImage className="text-slate-400" />
              <span className="text-xs font-black text-slate-800">{photoCount || 'Preset'}</span>
            </div>
          </div>

          <div className={`col-span-2 rounded-2xl border p-3 ${styles.panel}`}>
            <span className="block text-[9px] font-black uppercase tracking-[0.12em] opacity-70">
              Awarding Body
            </span>
            <span className="mt-1 block truncate text-xs font-black">
              {achievement.awardingBody || 'School Award'}
            </span>
          </div>

          {(achievedDate || recipients.length > 0) && (
            <div className="col-span-2 grid grid-cols-2 gap-3">
              {achievedDate && (
                <div className="rounded-2xl bg-slate-50 p-3">
                  <span className="block text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">Date</span>
                  <span className="mt-1 block text-xs font-black text-slate-800">{achievedDate}</span>
                </div>
              )}

              {recipients.length > 0 && (
                <div className="rounded-2xl bg-slate-50 p-3">
                  <span className="block text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">Recipients</span>
                  <span className="mt-1 block text-xs font-black text-slate-800">{recipients.length}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {recipients.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {recipients.slice(0, 3).map((recipient, index) => (
              <span key={`${recipient}-${index}`} className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold text-gray-600">
                {recipient}
              </span>
            ))}
            {recipients.length > 3 && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold text-gray-600">
                +{recipients.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center gap-3 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={() => onEdit(achievement)}
            className="flex-1 rounded-2xl bg-slate-900 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white active:scale-[0.98]"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(achievement.id, achievement.title)}
            className="rounded-2xl border border-red-100 bg-red-50 p-3 text-red-500 active:bg-red-100"
            aria-label={`Delete ${achievement.title}`}
          >
            <FaTrash className="text-base" />
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
        bgcolor: 'background.paper', borderRadius: 3, boxShadow: 24,
        overflow: 'hidden', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        <div className="bg-gradient-to-r from-green-600 to-yellow-600 p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaTrophy className="text-2xl" />
              <h2 className="text-xl font-bold">{isEditMode ? 'Edit Achievement' : 'Add Achievement'}</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg">
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>
        
        <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-700">Required details</p>
              <p className="mt-1 text-sm font-semibold leading-6 text-amber-900">
                Enter the achievement name, category, and year before saving. Add the award body, date, recipients, and photos when available.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Achievement Name <span className="text-teal-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g., Kenya Science Fair"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Category <span className="text-teal-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Year <span className="text-teal-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleChange('year', e.target.value)}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div className="col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <TextareaAutosize
                  minRows={3}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe the achievement..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Awarding Body</label>
                <input
                  type="text"
                  value={formData.awardingBody}
                  onChange={(e) => handleChange('awardingBody', e.target.value)}
                  placeholder="e.g., Kenya Science Association"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Achievement Date</label>
                <input
                  type="date"
                  value={formData.achievedDate}
                  onChange={(e) => handleChange('achievedDate', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div className="flex items-center gap-4 pt-8">
                  <label className="flex items-center gap-2 cursor-pointer">
	                    <input
	                      type="checkbox"
	                      checked={formData.featured}
	                      onChange={(e) => handleChange('featured', e.target.checked)}
	                      className="w-4 h-4 text-green-600 rounded"
	                    />
	                    <span className="text-sm font-bold text-gray-700">Featured</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => handleChange('isActive', e.target.checked)}
                      className="w-4 h-4 text-green-600 rounded"
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
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="flex-1 bg-gradient-to-r from-green-600 to-yellow-600 text-white px-4 py-3 rounded-xl font-bold disabled:opacity-50"
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
        width: '95vw', maxWidth: '500px', maxHeight: '90vh',
        bgcolor: 'background.paper', borderRadius: 3, boxShadow: 24,
        overflow: 'hidden', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaChartLine className="text-2xl" />
              <h2 className="text-xl font-bold">{isEditMode ? 'Edit School Stats' : 'Set School Stats'}</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg">
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>
        
        <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <FaChartLine className="inline mr-2 text-emerald-600" />
                Current Mean Score
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.meanScore}
                onChange={(e) => handleChange('meanScore', e.target.value)}
                placeholder="e.g., 5.6"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  <FaBullseye className="inline mr-2 text-emerald-600" />
                  Target Mean
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.targetMean}
                  onChange={(e) => handleChange('targetMean', e.target.value)}
                  placeholder="e.g., 7.00"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                <FaQuoteRight className="inline mr-2 text-emerald-600" />
                School Slogan
              </label>
              <input
                type="text"
                value={formData.slogan}
                onChange={(e) => handleChange('slogan', e.target.value)}
                placeholder="e.g., Strive To Excellence"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Slogan Description</label>
              <TextareaAutosize
                minRows={2}
                value={formData.sloganDescription}
                onChange={(e) => handleChange('sloganDescription', e.target.value)}
                placeholder="Explain the meaning of the slogan..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Slogan Author</label>
              <input
                type="text"
                value={formData.sloganAuthor}
                onChange={(e) => handleChange('sloganAuthor', e.target.value)}
                placeholder="e.g., School Administrator"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={actionLoading}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-3 rounded-xl font-bold disabled:opacity-50"
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
        width: '95vw', maxWidth: '400px',
        bgcolor: 'background.paper', borderRadius: 3, boxShadow: 24,
        overflow: 'hidden'
      }}>
        <div className="bg-gradient-to-r from-teal-600 to-teal-600 p-5 text-white">
          <div className="flex items-center gap-3">
            <FaTrash className="text-xl" />
            <h2 className="text-lg font-bold">Confirm Deletion</h2>
          </div>
        </div>
        
        <div className="p-6">
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete <span className="font-bold">"{title}"</span>? This action cannot be undone.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-teal-600 to-teal-600 text-white px-4 py-3 rounded-xl font-bold disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <CircularProgress size={16} className="text-white" />
                  Deleting...
                </span>
              ) : (
                'Delete'
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

  const handleSaveAchievement = (achievement) => {
    loadData();
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-yellow-50 p-4 md:p-6">
      <Toaster position="top-right" richColors />
      
{/* Header */}
      <div className="relative mb-8 overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-orange-900 via-amber-900 to-orange-900 p-6 md:p-8 shadow-xl sm:shadow-2xl">
        {/* Abstract Gradient Orbs */}
        <div className="absolute top-[-25%] right-[-10%] w-[250px] h-[250px] md:w-[420px] md:h-[420px] bg-gradient-to-br from-amber-500/30 via-orange-500/20 to-yellow-500/30 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-25%] left-[-10%] w-[200px] h-[200px] md:w-[340px] md:h-[340px] bg-gradient-to-tr from-orange-500/20 via-amber-500/10 to-orange-500/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-[30%] right-[20%] w-[180px] h-[180px] bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full blur-[70px] pointer-events-none animate-pulse" />

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FaTrophy className="text-white text-3xl" />
              <h1 className="text-3xl md:text-4xl font-black text-white">Achievements</h1>
            </div>
            <p className="text-orange-100/90">Celebrating our school's excellence and success stories</p>
            
            {/* School Slogan */}
            {schoolStats?.slogan && (
              <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 inline-block">
                <FaQuoteRight className="text-amber-200 mb-2" />
                <p className="text-white text-lg font-bold italic">"{schoolStats.slogan}"</p>
                {schoolStats.sloganAuthor && (
                  <p className="text-amber-200 text-sm mt-1">— {schoolStats.sloganAuthor}</p>
                )}
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-white/20 backdrop-blur-sm text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2"
            >
              <FaSync className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            
            <button
              onClick={() => setShowStatsModal(true)}
              className="bg-white/20 backdrop-blur-sm text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2"
            >
              <FaChartLine />
              {schoolStats ? 'Edit Stats' : 'Set Stats'}
            </button>
            
            <button
              onClick={() => {
                setSelectedAchievement(null);
                setShowAchievementModal(true);
              }}
              className="bg-white text-orange-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"
            >
              <FaPlus />
              Add Achievement
            </button>
          </div>
        </div>
      </div>
      
{/* --- MODERN PERFORMANCE METRICS BENTO --- */}
{schoolStats && (schoolStats.meanScore || schoolStats.lastYearMean || schoolStats.targetMean) && (
  <section className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 mb-10">
    
    {/* Header with Subtitle */}
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-emerald-600">
          <FaChartLine className="text-xl" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Academic Analytics</span>
        </div>
        <h2 className="text-3xl font-serif font-bold text-black">
          Performance <span className="italic text-slate-400">Tracking</span>
        </h2>
      </div>
      
      <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reporting Cycle</p>
        <p className="text-xs font-bold text-slate-700">Annual Academic Audit 2026</p>
      </div>
    </div>

    {/* Bento Grid Layout */}
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      
      {/* 1. Last Year Mean (Compact) */}
      {schoolStats.lastYearMean && (
        <div className="md:col-span-3 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col justify-between">
          <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Prev. Cycle</p>
          <div>
            <p className="text-4xl font-serif font-bold text-slate-800 italic">{schoolStats.lastYearMean}</p>
            <p className="text-[10px] font-bold text-slate-900 mt-1 uppercase">Last Year's Mean Score</p>
          </div>
        </div>
      )}

      {/* 2. Current Mean (Hero Focus) */}
      {schoolStats.meanScore && (
        <div className="md:col-span-5 p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
          {/* Subtle Glow Background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] -z-0" />
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Active Performance</p>
              {schoolStats.lastYearMean && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black ${
                  schoolStats.meanScore > schoolStats.lastYearMean ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {schoolStats.meanScore > schoolStats.lastYearMean ? '↑' : '↓'}
                  {Math.abs(schoolStats.meanScore - schoolStats.lastYearMean).toFixed(2)}
                </div>
              )}
            </div>

            <div className="mt-8">
              <p className="text-6xl font-serif font-bold tracking-tighter italic">
                {schoolStats.meanScore}
              </p>
              <p className="text-xs font-medium text-slate-800 mt-2">Current Institutional Mean</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Target Mean (Progress View) */}
      {schoolStats.targetMean && (
        <div className="md:col-span-4 p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Growth Target</p>
            <p className="text-4xl font-serif font-bold text-emerald-700 mt-2">{schoolStats.targetMean}</p>
          </div>

          <div className="space-y-3">
             <div className="flex justify-between items-end">
                <p className="text-[10px] font-black text-emerald-600 uppercase">Achievement</p>
                <p className="text-lg font-serif font-bold text-emerald-700">
                  {((schoolStats.meanScore / schoolStats.targetMean) * 100).toFixed(1)}%
                </p>
             </div>
             {/* Custom Progress Bar */}
             <div className="h-3 w-full bg-white rounded-full p-1 overflow-hidden border border-emerald-200">
                <div 
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min((schoolStats.meanScore / schoolStats.targetMean) * 100, 100)}%` }}
                />
             </div>
          </div>
        </div>
      )}

    </div>
  </section>
)}
      {/* Achievements by Category */}
      <div className="space-y-6">
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
            <section key={category} className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-xl">
              <button
                onClick={() => toggleCategory(category)}
                className={`w-full bg-gradient-to-r ${gradientClass} p-5 sm:p-6 flex items-center justify-between gap-3 text-white`}
              >
                <div className="min-w-0 flex items-center gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20">
                    <Icon className="text-xl" />
                  </span>
                  <div className="min-w-0 text-left">
                    <h2 className="truncate text-lg font-black sm:text-xl">{category} Achievements</h2>
                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-white/75">
                      {items.length} {items.length === 1 ? 'record' : 'records'} organized by latest and display order
                    </p>
                  </div>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/20">
                  {expandedCategories[category] ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </button>
              
              {expandedCategories[category] && (
                <div className="bg-slate-50/70 p-4 sm:p-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
      
      {totalAchievements === 0 && (
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
          <FaTrophy className="text-6xl text-green-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No Achievements Yet</h3>
          <p className="text-gray-500 mb-6">Start adding your school's achievements to showcase excellence!</p>
          <button
            onClick={() => {
              setSelectedAchievement(null);
              setShowAchievementModal(true);
            }}
            className="bg-gradient-to-r from-green-600 to-yellow-600 text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2"
          >
            <FaPlus /> Add First Achievement
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
