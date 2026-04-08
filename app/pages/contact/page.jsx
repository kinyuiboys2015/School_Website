'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Users, 
  BookOpen, 
  Target, 
  Globe, 
  ShieldCheck, 
  Send, 
  CheckCircle,
  ChevronRight, 
  ArrowRight,
  Sparkles,
  MessageSquare,
  Navigation,
  Calendar,
  Video,
  User,
  Book,
  Award,
  Star,
  ExternalLink,
  Zap,
  Heart,
  TrendingUp,
  Home,
  X,
  Loader2
} from 'lucide-react';
import CircularProgress from '@mui/material/CircularProgress';
import Image from "next/image";


export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    studentGrade: '',
    inquiryType: 'general',
    contactMethod: 'email'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isMapZoomed, setIsMapZoomed] = useState(false);

  const [rows, setRows] = useState(10);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) {
        setRows(5);
      }
    }
  }, []);



  const departments = [
    {
      id: 'admissions',
      name: 'Admissions Office',
      email: 'kinyuiboys2015@gmail.com',
      phone: '+254 720 123 456',
      description: 'For enrollment, applications, and admission inquiries. We guide students through the admission process.',
      icon: <User className="w-4 h-4" />,
      head: 'Mrs ',
      hours: 'Mon-Fri: 8:00 AM - 4:00 PM',
      color: 'orange'
    },
    {
      id: 'academics',
      name: 'Academic Office',
      email: 'kinyuiboys2015@gmail.com',
      phone: '+254 720 123 457',
      description: 'Curriculum, academic programs, examinations, and teacher coordination. Ensuring academic excellence.',
      icon: <Book className="w-4 h-4" />,
      head: 'Mr Kanzi',
      hours: 'Mon-Fri: 7:30 AM - 3:30 PM',
      color: 'amber'
    },
    {
      id: 'student-affairs',
      name: 'Student Affairs',
      email: 'kinyuiboys2015@gmail.com',
      phone: '+254 720 123 458',
      description: 'Student welfare, discipline, counseling, and extracurricular activities. Building holistic students.',
      icon: <Users className="w-4 h-4" />,
      head: 'Madam Eunice',
      hours: 'Mon-Fri: 8:00 AM - 4:30 PM',
      color: 'red'
    },
    {
      id: 'sports',
      name: 'Sports Department',
      email: 'kinyuiboys2015@gmail.com',
      phone: '+254 720 123 459',
      description: 'Athletics, sports programs, competitions, and physical education. Developing champions.',
      icon: <Award className="w-4 h-4" />,
      head: 'Mr Kim',
      hours: 'Mon-Sat: 6:00 AM - 6:00 PM',
      color: 'orange'
    }
  ];

  const quickActions = [
    {
      icon: <User className="w-4 h-4" />,
      title: 'Apply for Admission',
      description: 'Start your application process',
      link: '/pages/apply-for-admissions',
      color: 'orange'
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      title: 'View Events Calendar',
      description: 'See upcoming school events',
      link: '/pages/eventsandnews',
      color: 'amber'
    },
    {
      icon: <Book className="w-4 h-4" />,
      title: 'Explore Programs',
      description: 'Discover academic offerings',
      link: '/pages/admissions',
      color: 'red'
    },
    {
      icon: <Video className="w-4 h-4" />,
      title: 'Virtual Tour home page',
      description: 'Take a campus tour online',
      link: '/',
      color: 'orange'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
        throw new Error('Name, email, phone, subject, and message are required.');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please provide a valid email address.');
      }

      const phoneRegex = /^(07|01)\d{8}$/;
      const cleanedPhone = formData.phone.replace(/\s/g, '');
      if (!phoneRegex.test(cleanedPhone)) {
        throw new Error('Invalid phone format. Use 07XXXXXXXX or 01XXXXXXXX');
      }

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: cleanedPhone,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        contactMethod: formData.contactMethod,
        studentGrade: formData.studentGrade?.trim() || '',
        inquiryType: formData.inquiryType,
        submittedAt: new Date().toISOString()
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSubmitStatus('success');
      setStatusMessage(data.message || 'Message sent successfully! Check your email for confirmation.');
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        studentGrade: '',
        inquiryType: 'general',
        contactMethod: 'email'
      });

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);

    } catch (error) {
      setSubmitStatus('error');
      setStatusMessage(error.message || 'Failed to send message. Please try again.');
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMapZoom = () => {
    setIsMapZoomed(!isMapZoomed);
  };

  const closeDepartmentModal = () => {
    setSelectedDepartment(null);
  };

  const openDepartmentModal = (dept) => {
    setSelectedDepartment(dept);
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen font-sans">

      {/* --- Hero Section --- */}
      <section className="relative h-[40vh] sm:h-[50vh] md:h-[60vh] flex items-center justify-center text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero/kin.jpeg')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/50 to-transparent"></div>
        <div className="relative z-10 text-center px-4 py-6 max-w-4xl mx-auto">
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 mb-3 sm:mb-4 text-xs sm:text-xs font-bold tracking-widest text-amber-300 uppercase bg-black/20 backdrop-blur-sm rounded-full border border-amber-300/30">
            Connect With Us
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tighter mb-2 sm:mb-4">
            Kinyui Boys Senior School
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl mx-auto">
            We're here to help. Reach out with any questions or inquiries, and our team will get back to you promptly.
          </p>
        </div>
      </section>

      {/* --- Main Content --- */}
      <main className="py-8 sm:py-16 md:py-24 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-16">

          {/* --- Left Column: Contact Info & Map --- */}
          <div className="lg:col-span-1 space-y-6 sm:space-y-8 lg:space-y-12">
            <div className="p-5 sm:p-8 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200/80">
              <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                <MapPin className="text-amber-500 w-5 h-5 sm:w-6 sm:h-6" />
                Contact Information
              </h2>
              <div className="space-y-4 sm:space-y-5 text-slate-700 text-sm sm:text-sm">
                <div className="flex items-start gap-3 sm:gap-4">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 text-amber-500 shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-sm">Our Address</h3>
                    <p>Kinyui Boys Senior School, Matungulu, Machakos County, Kenya</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 text-amber-500 shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-sm">Email Us</h3>
                    <a href="mailto:kinyuiboys2015@gmail.com" className="hover:text-amber-600 transition-colors break-all">kinyuiboys2015@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-3 sm:gap-4">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 text-amber-500 shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-sm">Call Us</h3>
                    <a href="tel:+254720123456" className="hover:text-amber-600 transition-colors">+254 720 123 456</a>
                  </div>
                </div>
                 <div className="flex items-start gap-3 sm:gap-4">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 text-amber-500 shrink-0" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-sm">Office Hours</h3>
                    <p>Mon - Fri: 8:00 AM - 5:00 PM</p>
                    <p>Sat: 9:00 AM - 1:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden">
               <div className="p-5 sm:p-8">
                 <h3 className="text-base sm:text-lg md:text-xl font-extrabold mb-2 sm:mb-4">Find Us on the Map</h3>
               </div>
               <div className="h-48 sm:h-64 bg-slate-200">
                 <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.1234!2d37.2618!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTcnMzEuNiJTIDM3wrAxNSc0Mi41IkU!5e0!3m2!1sen!2ske!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Kinyui Boys Senior School Location"
                  ></iframe>
               </div>
                <div className="p-3 sm:p-4 text-center bg-slate-50">
                    <a
                      href="https://maps.app.goo.gl/q6ubZsEk5KWxzAUv9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm sm:text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors"
                    >
                      Get Directions
                      <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>
          </div>

          {/* --- Right Column: Contact Form --- */}
          <div className="lg:col-span-2 bg-white p-5 sm:p-8 md:p-12 rounded-xl sm:rounded-2xl shadow-xl border border-slate-200/80">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 mb-1 sm:mb-2">Send Us a Message</h2>
            <p className="text-slate-600 mb-4 sm:mb-6 md:mb-8 text-sm sm:text-sm">
              Have a question or need assistance? Fill out the form and our team will respond within 24 hours.
            </p>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                  <div>
                    <p className="text-green-800 font-bold text-sm">Success!</p>
                    <p className="text-green-700 text-xs sm:text-sm">{statusMessage}</p>
                  </div>
                </div>
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 sm:gap-3">
                  <X className="w-5 h-5 text-red-600 shrink-0" />
                  <div>
                    <p className="text-red-800 font-bold text-sm">Error</p>
                    <p className="text-red-700 text-xs sm:text-sm">{statusMessage}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-800 mb-1.5 sm:mb-2 block">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:bg-white focus:border-amber-400 transition text-sm font-semibold text-slate-900 placeholder:font-normal placeholder:text-slate-400" placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-800 mb-1.5 sm:mb-2 block">Email Address <span className="text-red-500">*</span></label>
                  <input type="email" name="email" required value={formData.email} onChange={handleInputChange} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:bg-white focus:border-amber-400 transition text-sm font-semibold text-slate-900 placeholder:font-normal placeholder:text-slate-400" placeholder="e.g. john.doe@example.com" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-800 mb-1.5 sm:mb-2 block">Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:bg-white focus:border-amber-400 transition text-sm font-semibold text-slate-900 placeholder:font-normal placeholder:text-slate-400" placeholder="0712 345 678" />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-800 mb-1.5 sm:mb-2 block">Student Grade</label>
                  <select name="studentGrade" value={formData.studentGrade} onChange={handleInputChange} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:bg-white focus:border-amber-400 transition appearance-none text-sm font-semibold text-slate-900">
                    <option value="">Select Grade (Optional)</option>
                    <option value="Form 1">Form 1</option>
                    <option value="Form 2">Form 2</option>
                    <option value="Form 3">Form 3</option>
                    <option value="Form 4">Form 4</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
               <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-800 mb-1.5 sm:mb-2 block">Inquiry Type <span className="text-red-500">*</span></label>
                  <select name="inquiryType" required value={formData.inquiryType} onChange={handleInputChange} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:bg-white focus:border-amber-400 transition appearance-none text-sm font-semibold text-slate-900">
                    <option value="general">General Inquiry</option>
                    <option value="admissions">Admissions</option>
                    <option value="academics">Academics</option>
                    <option value="fees">Fees & Payments</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-bold text-slate-800 mb-1.5 sm:mb-2 block">Preferred Contact Method</label>
                  <select name="contactMethod" value={formData.contactMethod} onChange={handleInputChange} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:bg-white focus:border-amber-400 transition appearance-none text-sm font-semibold text-slate-900">
                    <option value="email">Email</option>
                    <option value="phone">Phone Call</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-800 mb-1.5 sm:mb-2 block">Subject <span className="text-red-500">*</span></label>
                <input type="text" name="subject" required value={formData.subject} onChange={handleInputChange} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:bg-white focus:border-amber-400 transition text-sm font-semibold text-slate-900 placeholder:font-normal placeholder:text-slate-400" placeholder="What is your message about?" />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-bold text-slate-800 mb-1.5 sm:mb-2 block">Your Message <span className="text-red-500">*</span></label>
                <textarea name="message" required rows={rows} value={formData.message} onChange={handleInputChange} className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-100 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:bg-white focus:border-amber-400 transition resize-none text-sm font-semibold text-slate-900 placeholder:font-normal placeholder:text-slate-400" placeholder="Please describe your inquiry in detail..."></textarea>
              </div>
              <div>
                <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 md:py-4 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* --- Department Modal --- */}
      {selectedDepartment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeDepartmentModal}></div>
          <div className="relative bg-white rounded-xl sm:rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className={`p-4 sm:p-6 bg-${selectedDepartment.color}-500 text-white rounded-t-xl sm:rounded-t-2xl`}>
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-extrabold flex items-center gap-2 sm:gap-3">
                  {React.cloneElement(selectedDepartment.icon, { className: "w-5 h-5 sm:w-6 sm:h-6" })}
                  {selectedDepartment.name}
                </h3>
                <button onClick={closeDepartmentModal} className="p-1.5 sm:p-2 rounded-full hover:bg-white/20 transition-colors">
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <p className="text-slate-700 text-sm">{selectedDepartment.description}</p>
              <div className="p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-sm">
                <p><span className="font-bold">Head:</span> {selectedDepartment.head}</p>
                <p><span className="font-bold">Hours:</span> {selectedDepartment.hours}</p>
                <p><span className="font-bold">Email:</span> <a href={`mailto:${selectedDepartment.email}`} className="text-amber-600 hover:underline break-all">{selectedDepartment.email}</a></p>
                <p><span className="font-bold">Phone:</span> <a href={`tel:${selectedDepartment.phone}`} className="text-amber-600 hover:underline">{selectedDepartment.phone}</a></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}