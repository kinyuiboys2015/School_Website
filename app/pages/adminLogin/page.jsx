'use client';

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck,
  Key,
  Cpu,
  Database,
  Shield,
  Users,
  Building,
  Server,
  Network,
  Smartphone,
  CheckCircle,
  Globe,
  X,
  RefreshCw,
  AlertCircle,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';
import Link from 'next/link';
import Image from "next/image";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Verification Modal States
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verificationReason, setVerificationReason] = useState('');
  const [requiresPasswordAfterVerification, setRequiresPasswordAfterVerification] = useState(false);
  const [passwordAfterVerification, setPasswordAfterVerification] = useState('');

  // Password Reset Modal
  const [showPasswordResetModal, setShowPasswordResetModal] = useState(false);
  const [resetLink, setResetLink] = useState('');

  const router = useRouter();

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Device Fingerprint Generator
  class DeviceFingerprint {
    static generate() {
      const fingerprint = {
        userAgent: navigator.userAgent,
        screen: {
          width: screen.width,
          height: screen.height,
          colorDepth: screen.colorDepth,
          pixelRatio: window.devicePixelRatio
        },
        language: navigator.language || navigator.userLanguage,
        platform: navigator.platform,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        languages: navigator.languages
      };

      return {
        raw: fingerprint,
        hash: this.hashFingerprint(fingerprint)
      };
    }

    static hashFingerprint(fingerprint) {
      const str = JSON.stringify(fingerprint);
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash).toString(36);
    }
  }

class LocalStorageManager {
    static KEYS = {
        DEVICE_FINGERPRINT: 'device_fingerprint',
        DEVICE_TOKEN: 'device_token',
        LOGIN_COUNT: 'login_count',
        LAST_LOGIN: 'last_login',
        ADMIN_TOKEN: 'admin_token',
        ADMIN_USER: 'admin_user',
        DASHBOARD_ACCESS: 'last_dashboard_access'
    };



static checkAdminTokenValidity() {
    try {
        const token = localStorage.getItem(this.KEYS.ADMIN_TOKEN);
        
        if (!token) {
            return { isValid: false, reason: 'no_token' };
        }
        
        // Parse token to check expiration
        const tokenData = this.parseJwt(token);
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (tokenData.exp && tokenData.exp <= currentTime) {
            console.log('🔑 Admin token expired');
            return { isValid: false, reason: 'expired' };
        }
        
        return { isValid: true, expiresAt: new Date(tokenData.exp * 1000) };
    } catch (error) {
        console.error('Error checking admin token:', error);
        return { isValid: false, reason: 'parse_error' };
    }
}



    // Helper function for base64 URL decoding
    static base64UrlDecode(str) {
        // Replace URL-safe characters
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        
        // Add padding if needed
        const pad = str.length % 4;
        if (pad) {
            if (pad === 1) {
                throw new Error('Invalid base64 string');
            }
            str += '==='.slice(pad);
        }
        
        return atob(str);
    }

    // Helper function to parse JWT
    static parseJwt(token) {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format');
            }
            
            const payload = parts[1];
            const decoded = this.base64UrlDecode(payload);
            return JSON.parse(decoded);
        } catch (error) {
            console.error('JWT parsing error:', error);
            throw error;
        }
    }
static checkVerificationRequirement(forceCheck = false) {
    try {
        console.log('🔍 Checking verification requirement:', { forceCheck });
        
        // If we're not forcing a check and have a valid device token, skip deep check
        if (!forceCheck) {
            const deviceToken = localStorage.getItem(this.KEYS.DEVICE_TOKEN);
            const storedFingerprint = localStorage.getItem(this.KEYS.DEVICE_FINGERPRINT);
            const currentFingerprint = DeviceFingerprint.generate();
            
            // Quick check: if we have a token and fingerprint matches, likely valid
            if (deviceToken && storedFingerprint === currentFingerprint.hash) {
                console.log('✅ Quick check passed - likely valid device');
                return { 
                    requiresVerification: false,
                    deviceToken: deviceToken,
                    deviceHash: currentFingerprint.hash
                };
            }
        }
        
        // Full check (only when forced or quick check fails)
        const deviceToken = localStorage.getItem(this.KEYS.DEVICE_TOKEN);
        const storedFingerprint = localStorage.getItem(this.KEYS.DEVICE_FINGERPRINT);
        const currentFingerprint = DeviceFingerprint.generate();
        
        console.log('📱 Full device data check:', {
            hasDeviceToken: !!deviceToken,
            hasStoredFingerprint: !!storedFingerprint,
            currentFingerprint: currentFingerprint.hash.substring(0, 10) + '...',
            storedFingerprint: storedFingerprint ? storedFingerprint.substring(0, 10) + '...' : 'none'
        });

        // CASE 1: No device token at all - new device
        if (!deviceToken) {
            console.log('📱 No device token found - NEW DEVICE');
            return { 
                requiresVerification: true, 
                reason: 'new_device',
                deviceToken: null,
                deviceHash: currentFingerprint.hash
            };
        }

        // CASE 2: Validate device token structure
        try {
            let tokenData;
            
            // Check if it's a JWT (has dots) or custom base64 token
            if (deviceToken.includes('.')) {
                // It's a JWT
                tokenData = this.parseJwt(deviceToken);
            } else {
                // Try to decode as custom base64 token
                const decodedStr = this.base64UrlDecode(deviceToken);
                tokenData = JSON.parse(decodedStr);
            }
            
            console.log('🔑 Token data parsed:', {
                deviceHash: tokenData.deviceHash ? `${tokenData.deviceHash.substring(0, 10)}...` : 'missing',
                loginCount: tokenData.loginCount || 0,
                exp: tokenData.exp ? new Date(tokenData.exp * 1000).toLocaleString() : 'missing'
            });

            // Check expiration (token.exp is in seconds)
            const currentTime = Math.floor(Date.now() / 1000);
            const tokenExpiry = tokenData.exp;
            
            if (!tokenExpiry) {
                console.log('❌ Token missing expiry');
                return { 
                    requiresVerification: true, 
                    reason: 'token_invalid',
                    deviceToken: deviceToken,
                    deviceHash: currentFingerprint.hash
                };
            }

            // Check if token is expired
            if (tokenExpiry <= currentTime) {
                console.log('⏰ Token expired');
                return { 
                    requiresVerification: true, 
                    reason: 'token_expired',
                    deviceToken: deviceToken,
                    deviceHash: currentFingerprint.hash
                };
            }

            // Check max login attempts (15)
            const loginCount = tokenData.loginCount || 0;
            if (loginCount >= 15) {
                console.log('🚫 Max login attempts reached:', loginCount);
                return { 
                    requiresVerification: true, 
                    reason: 'max_logins_reached',
                    deviceToken: deviceToken,
                    loginCount: loginCount,
                    deviceHash: currentFingerprint.hash
                };
            }

            // Check fingerprint matches
            if (storedFingerprint !== currentFingerprint.hash) {
                console.log('⚠️ Device fingerprint mismatch');
                return { 
                    requiresVerification: true, 
                    reason: 'device_mismatch',
                    deviceToken: deviceToken,
                    deviceHash: currentFingerprint.hash
                };
            }

            // Check if device hash in token matches current fingerprint
            if (tokenData.deviceHash && tokenData.deviceHash !== currentFingerprint.hash) {
                console.log('🔐 Token device hash mismatch');
                return { 
                    requiresVerification: true, 
                    reason: 'token_device_mismatch',
                    deviceToken: deviceToken,
                    deviceHash: currentFingerprint.hash
                };
            }

            console.log('✅ Device token is VALID');
            return { 
                requiresVerification: false, 
                deviceToken: deviceToken, 
                loginCount: loginCount,
                deviceHash: currentFingerprint.hash 
            };

        } catch (tokenError) {
            console.error('❌ Token parsing error:', tokenError);
            return { 
                requiresVerification: true, 
                reason: 'invalid_token_format',
                deviceToken: deviceToken,
                deviceHash: currentFingerprint.hash
            };
        }

    } catch (error) {
        console.error('❌ LocalStorage check error:', error);
        return { 
            requiresVerification: true, 
            reason: 'storage_error',
            deviceToken: null,
            deviceHash: null
        };
    }
}

    static storeDeviceData(deviceToken, deviceHash, loginCount) {
        try {
            console.log('💾 Storing device data:', {
                deviceTokenLength: deviceToken ? deviceToken.length : 0,
                deviceHash: deviceHash.substring(0, 10) + '...',
                loginCount: loginCount
            });
            
            localStorage.setItem(this.KEYS.DEVICE_TOKEN, deviceToken);
            localStorage.setItem(this.KEYS.DEVICE_FINGERPRINT, deviceHash);
            localStorage.setItem(this.KEYS.LAST_LOGIN, new Date().toISOString());
            localStorage.setItem(this.KEYS.LOGIN_COUNT, loginCount.toString());
            
            // Remove any old requires_verification flag
            localStorage.removeItem('requires_verification');
            
            console.log('✅ Device data stored successfully');
            
            // Verify storage
            const storedToken = localStorage.getItem(this.KEYS.DEVICE_TOKEN);
            const storedHash = localStorage.getItem(this.KEYS.DEVICE_FINGERPRINT);
            console.log('🔍 Storage verification:', {
                tokenStored: !!storedToken,
                hashStored: !!storedHash,
                tokenMatches: storedToken === deviceToken
            });
            
        } catch (error) {
            console.error('❌ Error storing device data:', error);
        }
    }

    static storeAuthData(authToken, userData) {
        try {
            localStorage.setItem(this.KEYS.ADMIN_TOKEN, authToken);
            localStorage.setItem(this.KEYS.ADMIN_USER, JSON.stringify(userData));
            console.log('🔐 Auth data stored');
        } catch (error) {
            console.error('❌ Error storing auth data:', error);
        }
    }

    static storeDashboardAccess() {
        try {
            localStorage.setItem(this.KEYS.DASHBOARD_ACCESS, new Date().toISOString());
            console.log('📊 Dashboard access timestamp stored');
        } catch (error) {
            console.error('❌ Error storing dashboard access:', error);
        }
    }

    static getLastDashboardAccess() {
        try {
            const timestamp = localStorage.getItem(this.KEYS.DASHBOARD_ACCESS);
            return timestamp ? new Date(timestamp) : null;
        } catch (error) {
            console.error('❌ Error getting dashboard access:', error);
            return null;
        }
    }

    static getAuthData() {
        try {
            const token = localStorage.getItem(this.KEYS.ADMIN_TOKEN);
            const userStr = localStorage.getItem(this.KEYS.ADMIN_USER);
            const user = userStr ? JSON.parse(userStr) : null;
            
            return { token, user };
        } catch (error) {
            console.error('❌ Error getting auth data:', error);
            return { token: null, user: null };
        }
    }

    static getDeviceData() {
        try {
            const token = localStorage.getItem(this.KEYS.DEVICE_TOKEN);
            const fingerprint = localStorage.getItem(this.KEYS.DEVICE_FINGERPRINT);
            const loginCount = parseInt(localStorage.getItem(this.KEYS.LOGIN_COUNT) || '0', 10);
            const lastLogin = localStorage.getItem(this.KEYS.LAST_LOGIN);
            
            return { token, fingerprint, loginCount, lastLogin };
        } catch (error) {
            console.error('❌ Error getting device data:', error);
            return { token: null, fingerprint: null, loginCount: 0, lastLogin: null };
        }
    }

    static clearLoginData() {
        try {
            localStorage.removeItem(this.KEYS.DEVICE_TOKEN);
            localStorage.removeItem(this.KEYS.DEVICE_FINGERPRINT);
            localStorage.removeItem(this.KEYS.LOGIN_COUNT);
            localStorage.removeItem(this.KEYS.LAST_LOGIN);
            localStorage.removeItem('requires_verification');
            console.log('🧹 Cleared all device login data');
        } catch (error) {
            console.error('❌ Error clearing login data:', error);
        }
    }

    static clearAllAuthData() {
        try {
            this.clearLoginData();
            localStorage.removeItem(this.KEYS.ADMIN_TOKEN);
            localStorage.removeItem(this.KEYS.ADMIN_USER);
            localStorage.removeItem(this.KEYS.DASHBOARD_ACCESS);
            console.log('🧹 Cleared all authentication data');
        } catch (error) {
            console.error('❌ Error clearing auth data:', error);
        }
    }

    static isAuthenticated() {
        try {
            const token = localStorage.getItem(this.KEYS.ADMIN_TOKEN);
            const userStr = localStorage.getItem(this.KEYS.ADMIN_USER);
            
            if (!token || !userStr) {
                return false;
            }
            
            // Optional: Check if token is expired (if it's a JWT)
            if (token.includes('.')) {
                try {
                    const tokenData = this.parseJwt(token);
                    const currentTime = Math.floor(Date.now() / 1000);
                    
                    if (tokenData.exp && tokenData.exp <= currentTime) {
                        console.log('🔑 Auth token expired');
                        return false;
                    }
                } catch (e) {
                    console.warn('Could not parse auth token for expiration check:', e);
                }
            }
            
            return true;
        } catch (error) {
            console.error('❌ Error checking authentication:', error);
            return false;
        }
    }

    static getUser() {
        try {
            const userStr = localStorage.getItem(this.KEYS.ADMIN_USER);
            if (!userStr) {
                return null;
            }
            
            return JSON.parse(userStr);
        } catch (error) {
            console.error('❌ Error getting user:', error);
            return null;
        }
    }

    static getToken() {
        try {
            return localStorage.getItem(this.KEYS.ADMIN_TOKEN);
        } catch (error) {
            console.error('❌ Error getting token:', error);
            return null;
        }
    }

    static hasValidDeviceToken() {
        try {
            const deviceToken = localStorage.getItem(this.KEYS.DEVICE_TOKEN);
            if (!deviceToken) {
                return false;
            }
            
            const checkResult = this.checkVerificationRequirement();
            return !checkResult.requiresVerification;
        } catch (error) {
            console.error('❌ Error checking device token:', error);
            return false;
        }
    }

    static getLoginCount() {
        try {
            const count = localStorage.getItem(this.KEYS.LOGIN_COUNT);
            return count ? parseInt(count, 10) : 0;
        } catch (error) {
            console.error('❌ Error getting login count:', error);
            return 0;
        }
    }

    static incrementLoginCount() {
        try {
            const currentCount = this.getLoginCount();
            const newCount = currentCount + 1;
            localStorage.setItem(this.KEYS.LOGIN_COUNT, newCount.toString());
            
            // Also update the device token if it exists
            const deviceToken = localStorage.getItem(this.KEYS.DEVICE_TOKEN);
            if (deviceToken) {
                try {
                    let tokenData;
                    if (deviceToken.includes('.')) {
                        tokenData = this.parseJwt(deviceToken);
                    } else {
                        const decodedStr = this.base64UrlDecode(deviceToken);
                        tokenData = JSON.parse(decodedStr);
                    }
                    
                    // Update login count in token
                    tokenData.loginCount = newCount;
                    
                    // Re-encode the token (simple base64 for now)
                    const updatedToken = btoa(JSON.stringify(tokenData));
                    localStorage.setItem(this.KEYS.DEVICE_TOKEN, updatedToken);
                    
                    console.log('📈 Login count incremented to:', newCount);
                } catch (tokenError) {
                    console.error('❌ Error updating token login count:', tokenError);
                }
            }
            
            return newCount;
        } catch (error) {
            console.error('❌ Error incrementing login count:', error);
            return 0;
        }
    }

    static setRequiresVerification(reason = 'security_check') {
        try {
            localStorage.setItem('requires_verification', 'true');
            localStorage.setItem('verification_reason', reason);
            console.log('⚠️ Verification required set:', reason);
        } catch (error) {
            console.error('❌ Error setting verification requirement:', error);
        }
    }

    static clearVerificationFlag() {
        try {
            localStorage.removeItem('requires_verification');
            localStorage.removeItem('verification_reason');
            console.log('✅ Verification flags cleared');
        } catch (error) {
            console.error('❌ Error clearing verification flags:', error);
        }
    }

    static shouldShowVerification() {
        try {
            const requiresVerification = localStorage.getItem('requires_verification');
            const reason = localStorage.getItem('verification_reason');
            
            return {
                requires: requiresVerification === 'true',
                reason: reason || 'unknown'
            };
        } catch (error) {
            console.error('❌ Error checking verification flag:', error);
            return { requires: false, reason: 'error' };
        }
    }

    static debugAllStorage() {
        try {
            console.log('📋 === LOCALSTORAGE DEBUG INFO ===');
            
            // Device data
            const deviceData = this.getDeviceData();
            console.log('📱 Device Data:', deviceData);
            
            // Auth data
            const authData = this.getAuthData();
            console.log('🔐 Auth Data:', {
                hasToken: !!authData.token,
                tokenLength: authData.token ? authData.token.length : 0,
                user: authData.user ? {
                    id: authData.user.id,
                    name: authData.user.name,
                    email: authData.user.email,
                    role: authData.user.role
                } : null
            });
            
            // All localStorage items
            console.log('🗂️ All localStorage items:');
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                const value = localStorage.getItem(key);
                console.log(`  ${key}: ${value ? value.substring(0, 50) + (value.length > 50 ? '...' : '') : 'null'}`);
            }
            
            console.log('📋 === END DEBUG INFO ===');
        } catch (error) {
            console.error('❌ Error debugging storage:', error);
        }
    }
}

  // Handle verification code input
  const handleVerificationCodeChange = (index, value) => {
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value.replace(/\D/g, '');
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`verification-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
    
    setVerificationCode(newCode);
  };

  // Handle backspace
  const handleVerificationKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`verification-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

// Handle OTP verification
const handleVerifyCode = async (e) => {
  if (e) e.preventDefault();
  
  const code = verificationCode.join('');
  if (code.length !== 6) {
    toast.error('Please enter the complete 6-digit code');
    return;
  }

  setVerificationLoading(true);

  try {
    const deviceFingerprint = DeviceFingerprint.generate();
    
    // Get pending verification info
    const pendingVerification = JSON.parse(localStorage.getItem('pending_verification_device') || '{}');
    
    // Always use the stored verificationEmail
    const emailToUse = verificationEmail || formData.email;
    
    if (!emailToUse) {
      toast.error('Email not found. Please try logging in again.');
      setVerificationLoading(false);
      return;
    }
    
    console.log('🔐 Verifying OTP with reset info:', {
      email: emailToUse,
      deviceHash: deviceFingerprint.hash,
      pendingReason: pendingVerification.reason,
      shouldReset: pendingVerification.reason === 'max_logins_reached' || 
                  pendingVerification.reason === 'expired'
    });
    
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailToUse,
        verificationCode: code,
        action: 'verify',
        clientDeviceHash: deviceFingerprint.hash,
        // Tell backend to reset counts if max was reached
        shouldResetCounts: pendingVerification.reason === 'max_logins_reached' || 
                         pendingVerification.reason === 'expired'
      }),
    });

    const data = await response.json();
    console.log('📩 OTP verification response:', {
      success: data.success,
      countsWereReset: data.countsWereReset,
      loginCount: data.loginCount
    });

    if (response.ok && data.success) {
      // Clear the pending verification flag
      localStorage.removeItem('pending_verification_device');
      
      // Clear OLD device data if counts were reset
      if (data.countsWereReset) {
        console.log('🔄 Backend reset device counts. New count:', data.loginCount);
        
        // Clear ALL old device data
        LocalStorageManager.clearLoginData();
        
        // Store fresh device data with reset count (should be 1)
        if (data.deviceToken) {
          LocalStorageManager.storeDeviceData(
            data.deviceToken, 
            deviceFingerprint.hash, 
            data.loginCount || 1
          );
        }
        
        toast.success(`Login successful! Device verification counts have been reset.`);
      } else {
        // Regular verification without reset
        if (data.deviceToken) {
          LocalStorageManager.storeDeviceData(
            data.deviceToken, 
            deviceFingerprint.hash, 
            data.loginCount || 1
          );
        }
        
        toast.success(`Login successful! Welcome back ${data.user?.name || ''}.`);
      }
      
      // Store auth token
      if (data.token) {
        LocalStorageManager.storeAuthData(data.token, data.user);
      }
      
      // Clear all verification states
      setShowVerificationModal(false);
      setVerificationCode(['', '', '', '', '', '']);
      setVerificationEmail('');
      setPasswordAfterVerification('');
      setRequiresPasswordAfterVerification(false);
      
      // Show special message if counts were reset
      if (data.countsWereReset) {
        toast.info('Device verification counts have been reset. You now have 15 fresh logins available.');
      }
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/MainDashboard');
      }, 1000);
    } else {
      // Check if password is required after verification
      if (data.requiresPassword === true) {
        setRequiresPasswordAfterVerification(true);
        setVerificationEmail(emailToUse);
        toast.info('Please enter your password to complete login.');
      } else {
        toast.error(data.error || 'Invalid verification code');
        setVerificationCode(['', '', '', '', '', '']);
        if (document.getElementById('verification-input-0')) {
          document.getElementById('verification-input-0').focus();
        }
      }
    }
  } catch (error) {
    toast.error('Network error. Please try again.');
    console.error('❌ Verification error:', error);
  } finally {
    setVerificationLoading(false);
  }
};

  // Resend verification code
  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    setResendLoading(true);

    try {
      const deviceFingerprint = DeviceFingerprint.generate();
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: verificationEmail,
          action: 'resend',
          clientDeviceHash: deviceFingerprint.hash,
          clientDeviceToken: localStorage.getItem('device_token')
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('New verification code sent! Check your email.');
        setCountdown(60);
        setVerificationCode(['', '', '', '', '', '']);
        if (document.getElementById('verification-input-0')) {
          document.getElementById('verification-input-0').focus();
        }
      } else {
        toast.error(data.error || 'Failed to resend code');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  // Handle main login form submission
const handleSubmit = async (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  console.log('🚀 Login form submitted');
  console.log('📧 Email:', formData.email);
  
  if (!isForgotMode) {
    if (!agreedToTerms) {
      toast.error("Verification Required: Please accept the Terms of Access before proceeding.");
      return;
    }

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }
  } else {
    if (!formData.email) {
      toast.error("Please enter your email address");
      return;
    }
    
    const loadingToast = toast.loading("Sending recovery instructions...");
    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success("Recovery email sent! Check your inbox.");
      setIsForgotMode(false);
    }, 2000);
    return;
  }

  setIsLoading(true);
  
  const loadingToast = toast.loading('Authenticating...');

  try {
    // FIRST: Check if device verification is required
    const localStorageCheck = LocalStorageManager.checkVerificationRequirement(true); // Force full check on login
    const deviceFingerprint = DeviceFingerprint.generate();
    
    console.log('📊 Device verification check result:', {
      requiresVerification: localStorageCheck.requiresVerification,
      reason: localStorageCheck.reason,
      loginCount: localStorageCheck.loginCount,
      hasDeviceToken: !!localStorageCheck.deviceToken
    });
    
    // SCENARIO 1: Device is trusted - attempt direct login
    if (!localStorageCheck.requiresVerification && localStorageCheck.deviceToken) {
      console.log('✅ Device is trusted - attempting direct login');
      
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          clientDeviceToken: localStorageCheck.deviceToken,
          clientLoginCount: localStorageCheck.loginCount || 0,
          clientDeviceHash: deviceFingerprint.hash,
          action: 'login',
          skipDeviceCheck: true // Tell backend device is already verified
        }),
      });

      const data = await response.json();
      
      console.log('📩 Direct login response:', {
        success: data.success,
        hasToken: !!data.token,
        deviceTrusted: data.deviceTrusted
      });

      toast.dismiss(loadingToast);

      if (response.ok && data.success) {
        // Direct login successful - increment login count
        const newLoginCount = LocalStorageManager.incrementLoginCount();
        
        if (data.token) {
          LocalStorageManager.storeAuthData(data.token, data.user);
        }
        
        // Update device token if new one provided
        if (data.deviceToken) {
          LocalStorageManager.storeDeviceData(data.deviceToken, deviceFingerprint.hash, newLoginCount);
        }
        
        toast.success(`Welcome back, ${data.user?.name || 'Admin'}! 🎉`);
        
        console.log('✅ Direct login successful. Login count:', newLoginCount);

        setTimeout(() => {
          router.push('/MainDashboard');
        }, 1500);
        
        return; // Stop here - login successful
      } else {
        // Direct login failed - fall back to normal flow
        console.log('⚠️ Direct login failed, falling back to normal flow');
        toast.dismiss(loadingToast);
      }
    }
    
    // SCENARIO 2: Device verification IS required OR direct login failed
    console.log('🔐 Device verification required, reason:', localStorageCheck.reason);
    
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        clientDeviceToken: localStorageCheck.deviceToken,
        clientLoginCount: localStorageCheck.loginCount || 0,
        clientDeviceHash: deviceFingerprint.hash,
        action: 'login'
      }),
    });

    const data = await response.json();
    
    console.log('📩 Login response:', {
      success: data.success,
      requiresVerification: data.requiresVerification,
      reason: data.reason,
      shouldResetAfterVerification: data.shouldResetAfterVerification
    });

    toast.dismiss(loadingToast);



    if (response.ok && data.requiresVerification === true) {
      console.log('🔐 Verification required, reason:', data.reason);
      
      setVerificationReason(data.reason || 'security_check');
      setVerificationEmail(data.email || formData.email);
      setShowVerificationModal(true);
      setCountdown(60);
     
      // Check if verification will reset counts
      const resetHint = data.shouldResetAfterVerification 
        ? "After verification, your device login counts will be reset to give you 15 fresh logins."
        : "";
      
      if (data.shouldResetAfterVerification) {
        toast.info(`Device verification required. ${resetHint}`);
      } else {
        toast.info('Device verification required. Check your email.');
      }
      
      // Clear the verification reason
      setRequiresPasswordAfterVerification(false);
      setPasswordAfterVerification('');
      
    } else if (data.success) {
      // Login successful without verification (new device or other scenario)
      console.log('✅ Login successful - No OTP needed');
      
      if (data.token) {
        LocalStorageManager.storeAuthData(data.token, data.user);
      }

      if (data.deviceToken) {
        LocalStorageManager.storeDeviceData(data.deviceToken, deviceFingerprint.hash, data.loginCount || 1);
      }

      toast.success(`Welcome back, ${data.user.name || 'Admin'}! 🎉`);

      setTimeout(() => {
        router.push('/MainDashboard');
      }, 1500);
      
    } else {
      // Login failed - password was wrong
      console.log('❌ Login failed:', data.error);
      toast.error(data.error || 'Login failed. Please try again.');
    }
    
  } catch (error) {
    toast.dismiss(loadingToast);
    toast.error('Network error. Please check your connection.');
    console.error('❌ Login error:', error);
  } finally {
    setIsLoading(false);
  }
};

  // Close verification modal
  const closeVerificationModal = () => {
    setShowVerificationModal(false);
    setVerificationCode(['', '', '', '', '', '']);
    setVerificationLoading(false);
    setRequiresPasswordAfterVerification(false);
    setPasswordAfterVerification('');
  };

  // Handle password submit after verification
// Handle password submit after verification
const handlePasswordAfterVerification = async () => {
  if (!passwordAfterVerification) {
    toast.error('Please enter your password');
    return;
  }
  
  setVerificationLoading(true);
  
  try {
    const deviceFingerprint = DeviceFingerprint.generate();
    const localStorageCheck = LocalStorageManager.checkVerificationRequirement();
    
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: verificationEmail,
        password: passwordAfterVerification,
        verificationCode: verificationCode.join(''),
        action: 'verify_password',
        clientDeviceToken: localStorageCheck.deviceToken,
        clientLoginCount: localStorageCheck.loginCount,
        clientDeviceHash: deviceFingerprint.hash
      }),
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      // Check if counts were reset
      if (data.countsWereReset) {
        console.log('🔄 Backend reset device counts. New count:', data.loginCount);
        
        // Clear old device data to start fresh
        LocalStorageManager.clearLoginData();
        
        // Store fresh device data with reset count (should be 1)
        if (data.deviceToken) {
          LocalStorageManager.storeDeviceData(
            data.deviceToken, 
            deviceFingerprint.hash, 
            data.loginCount || 1
          );
        }
        
        toast.success('Login successful! Device verification counts have been reset.');
      } else {
        // Regular login without reset
        if (data.deviceToken) {
          LocalStorageManager.storeDeviceData(data.deviceToken, deviceFingerprint.hash, data.loginCount || 1);
        }
        
        toast.success('Login successful!');
      }
      
      // Store auth token
      if (data.token) {
        LocalStorageManager.storeAuthData(data.token, data.user);
      }
      
      // Clear all verification states
      setShowVerificationModal(false);
      setVerificationCode(['', '', '', '', '', '']);
      setVerificationEmail('');
      setPasswordAfterVerification('');
      setRequiresPasswordAfterVerification(false);
      
      // Show special message if counts were reset
      if (data.countsWereReset) {
        toast.info('Device verification counts have been reset. You now have 15 fresh logins available.');
      }
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/MainDashboard');
      }, 1000);
    } else {
      toast.error(data.error || 'Invalid credentials');
      setPasswordAfterVerification('');
    }
  } catch (error) {
    toast.error('Network error. Please try again.');
    console.error('❌ Password verification error:', error);
  } finally {
    setVerificationLoading(false);
  }
};


  // Security features and system metrics
  const securityFeatures = [
    { icon: <Shield className="w-4 h-4" />, label: "Secure Student Data", color: "emerald" },
    { icon: <Cpu className="w-4 h-4" />, label: "Automated Fee Tracking", color: "blue" },
    { icon: <Database className="w-4 h-4" />, label: "Daily Cloud Backups", color: "purple" },
    { icon: <Network className="w-4 h-4" />, label: "Portal Access Control", color: "orange" },
  ];

  const systemMetrics = [
    { label: "Manage Students", value: "400+", icon: <Users className="w-4 h-4" /> },
    { label: "School Status", value: "Online", icon: <Server className="w-4 h-4" /> },
    { label: "Manage Events", value: "12", icon: <Shield className="w-4 h-4" /> },
  ];

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      <Toaster
        position={isMobile ? "top-center" : "top-right"}
        expand={false}
        richColors
        closeButton
      />

      {/* Password Reset Modal (no changes) */}
      {showPasswordResetModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-[9999]">
          {/* ... modal content ... */}
        </div>
      )}

      {/* Verification Modal (no changes) */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-start sm:items-center justify-center p-2 sm:p-4 z-[9999] animate-fade-in overflow-y-auto">
            {/* ... modal content ... */}
        </div>
      )}

      {/* NEW LOGIN PAGE LAYOUT */}
      <main className="min-h-screen bg-slate-100 font-sans flex items-center justify-center">
        <div className="w-full h-screen grid md:grid-cols-2">
          
<div className="relative hidden md:flex flex-col justify-between bg-slate-950 text-white px-16 py-20 lg:px-24 overflow-hidden border-r border-white/5">
  {/* Background Layers */}
  <div 
    className="absolute inset-0 bg-cover bg-center opacity-25 transition-transform duration-100"
    style={{ backgroundImage: "url('/hero/kbss.png')" }}
  ></div>
  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-950 to-black"></div>
  
  <div className="relative z-10 flex flex-col h-full w-full">
    <div className="mb-auto">
      <Link href="/" className="flex items-center gap-5 group transition-transform hover:translate-x-1">
        <div className="relative p-1 bg-white/10 rounded-full backdrop-blur-xl border border-white/20 shadow-2xl">
          <Image
            src="/kinyui.png"
            alt="Kinyui Logo"
            width={64}
            height={64}
            className="rounded-full"
          />
          <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-pulse"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-black tracking-tighter leading-none uppercase">
            Kinyui <span className="text-blue-400">Boys'</span>
          </span>
          <span className="text-[10px] font-bold tracking-[0.4em] text-blue-300/60 uppercase mt-1">
            Senior School
          </span>
        </div>
      </Link>
    </div>
{/* Center Section: Main Message (Responsive Improved) */}
<div className="my-auto py-10 sm:py-12 px-4 max-w-md mx-auto text-center">
  
  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-5 sm:mb-6">
    <ShieldCheck size={14} />
    Authorized Personnel Only
  </div>
<h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-5 sm:mb-6">
  Secure{" "}
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
    Admin
  </span>{" "}
  Portal
</h1>
  
  <p className="text-sm sm:text-md text-slate-50 font-medium leading-relaxed max-w-xs sm:max-w-sm mx-auto">
    Enter your credentials to securely access the school's administrative system, manage operations, and oversee essential academic and institutional activities.
  </p>

</div>

    {/* Bottom Section: Footer Info */}
    <div className="mt-auto pt-8 mb-[5%] border-t border-white/5">
      <div className="flex flex-col gap-6">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">School Motto</p>
          <p className="text-2xl font-black italic tracking-tight text-white drop-shadow-md">
            "Soaring To Excellence"
          </p>
        </div>
        
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 tracking-widest uppercase mt-4">
          <span>&copy; {new Date().getFullYear()} KBSS</span>
          <span className="flex items-center gap-2">
            <Server size={10} />
            Secure Node: 041
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
        {/* Right Panel - Form */}
<div className="min-h-screen bg-white p-6 sm:p-12 flex flex-col justify-start">
  
  <div className="w-full max-w-md ml-0 md:ml-[15%]">
    {/* Mobile Logo */}
    <div className="md:hidden text-center mb-8">
      <Image
        src="/kinyui.png"
        alt="Kinyui Logo"
        width={60}
        height={60}
        className="rounded-full mx-auto mb-4 shadow-sm"
      />
    </div>

    {/* Header Section */}
    <div className="mb-8 sm:mb-10 text-left">
      <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
        {isForgotMode ? "Recover Access" : "Welcome Back"}
      </h2>
      <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed">
        {isForgotMode 
          ? "Enter your email address below and we'll send you a secure recovery link." 
          : "Please enter your official credentials to access your dashboard."}
      </p>
    </div>

    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      {/* Email Field */}
      <div>
        <label className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-slate-700 mb-2 block">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="admin@kinyui.ac.ke"
            className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-slate-50 border text-slate-900 font-semibold border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-sm text-sm sm:text-base"
          />
        </div>
      </div>

      {!isForgotMode && (
        <>
          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <button 
                type="button"
                onClick={() => (router.push("/pages/forgotpassword"))}
                className="text-[10px] sm:text-xs md:text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3.5 sm:py-4 text-slate-900 font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-sm text-sm sm:text-base"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4 pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 h-5 w-5 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition"
              />
              <span className="text-xs sm:text-sm text-slate-600 group-hover:text-slate-900 transition-colors leading-tight">
                I agree to the <Link href="/pages/OurSchoolPolicies" className="font-bold text-blue-600 hover:underline">Terms & Conditions</Link>
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="mt-0.5 h-5 w-5 cursor-pointer rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition"
              />
              <span className="text-xs sm:text-sm text-slate-600 group-hover:text-slate-900 transition-colors leading-tight">
                Keep me logged in on this device
              </span>
            </label>
          </div>
        </>
      )}

      {/* Submit Button */}
      <button 
        type="submit"
        disabled={isLoading || (!isForgotMode && !agreedToTerms)}
        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-blue-700 active:scale-[0.98] transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed shadow-lg shadow-blue-100 flex items-center justify-center gap-3 mt-4"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Verifying...</span>
          </>
        ) : (
          <>
            <span>{isForgotMode ? "Send Reset Link" : "Sign In to Portal"}</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      {isForgotMode && (
        <button 
          type="button"
          onClick={() => setIsForgotMode(false)}
          className="w-full text-center text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors pt-4"
        >
          &larr; Return to login
        </button>
      )}
    </form>
  </div>
</div>      </div>
      </main>
    </>
  );
}