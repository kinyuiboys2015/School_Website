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
    
    // Male name validation for Kinyui Boys' School
    if (!formData.fullName.trim()) {
      errors.fullName = 'Please enter your name';
    } else {
      const nameParts = formData.fullName.trim().split(/\s+/).filter(part => part.length > 0);
      if (nameParts.length < 1) {
        errors.fullName = 'Please enter at least your first name';
      }
      
      // Check for male name patterns (common Kamba male names)
      const maleNamePatterns = /(Musau|Mutuku|Muthama|Mutinda|Mbuvi|Muendo|Mulei|Mutua|Kitheka|Kasimu|Munyao|Mwanzia|Maingi|Mutisya|Musingi|Mwendwa|Mulwa|Munyasya|Musyoka|Ndeti|Nzau|Kilonzo|Kioko|Kimeu|Kivuva|Munguti|Muthoka|Muteti|Mutonga|Mutuva|Ndambuki|Ndunda|Ngui|Nzioka|Wambua|Wayua)/i;
      
      if (!maleNamePatterns.test(formData.fullName.trim())) {
        errors.fullName = 'Please enter a valid male student name for Kinyui Boys\' School';
      }
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

  // Male student examples for Kinyui Boys' School
  const studentExamples = [
    { name: "Musau Mwanzia Mutuku", admission: "2903" },
    { name: "Mutinda Kitheka Mbuvi", admission: "2902" },
    { name: "Kasimu Muendo Mulei", admission: "1234" },
    { name: "Mutua Kilonzo Ndeti", admission: "5678" },
    { name: "Musyoka Kioko Kimeu", admission: "9012" },
    { name: "Muthama Mutisya Musingi", admission: "3456" }
  ];

  const nameFormats = [
    "Musau Mutuku",
    "Musau Mwanzia Mutuku", 
    "MUSAU MUTUKU",
    "musau mutuku",
    "M. Mutuku",
    "Mutuku Musau",
    "Mutinda Kitheka",
    "Kasimu Muendo"
  ];

  return (
    <div 
      className="fixed inset-0 bg-maroon-950/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4 animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <main className="bg-gradient-to-br from-white via-amber-50 to-maroon-50 rounded-2xl shadow-2xl w-full max-w-3xl border-2 border-amber-500/30 overflow-hidden transform transition-all duration-300 scale-100 my-auto max-h-[90vh] flex flex-col">
        
        {/* Header with School Logo - Kinyui Branding */}
        <header className="bg-gradient-to-r from-maroon-900 via-maroon-800 to-amber-800 px-6 py-4 text-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* School Logo Container */}
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-md"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-maroon-700 to-amber-600 rounded-full p-1 shadow-xl">
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
                <p className="text-amber-200 text-xs font-semibold tracking-wider">
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
          <div className="mb-5 bg-gradient-to-r from-amber-500/10 to-maroon-500/10 rounded-xl p-3 border border-amber-500/20 text-center">
            <p className="text-maroon-800 font-bold italic text-sm flex items-center justify-center gap-2">
              <FiStar className="text-amber-600" />
              "Soaring to Excellence"
              <FiStar className="text-amber-600" />
            </p>
            <p className="text-maroon-600 text-xs mt-1">EST. 1976 | CENTRE OF EXCELLENCE</p>
          </div>

          {/* Flexible Name Instructions - Male Students Only */}
          <section className="mb-5 bg-gradient-to-r from-amber-50 to-maroon-50 rounded-xl p-4 border border-amber-300">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-maroon-100 rounded-lg">
                <FiCheckCircle className="text-maroon-700 text-sm" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 className="text-sm font-bold text-maroon-900 mb-1">Male Student Name Entry</h2>
                <p className="text-maroon-700 text-xs mb-2">
                  Enter your name in any format (uppercase, lowercase, 2 or 3 names)
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {nameFormats.map((format, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handleInputChange('fullName', format)}
                      className="px-2 py-1 bg-maroon-100 text-maroon-800 rounded-lg text-xs cursor-pointer hover:bg-maroon-200 transition-all duration-200 border border-maroon-300 hover:scale-105"
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
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-300">
                  <div className="p-1.5 bg-red-100 rounded-full">
                    <FiAlertCircle className="text-red-600 text-sm" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-red-900 mb-1">
                      {showContactInfo ? 'Record Verification Needed' : 'Login Issue'}
                    </h3>
                    <p className="text-red-700 text-xs">{localError}</p>
                    
                    {showContactInfo && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-maroon-800">
                          <FiHelpCircle className="text-maroon-600" />
                          <span className="font-bold">Next Steps:</span>
                        </div>
                        <ul className="text-xs text-maroon-700 space-y-1 ml-5 list-decimal">
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
                <div className="p-2 bg-gradient-to-r from-maroon-100 to-amber-100 rounded-xl">
                  <FiShield className="text-maroon-700 text-sm" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-maroon-900">Secure Student Access</h3>
                  <div className="flex items-center gap-2 text-maroon-600 text-xs">
                    <FiClock className="text-amber-600" />
                    <span>Session Duration: <strong className="text-maroon-800">2 Hours</strong></span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-maroon-50 to-amber-50 rounded-xl p-3 border border-maroon-200">
                <p className="text-maroon-800 text-xs font-medium">
                  <strong>Note:</strong> Use your official admission number and name as registered for Kinyui Boys' Senior School.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Input */}
              <fieldset>
                <label className="text-xs font-bold text-maroon-900 flex items-center gap-2 mb-2">
                  <FiUser className="text-amber-600 text-sm" />
                  <span>Full Name (Male Student)</span>
                  <span className="text-[10px] text-maroon-600 bg-maroon-100 px-2 py-0.5 rounded-full">Flexible Format</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="e.g., Musau Mutuku, MUSAU MUTUKU, M. Mutuku"
                  className={`
                    w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-amber-500/40 
                    focus:border-amber-600 transition-all duration-200 text-sm bg-white
                    ${validationErrors.fullName 
                      ? 'border-red-500 focus:border-red-600' 
                      : 'border-maroon-300 hover:border-maroon-400'
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
                
                {/* Quick Select - Male Student Examples */}
                <div className="mt-3">
                  <p className="text-maroon-600 text-[10px] font-semibold mb-2">⬇️ Quick Select (Male Students):</p>
                  <div className="flex flex-wrap gap-2">
                    {studentExamples.map((student, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          handleInputChange('fullName', student.name);
                          handleInputChange('admissionNumber', student.admission);
                        }}
                        className="px-2 py-1 bg-gradient-to-r from-maroon-100 to-amber-100 hover:from-maroon-200 hover:to-amber-200 text-maroon-800 rounded-lg text-[10px] border border-maroon-300 shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                      >
                        {student.name.split(' ')[0]} • {student.admission}
                      </button>
                    ))}
                  </div>
                </div>
              </fieldset>

              {/* Admission Number Input */}
              <fieldset>
                <label className="text-xs font-bold text-maroon-900 flex items-center gap-2 mb-2">
                  <FiLock className="text-amber-600 text-sm" />
                  <span>Admission Number</span>
                  <span className="text-[10px] text-maroon-600 bg-maroon-100 px-2 py-0.5 rounded-full">Unique ID</span>
                </label>
                <input
                  type="text"
                  value={formData.admissionNumber}
                  onChange={(e) => handleInputChange('admissionNumber', e.target.value.toUpperCase())}
                  placeholder="e.g., 2903, AB12, 2023001"
                  className={`
                    w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-amber-500/40 
                    focus:border-amber-600 transition-all duration-200 text-sm bg-white uppercase
                    ${validationErrors.admissionNumber 
                      ? 'border-red-500 focus:border-red-600' 
                      : 'border-maroon-300 hover:border-maroon-400'
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
                  <p className="text-maroon-600 text-[10px] font-semibold mb-2">⬇️ Example Formats:</p>
                  <div className="flex flex-wrap gap-2">
                    {['2903', 'AB12', '2023001', 'STU456', 'KM001'].map((example, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleInputChange('admissionNumber', example)}
                        className="px-2 py-1 bg-maroon-100 text-maroon-800 rounded-lg text-[10px] border border-maroon-300 hover:bg-maroon-200 transition-all duration-200 font-mono"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </fieldset>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700 rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg border border-gray-400 active:scale-95"
                >
                  <FiX className="text-sm" />
                  <span>Clear</span>
                </button>

                <button
                  type="submit"
                  disabled={isLoading || !formData.fullName.trim() || !formData.admissionNumber.trim()}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-maroon-700 via-maroon-800 to-amber-700 hover:from-maroon-800 hover:via-maroon-900 hover:to-amber-800 text-white rounded-xl font-bold text-sm disabled:opacity-70 flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl border border-amber-600 active:scale-95"
                >
                  {isLoading ? (
                    <>
                      <CircularProgress size={16} thickness={4} sx={{ color: "white" }} />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <FiLogIn className="text-sm" />
                      <span>Login to Portal</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Features Grid */}
            <section className="mt-6 pt-4 border-t border-maroon-200">
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 bg-gradient-to-r from-maroon-50 to-maroon-100 rounded-xl">
                  <FiBook className="text-maroon-600 text-base mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-maroon-800">Learning Resources</p>
                </div>
                <div className="text-center p-2 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl">
                  <FiShield className="text-amber-600 text-base mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-amber-800">Secure Access</p>
                </div>
                <div className="text-center p-2 bg-gradient-to-r from-maroon-50 to-amber-50 rounded-xl">
                  <FiAward className="text-maroon-600 text-base mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-maroon-800">Excellence</p>
                </div>
              </div>
            </section>
          </section>
        </article>

        {/* Footer */}
        <footer className="px-6 py-3 bg-gradient-to-r from-maroon-900 to-amber-900 flex-shrink-0">
          <p className="text-center text-amber-200 text-xs">
            © {new Date().getFullYear()} Kinyui Boys' Senior School | For assistance, contact school administration
          </p>
        </footer>
      </main>

      {/* Global Styles */}
      <style jsx global>{`
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
          background: #fde68a;
          border-radius: 3px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #800020;
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