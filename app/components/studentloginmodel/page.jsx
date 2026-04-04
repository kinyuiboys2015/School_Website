'use client';

import { useState, useEffect } from 'react';
import { 
  FiUser, FiLock, FiAlertCircle, FiX, 
  FiHelpCircle, FiBook, FiShield, FiClock,
  FiLogIn, FiEdit2, FiCheckCircle, FiStar, FiAward
} from 'react-icons/fi';
import { IoSchool } from 'react-icons/io5';
import Image from 'next/image';
import CircularProgress from "@mui/material/CircularProgress";

export default function StudentLoginModal({ 
  isOpen, 
  onClose, 
  onLogin,
  isLoading = false,
  error = null,
  requiresContact = false
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    admissionNumber: ''
  });
  const [localError, setLocalError] = useState(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (error) {
      setLocalError(error);
      if (requiresContact) {
        setShowContactInfo(true);
      }
    } else {
      setLocalError(null);
      setShowContactInfo(false);
    }
  }, [error, requiresContact]);

  if (!isOpen) return null;

  const validateInputs = () => {
    const errors = {};
    
    // Name validation - removed male name pattern check
    if (!formData.fullName.trim()) {
      errors.fullName = 'Please enter your name';
    } else {
      const nameParts = formData.fullName.trim().split(/\s+/).filter(part => part.length > 0);
      if (nameParts.length < 1) {
        errors.fullName = 'Please enter at least your first name';
      }
      // REMOVED: male name pattern validation
    }

    if (!formData.admissionNumber.trim()) {
      errors.admissionNumber = 'Please enter your admission number';
    } else if (!/^[A-Z0-9]{2,10}$/i.test(formData.admissionNumber.trim())) {
      errors.admissionNumber = 'Admission number should be 2-10 letters or numbers';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError(null);
    setShowContactInfo(false);
    setValidationErrors({});
    
    if (!validateInputs()) {
      return;
    }

    onLogin(formData.fullName.trim(), formData.admissionNumber.trim());
  };

  const handleClear = () => {
    setFormData({ fullName: '', admissionNumber: '' });
    setLocalError(null);
    setShowContactInfo(false);
    setValidationErrors({});
  };

  const handleClose = () => {
    handleClear();
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (localError) setLocalError(null);
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Student examples
  const studentExamples = [
    { name: "John Musau Mutuku", admission: "2903" },
    { name: "Peter Mutinda Kitheka", admission: "2902" },
    { name: "James Kasimu Muendo", admission: "1234" },
    { name: "David Mutua Kilonzo", admission: "5678" },
    { name: "Michael Musyoka Kioko", admission: "9012" },
    { name: "Paul Muthama Mutisya", admission: "3456" }
  ];

  const nameFormats = [
    "John Mutuku",
    "John Musau Mutuku", 
    "JOHN MUTUKU",
    "john mutuku",
    "J. Mutuku",
    "Mutuku John"
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <main className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-200 overflow-hidden transform transition-all duration-300 scale-100 my-auto max-h-[90vh] flex flex-col">
        
        {/* Header with School Logo - Kinyui Branding */}
        <header className="bg-gray-900 px-6 py-4 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* School Logo Container */}
              <div className="relative">
                <div className="absolute inset-0 bg-gray-600/30 rounded-full blur-md"></div>
                <div className="relative w-14 h-14 bg-gray-800 rounded-full p-1 shadow-xl">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                    <Image 
                      src="/kinyui.png" 
                      alt="Kinyui Boys' School Logo" 
                      width={48}
                      height={48}
                      className="object-contain p-1.5"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h1 id="login-modal-title" className="text-xl font-black tracking-wide">
                  KINYUI BOYS'
                </h1>
                <p className="text-gray-400 text-xs font-semibold tracking-wider">
                  SENIOR SCHOOL • STUDENT PORTAL
                </p>
              </div>
            </div>
            
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-110"
              aria-label="Close login modal"
            >
              <FiX className="text-xl" aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Body - Scrollable */}
        <article className="p-6 overflow-y-auto flex-grow">
          
          {/* School Motto Banner */}
          <div className="mb-5 bg-gray-50 rounded-xl p-3 border border-gray-200 text-center">
            <p className="text-gray-900 font-bold italic text-sm flex items-center justify-center gap-2">
              <FiStar className="text-gray-500" />
              "Soaring to Excellence"
              <FiStar className="text-gray-500" />
            </p>
            <p className="text-gray-500 text-xs mt-1">EST. 1976 | CENTRE OF EXCELLENCE</p>
          </div>

          {/* Flexible Name Instructions */}
          <section className="mb-5 bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-gray-200 rounded-lg">
                <FiCheckCircle className="text-gray-900 text-sm" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-bold text-gray-900 mb-1">Student Name Entry</h2>
                <p className="text-gray-900 text-xs mb-2">
                  Enter your name in any format (uppercase, lowercase, 2 or 3 names)
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {nameFormats.map((format, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleInputChange('fullName', format)}
                      className="px-2 py-1 bg-gray-100 text-gray-900 rounded-lg text-xs cursor-pointer hover:bg-gray-200 transition-all duration-200 border border-gray-200 hover:scale-105"
                      type="button"
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Error/Contact Info Section */}
          <aside>
            {(showContactInfo || localError) && (
              <div className="mb-5 animate-slideDown">
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-200">
                  <div className="p-1.5 bg-red-100 rounded-full">
                    <FiAlertCircle className="text-red-600 text-sm" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-red-800 mb-1">
                      {showContactInfo ? 'Record Verification Needed' : 'Login Issue'}
                    </h3>
                    <p className="text-red-600 text-xs">{localError}</p>
                    
                    {showContactInfo && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-900">
                          <FiHelpCircle className="text-gray-900" />
                          <span className="font-bold">Next Steps:</span>
                        </div>
                        <ul className="text-xs text-gray-900 space-y-1 ml-5 list-decimal">
                          <li>Re-enter your details below</li>
                          <li>Contact your class teacher</li>
                          <li>Visit the school administration office</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Login Form */}
          <section>
            <div className="mb-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-100 rounded-xl">
                  <FiShield className="text-gray-900 text-sm" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Secure Student Access</h3>
                  <div className="flex items-center gap-2 text-gray-900 text-xs">
                    <FiClock className="text-gray-500" />
                    <span>Session Duration: <strong className="text-gray-900">2 Hours</strong></span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                <p className="text-gray-900 text-xs font-medium">
                  <strong className="text-gray-900">Note:</strong> Use your official admission number and name as registered for Kinyui Boys' Senior School.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <fieldset>
                <label className="text-xs font-bold text-gray-900 flex items-center gap-2 mb-2">
                  <FiUser className="text-gray-900 text-sm" />
                  <span>Full Name</span>
                  <span className="text-[10px] text-gray-900 bg-gray-100 px-2 py-0.5 rounded-full">Flexible Format</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="e.g., John Mutuku, JOHN MUTUKU, J. Mutuku"
                  className={`
                    w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-gray-900/20 
                    focus:border-gray-900 transition-all duration-200 text-sm bg-white text-gray-900 placeholder-gray-400
                    ${validationErrors.fullName 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                  disabled={isLoading}
                  autoComplete="name"
                />
                {validationErrors.fullName && (
                  <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle className="text-xs" />
                    {validationErrors.fullName}
                  </p>
                )}
                
                {/* Quick Select - Student Examples */}
                <div className="mt-3">
                  <p className="text-gray-900 text-[10px] font-semibold mb-2">⬇️ Quick Select:</p>
                  <div className="flex flex-wrap gap-2">
                    {studentExamples.map((student, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          handleInputChange('fullName', student.name);
                          handleInputChange('admissionNumber', student.admission);
                        }}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg text-[10px] border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                      >
                        {student.name.split(' ')[0]} • {student.admission}
                      </button>
                    ))}
                  </div>
                </div>
              </fieldset>

              {/* Admission Number Input */}
              <fieldset>
                <label className="text-xs font-bold text-gray-900 flex items-center gap-2 mb-2">
                  <FiLock className="text-gray-900 text-sm" />
                  <span>Admission Number</span>
                  <span className="text-[10px] text-gray-900 bg-gray-100 px-2 py-0.5 rounded-full">Unique ID</span>
                </label>
                <input
                  type="text"
                  value={formData.admissionNumber}
                  onChange={(e) => handleInputChange('admissionNumber', e.target.value.toUpperCase())}
                  placeholder="e.g., 2903, AB12, 2023001"
                  className={`
                    w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-gray-900/20 
                    focus:border-gray-900 transition-all duration-200 text-sm bg-white text-gray-900 placeholder-gray-400 uppercase
                    ${validationErrors.admissionNumber 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 hover:border-gray-400'
                    }
                  `}
                  disabled={isLoading}
                  autoComplete="off"
                />
                {validationErrors.admissionNumber && (
                  <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <FiAlertCircle className="text-xs" />
                    {validationErrors.admissionNumber}
                  </p>
                )}
                
                {/* Admission Number Examples */}
                <div className="mt-3">
                  <p className="text-gray-900 text-[10px] font-semibold mb-2">⬇️ Example Formats:</p>
                  <div className="flex flex-wrap gap-2">
                    {['2903', 'AB12', '2023001', 'STU456', 'KM001'].map((example, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleInputChange('admissionNumber', example)}
                        className="px-2 py-1 bg-gray-100 text-gray-900 rounded-lg text-[10px] border border-gray-200 hover:bg-gray-200 transition-all duration-200 font-mono"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </fieldset>
{/* Action Buttons */}
<div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 pt-3">
  <button
    type="button"
    onClick={handleClear}
    disabled={isLoading}
    /* Reduced py-2.5 and px-3 for mobile, text-xs for extra small screens */
    className="flex-1 py-2.5 sm:py-3 px-3 sm:px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-bold text-xs sm:text-sm disabled:opacity-50 flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200 active:scale-95"
  >
    <FiX className="text-xs sm:text-sm" />
    <span>Clear</span>
  </button>

  <button
    type="submit"
    disabled={isLoading || !formData.fullName.trim() || !formData.admissionNumber.trim()}
    /* Reduced padding and font size for better fit on small mobile */
    className="flex-[2] sm:flex-1 py-2.5 sm:py-3 px-3 sm:px-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-xs sm:text-sm disabled:opacity-70 flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-800 active:scale-95"
  >
    {isLoading ? (
      <>
        <CircularProgress size={14} thickness={4} sx={{ color: "white" }} />
        <span>Verifying...</span>
      </>
    ) : (
      <>
        <FiLogIn className="text-xs sm:text-sm" />
        {/* Shorter text for tiny screens, full text for larger ones */}
        <span className="whitespace-nowrap">
            <span className="inline sm:hidden">Login</span>
            <span className="hidden sm:inline">Login to Portal</span>
        </span>
      </>
    )}
  </button>
</div>
            </form>

            {/* Features Grid */}
            <section className="mt-6 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 bg-gray-50 rounded-xl">
                  <FiBook className="text-green-900 text-base mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-gray-900">Learning Resources</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-xl">
                  <FiShield className="text-blue-900 text-base mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-gray-900">Secure Access</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-xl">
                  <FiAward className="text-rose-900 text-base mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-gray-900">Excellence</p>
                </div>
              </div>
            </section>
          </section>
        </article>

        {/* Footer */}
        <footer className="px-6 py-3 bg-gray-900 flex-shrink-0">
          <p className="text-center text-gray-400 text-xs">
            © {new Date().getFullYear()} Kinyui Boys' Senior School | For assistance, contact school administration
          </p>
        </footer>
      </main>

      {/* Global Styles */}
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
        
        /* Prevent iOS zoom */
        @media screen and (max-width: 768px) {
          input, select, textarea {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}