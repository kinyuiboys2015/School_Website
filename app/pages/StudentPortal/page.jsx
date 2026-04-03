'use client';

import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import CircularProgress from "@mui/material/CircularProgress";
import { 
  FiUser, FiLock, FiAlertCircle, FiHelpCircle, FiLogIn, 
  FiCheckCircle, FiStar, FiAward, FiBook, FiShield, FiClock
} from 'react-icons/fi';
import { FaArrowRight } from 'react-icons/fa6';
import { HiSparkles } from "react-icons/hi2";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export default function StudentLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    admissionNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requiresContact, setRequiresContact] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [student, setStudent] = useState(null);
  const [token, setToken] = useState(null);

  // Check for existing session
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedToken = localStorage.getItem('student_token');
        if (!savedToken) return;

        const response = await fetch('/api/studentlogin', {
          headers: { 'Authorization': `Bearer ${savedToken}` }
        });

        const data = await response.json();

        if (data.success && data.authenticated) {
          setStudent(data.student);
          setToken(savedToken);
          setIsAuthenticated(true);
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, [router]);

  const validateInputs = () => {
    const errors = {};
    
    if (!formData.fullName.trim()) {
      errors.fullName = 'Please enter your name';
    } else {
      const nameParts = formData.fullName.trim().split(/\s+/).filter(part => part.length > 0);
      if (nameParts.length < 1) {
        errors.fullName = 'Please enter at least your first name';
      }
      
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setRequiresContact(false);
    setValidationErrors({});
    
    if (!validateInputs()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/studentlogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fullName: formData.fullName.trim(), 
          admissionNumber: formData.admissionNumber.trim() 
        })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('student_token', data.token);
        setStudent(data.student);
        setToken(data.token);
        setIsAuthenticated(true);
        
        toast.success('Login Successful!', {
          description: `Welcome to Kinyui Boys' Portal, ${data.student.fullName}`
        });

        router.push('/dashboard');
      } else {
        setError(data.error);
        setRequiresContact(data.requiresContact || false);
        
        if (data.requiresContact) {
          toast.error('Student Record Not Found', {
            description: 'Please contact your class teacher or school administrator for assistance.'
          });
        } else {
          toast.error(data.error || 'Login failed. Please check your credentials.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection and try again.');
      toast.error('Connection Error', {
        description: 'Unable to connect to the server. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({ fullName: '', admissionNumber: '' });
    setError(null);
    setRequiresContact(false);
    setValidationErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

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
    "Mutuku Musau"
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <Toaster position="top-right" expand={true} richColors theme="light" />
      
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <main className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-3 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-4 lg:px-12">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gray-900/10 rounded-md blur-sm"></div>
                <Image
                  src="/kinyui.png"
                  alt="Kinyui Boys Senior School Logo"
                  width={32}
                  height={32}
                  className="rounded-md w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 relative"
                  priority
                />
              </div>
              <div>
                <span className="text-sm xs:text-base sm:text-lg md:text-xl font-black tracking-tighter block leading-none text-gray-900">
                  KINYUI BOYS'
                </span>
                <span className="text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] font-bold text-gray-600 
                  tracking-[0.1em] xs:tracking-[0.15em] sm:tracking-[0.2em] uppercase">
                  Student Portal
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-full border border-gray-200">
                <div className="w-1.5 h-1.5 bg-gray-900 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-gray-700 uppercase tracking-wider">Secure Access</span>
                <FiShield className="w-3 h-3 text-gray-700" />
              </div>
              <button className="text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">Support Center</button>
            </div>
          </div>
        </nav>

        {/* Main Login Section */}
        <section className="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 lg:py-20 max-w-7xl mx-auto w-full flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-center">
            
            {/* Left Column - Welcome Message */}
            <div className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-8">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg border border-gray-200 
                text-[8px] xs:text-[9px] sm:text-[10px] font-bold tracking-widest uppercase text-gray-700 whitespace-nowrap">
                <HiSparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-700" />
                Excellence in Education Since 1976
              </div>
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 
                font-black tracking-tighter leading-[0.85] xs:leading-[0.9] text-gray-900">
                EDUCATION  
                <span className="block text-gray-600 italic mt-1 xs:mt-2">IS LIGHT.</span>
              </h1>
              <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 font-medium 
                max-w-full xs:max-w-xs sm:max-w-md leading-relaxed xs:leading-snug">
                Welcome to the Kinyui Boys' Senior School Digital Student Portal. Login to access your academic resources, track performance, and stay connected.
              </p>
            </div>

            {/* Right Column - Login Form */}
            <div className="bg-white border border-gray-200 shadow-xl rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8">
              {/* School Motto Banner */}
              <div className="mb-5 bg-gray-50 rounded-xl p-3 border border-gray-200 text-center">
                <p className="text-gray-700 font-bold italic text-sm flex items-center justify-center gap-2">
                  <FiStar className="text-gray-500" />
                  "Soaring to Excellence"
                  <FiStar className="text-gray-500" />
                </p>
                <p className="text-gray-500 text-xs mt-1">EST. 1976 | CENTRE OF EXCELLENCE</p>
              </div>

              {/* Name Format Instructions */}
              <div className="mb-5 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <FiCheckCircle className="text-gray-700 text-sm" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-sm font-bold text-gray-900 mb-1">Student Name Entry</h2>
                    <p className="text-gray-600 text-xs mb-2">
                      Enter your name in any format (uppercase, lowercase, 2 or 3 names)
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {nameFormats.map((format, idx) => (
                        <button 
                          key={idx}
                          onClick={() => handleInputChange('fullName', format)}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs cursor-pointer hover:bg-gray-200 transition-all duration-200 border border-gray-200"
                          type="button"
                        >
                          {format}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Error/Contact Info */}
              {(requiresContact || error) && (
                <div className="mb-5 animate-slideDown">
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-200">
                    <div className="p-1.5 bg-red-100 rounded-full">
                      <FiAlertCircle className="text-red-600 text-sm" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-red-800 mb-1">
                        {requiresContact ? 'Record Verification Needed' : 'Login Issue'}
                      </h3>
                      <p className="text-red-600 text-xs">{error}</p>
                      
                      {requiresContact && (
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2 text-xs text-gray-700">
                            <FiHelpCircle className="text-gray-600" />
                            <span className="font-bold">Next Steps:</span>
                          </div>
                          <ul className="text-xs text-gray-600 space-y-1 ml-5 list-decimal">
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

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Secure Access Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gray-100 rounded-xl">
                      <FiShield className="text-gray-700 text-sm" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Secure Student Access</h3>
                      <div className="flex items-center gap-2 text-gray-600 text-xs">
                        <FiClock className="text-gray-500" />
                        <span>Session Duration: <strong className="text-gray-900">2 Hours</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <p className="text-gray-600 text-xs font-medium">
                      <strong className="text-gray-900">Note:</strong> Use your official admission number and name as registered for Kinyui Boys' Senior School.
                    </p>
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-2 mb-2">
                    <FiUser className="text-gray-600 text-sm" />
                    <span>Full Name (Male Student)</span>
                    <span className="text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">Flexible Format</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="e.g., Musau Mutuku, MUSAU MUTUKU, M. Mutuku"
                    className={`
                      w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-gray-900/20 
                      focus:border-gray-900 transition-all duration-200 text-sm bg-white text-gray-900 placeholder-gray-400
                      ${validationErrors.fullName 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 hover:border-gray-400'
                      }
                    `}
                    disabled={loading}
                    autoComplete="name"
                  />
                  {validationErrors.fullName && (
                    <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                      <FiAlertCircle className="text-xs" />
                      {validationErrors.fullName}
                    </p>
                  )}
                  
                  {/* Quick Select Examples */}
                  <div className="mt-3">
                    <p className="text-gray-600 text-[10px] font-semibold mb-2">⬇️ Quick Select (Male Students):</p>
                    <div className="flex flex-wrap gap-2">
                      {studentExamples.map((student, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            handleInputChange('fullName', student.name);
                            handleInputChange('admissionNumber', student.admission);
                          }}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[10px] border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                        >
                          {student.name.split(' ')[0]} • {student.admission}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Admission Number Input */}
                <div>
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-2 mb-2">
                    <FiLock className="text-gray-600 text-sm" />
                    <span>Admission Number</span>
                    <span className="text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">Unique ID</span>
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
                    disabled={loading}
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
                    <p className="text-gray-600 text-[10px] font-semibold mb-2">⬇️ Example Formats:</p>
                    <div className="flex flex-wrap gap-2">
                      {['2903', 'AB12', '2023001', 'STU456', 'KM001'].map((example, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleInputChange('admissionNumber', example)}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-[10px] border border-gray-200 hover:bg-gray-200 transition-all duration-200 font-mono"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={loading}
                    className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2 transition-all duration-200 shadow-sm hover:shadow-md border border-gray-200 active:scale-95"
                  >
                    <FiLogIn className="text-sm rotate-180" />
                    <span>Clear</span>
                  </button>

                  <button
                    type="submit"
                    disabled={loading || !formData.fullName.trim() || !formData.admissionNumber.trim()}
                    className="flex-1 py-3 px-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-sm disabled:opacity-70 flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-800 active:scale-95"
                  >
                    {loading ? (
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
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 bg-gray-50 rounded-xl">
                    <FiBook className="text-gray-700 text-base mx-auto mb-1" />
                    <p className="text-[10px] font-bold text-gray-600">Learning Resources</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-xl">
                    <FiShield className="text-gray-700 text-base mx-auto mb-1" />
                    <p className="text-[10px] font-bold text-gray-600">Secure Access</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-xl">
                    <FiAward className="text-gray-700 text-base mx-auto mb-1" />
                    <p className="text-[10px] font-bold text-gray-600">Excellence</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-3 xs:px-4 sm:px-6 md:px-8 lg:px-12 py-6 xs:py-8 sm:py-10 md:py-12 bg-gray-900">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-6 xs:gap-8 sm:gap-10 md:gap-12">
            <div className="flex flex-col items-center lg:items-start gap-3 xs:gap-4 text-center lg:text-left">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <FiBook className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                </div>
                <span className="text-sm xs:text-base font-bold tracking-tight text-white">Kinyui Boys' Senior School</span>
              </div>
              <p className="text-[9px] xs:text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                © {new Date().getFullYear()} Kinyui Boys' Senior School. All Rights Reserved.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 xs:gap-6 sm:gap-8 md:gap-10">
              <div className="space-y-1 xs:space-y-2 text-center">
                <p className="text-[9px] xs:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Academics
                </p>
                <p className="text-xs font-bold text-white hover:text-gray-300 cursor-pointer transition-colors duration-300">
                  KNEC Portal
                </p>
              </div>
              <div className="space-y-1 xs:space-y-2 text-center">
                <p className="text-[9px] xs:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Finance
                </p>
                <p className="text-xs font-bold text-white hover:text-gray-300 cursor-pointer transition-colors duration-300">
                  Payment Options
                </p>
              </div>
              <div className="space-y-1 xs:space-y-2 text-center">
                <p className="text-[9px] xs:text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Support
                </p>
                <p className="text-xs font-bold text-white hover:text-gray-300 cursor-pointer transition-colors duration-300">
                  IT Help Desk
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}