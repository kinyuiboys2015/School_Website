'use client';

import { useState, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { 
  FiDownload,
  FiFileText,
  FiCalendar,
  FiClock,
  FiUser,
  FiArrowRight,
  FiShare2,
  FiSearch,
  FiX,
  FiFilter,
  FiRotateCw,
  FiBookmark,
  FiChevronRight,
  FiChevronLeft,
  FiGrid,
  FiList,
  FiExternalLink,
  FiInfo,
  FiDollarSign,
  FiCreditCard,
  FiHome,
  FiBookOpen,
  FiTruck,
  FiHeart,
  FiCheckCircle,
  FiShield,
  FiWifi,
  FiCoffee,
  FiAward,
  FiAlertTriangle
} from 'react-icons/fi';
import { 
  IoNewspaperOutline,
  IoCalendarClearOutline,
  IoSparkles,
  IoRibbonOutline,
  IoPeopleCircle,
  IoStatsChart,
  IoShareSocialOutline,
  IoClose,
  IoLocationOutline,
  IoTimeOutline,
  IoPersonOutline,
  IoShareOutline,
  IoDocumentTextOutline,
  IoDownloadOutline,
  IoEyeOutline,
  IoPrintOutline,
  IoCopyOutline,
  IoCheckmarkCircleOutline,
  IoWalletOutline,
  IoCardOutline,
  IoCashOutline,
  IoReceiptOutline,
  IoPricetagOutline,
  IoSchoolOutline,
  IoBusinessOutline,
  IoRestaurantOutline,
  IoBedOutline,
  IoMedkitOutline,
  IoLibraryOutline
} from 'react-icons/io5';
import { MdOutlineSchool, MdOutlineBoardingSchool, MdOutlineAdUnits } from 'react-icons/md';
import { FaWhatsapp, FaTelegram, FaEnvelope, FaRegCopy } from 'react-icons/fa';
import { CircularProgress, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';

// Modern Modal Component
const ModernModal = ({ children, open, onClose, maxWidth = '800px' }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
      <div 
        className="relative bg-white/95 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden border border-white/40"
        style={{ 
          width: '90%',
          maxWidth: maxWidth,
          maxHeight: '90vh'
        }}
      >
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={onClose}
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white cursor-pointer border border-gray-200 shadow-sm"
          >
            <FiX className="text-gray-600 w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Fee Breakdown Card Component
const FeeBreakdownCard = ({ item, onInfo }) => {
  const getCategoryIcon = (name) => {
    const icons = {
      'Tuition': <FiBookOpen className="text-blue-600" />,
      'Boarding': <IoBedOutline className="text-purple-600" />,
      'Uniform': <FiTruck className="text-emerald-600" />,
      'Books': <FiFileText className="text-amber-600" />,
      'Medical': <IoMedkitOutline className="text-rose-600" />,
      'Activity': <FiHeart className="text-pink-600" />,
      'Application': <FiCreditCard className="text-indigo-600" />,
      'Registration': <FiUser className="text-cyan-600" />,
      'Acceptance': <FiCheckCircle className="text-green-600" />,
      'Development': <FiHome className="text-orange-600" />,
      'Deposit': <FiDollarSign className="text-teal-600" />
    };
    return icons[name] || <FiDollarSign className="text-slate-600" />;
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 p-3 sm:p-4 md:p-5 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-start gap-2 sm:gap-3 min-w-0">
          <div className="p-1.5 sm:p-2 md:p-2.5 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-100 flex-shrink-0 mt-0.5">
            <div className="text-sm sm:text-base md:text-lg">
              {getCategoryIcon(item.name)}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm md:text-base leading-tight">
              {item.name}
            </h4>
            <p className="text-[10px] sm:text-xs md:text-xs text-slate-500 mt-0.5 line-clamp-2">
              {item.description || 'Standard fee'}
            </p>
          </div>
        </div>
        <button
          onClick={() => onInfo(item)}
          className="opacity-0 group-hover:opacity-100 p-1 sm:p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex-shrink-0"
        >
          <FiInfo size={12} className="sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
        </button>
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 gap-2">
        <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
          <span className="text-[8px] sm:text-[9px] md:text-xs font-bold text-slate-400 uppercase whitespace-nowrap">Amount</span>
          <span className="text-base sm:text-lg md:text-xl font-black text-slate-900 truncate">
            KSh {item.amount?.toLocaleString()}
          </span>
        </div>
        {item.optional && (
          <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-amber-50 text-amber-700 rounded-full text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-wider border border-amber-200 flex-shrink-0 whitespace-nowrap">
            Optional
          </span>
        )}
      </div>
    </div>
  );
};

// PDF Card Component
const PDFCard = ({ title, pdfUrl, fileName, fileSize, uploadDate, description, onDownload, onView }) => {
  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg transition-all">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <IoDocumentTextOutline className="text-blue-600 text-2xl" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 text-lg mb-1 line-clamp-1">{title}</h4>
          {description && (
            <p className="text-sm text-slate-500 mb-3 line-clamp-2">{description}</p>
          )}
          
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4">
            <span className="flex items-center gap-1">
              <FiFileText className="text-blue-400" size={12} />
              {fileName || 'Document'}
            </span>
            <span className="flex items-center gap-1">
              <FiClock className="text-emerald-400" size={12} />
              {formatFileSize(fileSize)}
            </span>
            <span className="flex items-center gap-1">
              <FiCalendar className="text-purple-400" size={12} />
              {formatDate(uploadDate)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onView(pdfUrl)}
              className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-800 active:scale-95 transition-all"
            >
              <IoEyeOutline size={14} />
              View PDF
            </button>
            <button
              onClick={() => onDownload(pdfUrl, fileName)}
              className="p-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 active:scale-95 transition-all"
            >
              <FiDownload size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Table Distribution Component - Similar to School Policies page
const TableDistribution = ({ title, data, totalAmount, year, onDownload }) => {
  const [expanded, setExpanded] = useState(true);

  if (!data || data.length === 0) return null;

  return (
    <div className="mb-8 sm:mb-12">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 shadow-xl hover:shadow-2xl transition-shadow">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 sm:p-6 md:p-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <FiDollarSign className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">{title} {year}</h2>
                <p className="text-blue-200/80 text-xs sm:text-sm mt-0.5">Tap to {expanded ? "collapse" : "view"} the full breakdown</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {onDownload && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDownload(); }}
                  className="px-3 py-1.5 bg-white/20 rounded-lg text-white text-xs font-bold flex items-center gap-1 hover:bg-white/30 transition-colors"
                >
                  <FiDownload size={12} />
                  Export
                </button>
              )}
              <div className={`w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center transition-transform ${expanded ? "rotate-180" : ""}`}>
                <FiChevronRight className="text-white" size={20} style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }} />
              </div>
            </div>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="bg-white rounded-b-2xl border border-t-0 border-slate-200 shadow-lg overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {data.map((item, idx) => (
                <div key={idx} className="relative rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 p-4 sm:p-5 text-white overflow-hidden">
                  <div className="absolute top-1 right-1 text-3xl opacity-20">
                    {idx === 0 ? '📚' : idx === 1 ? '✏️' : idx === 2 ? '🎓' : '💰'}
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/70">{item.term}</span>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-[10px] sm:text-xs font-semibold opacity-80">KES</span>
                    <span className="text-lg sm:text-2xl md:text-3xl font-black">{item.amount.toLocaleString()}</span>
                  </div>
                  <span className="inline-block mt-2 text-[10px] px-2 py-0.5 bg-white/20 rounded-full font-medium">{item.tag}</span>
                </div>
              ))}
            </div>

            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mb-3">Detailed Breakdown</h3>
            <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-xl border border-slate-200">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs sm:text-sm">
                    <th className="px-3 sm:px-4 py-3 font-bold">Vote Head</th>
                    {data.map((term, idx) => (
                      <th key={idx} className="px-3 sm:px-4 py-3 text-right font-bold">{term.term}</th>
                    ))}
                    <th className="px-3 sm:px-4 py-3 text-right font-bold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data[0]?.breakdown?.map((row, i) => (
                    <tr key={i} className="hover:bg-blue-50/40 transition-colors text-xs sm:text-sm">
                      <td className="px-3 sm:px-4 py-2.5 font-semibold text-slate-800">{row.voteHead}</td>
                      {data.map((term, idx) => (
                        <td key={idx} className="px-3 sm:px-4 py-2.5 text-right text-slate-600">
                          {term.breakdown?.[i]?.amount?.toLocaleString() || '-'}
                        </td>
                      ))}
                      <td className="px-3 sm:px-4 py-2.5 text-right font-bold text-slate-900">
                        {row.total?.toLocaleString() || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-blue-600 text-white font-black text-xs sm:text-sm">
                    <td className="px-3 sm:px-4 py-3">TOTAL</td>
                    {data.map((term, idx) => (
                      <td key={idx} className="px-3 sm:px-4 py-3 text-right">{term.amount.toLocaleString()}</td>
                    ))}
                    <td className="px-3 sm:px-4 py-3 text-right">{totalAmount?.toLocaleString() || data.reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-amber-800 text-xs sm:text-sm flex items-start gap-2">
                <FiAlertTriangle className="flex-shrink-0 mt-0.5" size={14} />
                <span><strong>Late payment penalty:</strong> KES 500 per week. Students with fee balances will not receive end-term reports or sit for exams.</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Component
export default function ModernFeesPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [documentData, setDocumentData] = useState(null);
  const [selectedFeeItem, setSelectedFeeItem] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [activeTab, setActiveTab] = useState('day');
  const [searchTerm, setSearchTerm] = useState('');
  const [showTableView, setShowTableView] = useState(true);

  // Tabs configuration
  const tabs = [
    { id: 'day', name: 'Day Fees', icon: IoBusinessOutline, color: 'blue' },
    { id: 'boarding', name: 'Boarding Fees', icon: IoBedOutline, color: 'purple' },
    { id: 'admission', name: 'Admission Fees', icon: MdOutlineAdUnits, color: 'amber' }
  ];

  const router = useRouter();
  const year = new Date().getFullYear();

  // Table data for fee distribution (like school policies page)
  const getTableDataForTab = () => {
    const items = getCurrentFeeItems();
    if (!items.length) return null;

    // Transform fee items into table format
    const terms = [
      { term: "Term 1", tag: "Opening", amount: 0, breakdown: [] },
      { term: "Term 2", tag: "Mid Year", amount: 0, breakdown: [] },
      { term: "Term 3", tag: "Final", amount: 0, breakdown: [] }
    ];

    // Distribute amounts across terms (example distribution logic)
    items.forEach(item => {
      const perTermAmount = Math.round(item.amount / 3);
      terms.forEach((term, idx) => {
        term.amount += perTermAmount;
        term.breakdown.push({
          voteHead: item.name,
          amount: perTermAmount
        });
      });
    });

    // Add total for each breakdown item
    terms.forEach(term => {
      term.breakdown = term.breakdown.map((item, idx) => ({
        ...item,
        total: item.amount * 3
      }));
    });

    return {
      terms,
      total: terms.reduce((sum, t) => sum + t.amount, 0),
      items: items.map(item => ({
        voteHead: item.name,
        total: item.amount,
        ...terms.reduce((acc, term, idx) => ({ ...acc, [`term${idx + 1}`]: Math.round(item.amount / 3) }), {})
      }))
    };
  };

  // Fetch document data
  const fetchDocuments = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    
    try {
      const response = await fetch('/api/schooldocuments');
      const data = await response.json();
      
      if (data.success) {
        setDocumentData(data.document);
        if (showRefresh) toast.success('Fees data refreshed!');
      } else {
        throw new Error(data.error || 'Failed to load fees data');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load fees information');
    } finally {
      if (showRefresh) setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Get current fee items based on active tab
  const getCurrentFeeItems = () => {
    if (!documentData) return [];
    
    switch(activeTab) {
      case 'day':
        return documentData.feesDayDistributionJson || [];
      case 'boarding':
        return documentData.feesBoardingDistributionJson || [];
      case 'admission':
        return documentData.admissionFeeDistribution || [];
      default:
        return [];
    }
  };

  // Get total amount for current tab
  const getCurrentTotal = () => {
    const items = getCurrentFeeItems();
    return items.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  // Get PDF info for current tab
  const getCurrentPDFInfo = () => {
    if (!documentData) return null;
    
    switch(activeTab) {
      case 'day':
        return {
          url: documentData.feesDayDistributionPdf,
          name: documentData.feesDayPdfName,
          size: documentData.feesDayPdfSize,
          date: documentData.feesDayPdfUploadDate,
          description: documentData.feesDayDescription
        };
      case 'boarding':
        return {
          url: documentData.feesBoardingDistributionPdf,
          name: documentData.feesBoardingPdfName,
          size: documentData.feesBoardingPdfSize,
          date: documentData.feesBoardingPdfUploadDate,
          description: documentData.feesBoardingDescription
        };
      case 'admission':
        return {
          url: documentData.admissionFeePdf,
          name: documentData.admissionFeePdfName,
          size: documentData.admissionFeePdfSize,
          date: documentData.admissionFeePdfUploadDate,
          description: documentData.admissionFeeDescription
        };
      default:
        return null;
    }
  };

  // Filter fee items based on search
  const filteredItems = getCurrentFeeItems().filter(item => {
    return searchTerm === '' || 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Handle PDF download
  const handleDownloadPDF = (url, fileName) => {
    if (!url) {
      toast.error('PDF not available');
      return;
    }
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'fee-structure.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Download started');
  };

  // Handle PDF view
  const handleViewPDF = (url) => {
    if (!url) {
      toast.error('PDF not available');
      return;
    }
    window.open(url, '_blank');
  };

  // Handle refresh
  const refreshData = () => {
    fetchDocuments(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-4">
        <div className="max-w-7xl mx-auto">
          <div className="min-h-[70vh] flex items-center justify-center">
            <Stack spacing={2} alignItems="center">
              <div className="relative flex items-center justify-center scale-90 sm:scale-110">
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={48}
                  thickness={4.5}
                  sx={{ color: '#f1f5f9' }}
                />
                <CircularProgress
                  variant="indeterminate"
                  disableShrink
                  size={48}
                  thickness={4.5}
                  sx={{
                    color: '#0f172a',
                    animationDuration: '1000ms',
                    position: 'absolute',
                  }}
                />
                <div className="absolute">
                  <IoSparkles className="text-blue-600 text-sm animate-pulse" />
                </div>
              </div>
              <div className="text-center px-4">
                <p className="text-slate-900 font-medium text-sm sm:text-base tracking-tight">
                  Loading fee structure...
                </p>
                <p className="text-slate-700 text-[10px] sm:text-xs uppercase tracking-widest mt-1 font-bold">
                  S.A kinyui boys Senior School
                </p>
              </div>
            </Stack>
          </div>
        </div>
      </div>
    );
  }

  const pdfInfo = getCurrentPDFInfo();
  const currentItems = getCurrentFeeItems();
  const totalAmount = getCurrentTotal();
  const tableData = getTableDataForTab();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <Toaster position="top-right" richColors />

{/* Hero Section */}
<div className="relative bg-slate-950 p-6 sm:p-10 overflow-hidden">
  {/* Glow Effects */}
  <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-[120px]" />
  <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-[120px]" />

  <div className="max-w-7xl mx-auto relative z-10">
    <div className="space-y-6">

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 
                      bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
        <IoWalletOutline className="text-blue-400 text-xs sm:text-sm animate-pulse" />
        <span className="text-blue-100 font-black text-[10px] sm:text-xs uppercase tracking-[0.2em]">
          Fee Structure {year}
        </span>
      </div>

      {/* Top Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

        {/* LEFT */}
        <div className="max-w-2xl">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[1.1]">
            School{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-purple-400">
              Fees
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-lg mt-3 font-medium">
            Transparent fee structure for all boarders at 
            <span className="text-white font-semibold"> Kinyui Boys Senior School</span>.
          </p>

          {/* Mini Highlights */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs sm:text-sm text-slate-300">
            <span className="flex items-center gap-1">
              <FiCheckCircle className="text-blue-400" /> Updated {year}
            </span>
            <span className="flex items-center gap-1">
              <FiShield className="text-emerald-400" /> Verified data
            </span>
            <span className="flex items-center gap-1">
              <FiDownload className="text-purple-400" /> PDF available
            </span>
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

          {/* Primary */}
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 
                       px-5 py-3 sm:px-7 sm:py-4 
                       rounded-xl sm:rounded-2xl 
                       bg-white hover:bg-blue-50 
                       text-slate-950 font-black 
                       text-xs sm:text-sm 
                       uppercase tracking-widest 
                       transition-all active:scale-95 
                       disabled:opacity-50
                       shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            {refreshing && (
              <CircularProgress size={18} thickness={5} sx={{ color: "#0f172a" }} />
            )}
            <span>
              {refreshing ? "Fetching..." : "Refresh"}
            </span>
          </button>

          {/* Secondary */}
          {pdfInfo?.url && (
            <button
              onClick={() => handleViewPDF(pdfInfo.url)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 
                         px-5 py-3 sm:px-7 sm:py-4 
                         rounded-xl sm:rounded-2xl 
                         border border-white/20 
                         text-white font-black 
                         text-xs sm:text-sm 
                         uppercase tracking-widest 
                         hover:bg-white/10 transition-all"
            >
              <IoEyeOutline />
              Preview
            </button>
          )}
        </div>
      </div>

      {/* Bottom Stats Strip (VERY MODERN TOUCH) */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 border-t border-white/10">
        <div>
          <p className="text-lg sm:text-2xl font-black text-white">
            {getCurrentTotal().toLocaleString()}
          </p>
          <p className="text-[10px] sm:text-xs text-slate-400 uppercase">Total Fees (KSh)</p>
        </div>

        <div>
          <p className="text-lg sm:text-2xl font-black text-white">
            {getCurrentFeeItems().length}
          </p>
          <p className="text-[10px] sm:text-xs text-slate-400 uppercase">Fee Items</p>
        </div>

        <div>
          <p className="text-lg sm:text-2xl font-black text-white">
            {tabs.find(t => t.id === activeTab)?.name.split(" ")[0]}
          </p>
          <p className="text-[10px] sm:text-xs text-slate-400 uppercase">Category</p>
        </div>
      </div>

    </div>
  </div>
</div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 p-4 sm:p-5 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <IoBusinessOutline size={18} className="sm:w-6 sm:h-6 md:w-6 md:h-6" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[8px] sm:text-xs md:text-xs font-bold text-slate-400 uppercase">Day</span>
                {documentData?.feesDayDistributionPdf && (
                  <button
                    onClick={() => handleDownloadPDF(documentData.feesDayDistributionPdf, documentData.feesDayPdfName)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 text-sm font-bold transition-colors"
                    title="Download Day Fees Document"
                  >
                    <FiDownload className="w-4 h-4" />
                    <span className="text-xs sm:text-sm">Download</span>
                  </button>
                )}
              </div>
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 mb-1">Day Scholars</h3>
            <p className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mb-2 leading-tight">
              KSh {documentData?.feesDayDistributionJson?.reduce((sum, item) => sum + item.amount, 0)?.toLocaleString() || '0'}
            </p>
            <p className="text-[10px] sm:text-xs md:text-sm text-slate-500">{documentData?.feesDayDistributionJson?.length || 0} fee items</p>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 p-4 sm:p-5 md:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                <IoBedOutline size={18} className="sm:w-6 sm:h-6 md:w-6 md:h-6" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[8px] sm:text-xs md:text-xs font-bold text-slate-400 uppercase">Boarding</span>
                {documentData?.feesBoardingDistributionPdf && (
                  <button
                    onClick={() => handleDownloadPDF(documentData.feesBoardingDistributionPdf, documentData.feesBoardingPdfName)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 text-sm font-bold transition-colors"
                    title="Download Boarding Fees Document"
                  >
                    <FiDownload className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                    <span className="sm:hidden text-[10px]">PDF</span>
                  </button>
                )}
              </div>
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 mb-1">Boarders</h3>
            <p className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mb-2 leading-tight">
              KSh {documentData?.feesBoardingDistributionJson?.reduce((sum, item) => sum + item.amount, 0)?.toLocaleString() || '0'}
            </p>
            <p className="text-[10px] sm:text-xs md:text-sm text-slate-500">{documentData?.feesBoardingDistributionJson?.length || 0} fee items</p>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 p-4 sm:p-5 md:p-6 shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <MdOutlineAdUnits size={18} className="sm:w-6 sm:h-6 md:w-6 md:h-6" />
              </div>
              <span className="text-[8px] sm:text-xs md:text-xs font-bold text-slate-400 uppercase">Admission</span>
            </div>
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 mb-1">New Students</h3>
            <p className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mb-2 leading-tight">
              KSh {documentData?.admissionFeeDistribution?.reduce((sum, item) => sum + item.amount, 0)?.toLocaleString() || '0'}
            </p>
            <p className="text-[10px] sm:text-xs md:text-sm text-slate-500">{documentData?.admissionFeeDistribution?.length || 0} fee items</p>
          </div>
        </div>

        {/* Tabs - Responsive */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchTerm('');
                }}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all border ${
                  isActive
                    ? `bg-${tab.color}-600 border-${tab.color}-600 text-white shadow-md`
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                <Icon size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">{tab.name}</span>
                <span className="sm:hidden text-[10px]">{tab.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* View Toggle Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setShowTableView(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                !showTableView 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <FiGrid size={14} />
              Card View
            </button>
            <button
              onClick={() => setShowTableView(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                showTableView 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <FiList size={14} />
              Table View
            </button>
          </div>
          <p className="text-xs text-slate-400">
            {filteredItems.length} items found
          </p>
        </div>

        {/* Table Distribution View - Like School Policies Page */}
        {showTableView && tableData && (
          <TableDistribution 
            title={`${tabs.find(t => t.id === activeTab)?.name} Structure`}
            data={tableData.terms}
            totalAmount={totalAmount}
            year={year}
            onDownload={() => pdfInfo?.url && handleDownloadPDF(pdfInfo.url, pdfInfo.name)}
          />
        )}

        {/* Search Bar - Only show in Card View */}
        {!showTableView && (
          <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-lg">
            <div className="relative flex items-center">
              <div className="pl-2 sm:pl-3 md:pl-4 pr-2">
                <FiSearch className="text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <input
                type="text"
                placeholder={`Search ${activeTab} fees...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 sm:py-3 bg-transparent text-slate-900 placeholder:text-slate-400 font-medium text-xs sm:text-sm focus:outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mr-1 sm:mr-2 p-1.5 sm:p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  <FiX size={14} className="sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {/* Fee Breakdown - Left Column (only in Card View) */}
          {!showTableView && (
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
                  {tabs.find(t => t.id === activeTab)?.name} Breakdown
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 whitespace-nowrap">
                  {filteredItems.length} items
                </p>
              </div>

              {filteredItems.length === 0 ? (
                <div className="bg-slate-50 rounded-2xl sm:rounded-3xl border-2 border-dashed border-slate-200 py-8 sm:py-12 px-4 text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <FiDollarSign className="text-slate-300 text-lg sm:text-2xl" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">No fee items found</h3>
                  <p className="text-slate-500 text-xs sm:text-sm mt-1">Try adjusting your search.</p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {filteredItems.map((item, index) => (
                    <FeeBreakdownCard
                      key={item.id || index}
                      item={item}
                      onInfo={(item) => {
                        setSelectedFeeItem(item);
                        setShowInfoModal(true);
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Total Card - Responsive */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 text-white mt-3 sm:mt-4">
                <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2">
                  <div className="p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl border border-white/20 flex-shrink-0">
                    <IoWalletOutline size={20} className="sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-[8px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Total</span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-300 mb-1">Total {tabs.find(t => t.id === activeTab)?.name}</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 leading-tight">
                  KSh {totalAmount.toLocaleString()}
                </p>
                <p className="text-[8px] sm:text-xs text-slate-400">* Inclusive of all applicable fees</p>
              </div>
            </div>
          )}

          {/* PDF Documents - Right Column */}
          <div className={`${!showTableView ? 'lg:col-span-1' : 'lg:col-span-3'} space-y-3 sm:space-y-4`}>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">Documents</h2>
            
            {pdfInfo?.url ? (
              <PDFCard
                title={`${tabs.find(t => t.id === activeTab)?.name} Structure`}
                pdfUrl={pdfInfo.url}
                fileName={pdfInfo.name}
                fileSize={pdfInfo.size}
                uploadDate={pdfInfo.date}
                description={pdfInfo.description}
                onDownload={handleDownloadPDF}
                onView={handleViewPDF}
              />
            ) : (
              <div className="bg-slate-50 rounded-2xl sm:rounded-3xl border-2 border-dashed border-slate-200 p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                  <IoDocumentTextOutline className="text-slate-300 text-lg sm:text-2xl" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">No PDF Available</h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">Check back later for updates.</p>
              </div>
            )}

            {/* Quick Info Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-100 p-4 sm:p-5 md:p-6">
              <h3 className="font-bold text-slate-900 mb-3 text-sm sm:text-base md:text-lg">Payment Info</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 rounded-lg sm:rounded-xl">
                  <IoCardOutline className="text-blue-600 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                  <div className="min-w-0">
                    <p className="text-[8px] sm:text-xs font-bold text-slate-400">Bank Transfer</p>
                    <p className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-900 truncate">Account: 1234567890</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 rounded-lg sm:rounded-xl">
                  <IoCashOutline className="text-emerald-600 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                  <div className="min-w-0">
                    <p className="text-[8px] sm:text-xs font-bold text-slate-400">MPesa Paybill</p>
                    <p className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-900 truncate">Business No: 522522</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 rounded-lg sm:rounded-xl">
                  <IoReceiptOutline className="text-purple-600 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                  <div className="min-w-0">
                    <p className="text-[8px] sm:text-xs font-bold text-slate-400">Account Name</p>
                    <p className="text-[10px] sm:text-xs md:text-sm font-bold text-slate-900 truncate">kinyui boys Senior School</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Banner - Responsive */}
        <div className="relative overflow-hidden bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl mt-6 sm:mt-8">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-blue-500/5 blur-[80px] rounded-full -mr-16 sm:-mr-24 -mt-16 sm:-mt-24" />
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-purple-500/5 blur-[80px] rounded-full -ml-16 sm:-ml-24 -mb-16 sm:-mb-24" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 sm:gap-6">
            <div className="shrink-0">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-white flex items-center justify-center shadow-lg">
                <IoReceiptOutline className="text-slate-900 text-lg sm:text-2xl" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-base sm:text-lg md:text-2xl font-black text-white mb-1 sm:mb-2">
                Need Payment Assistance?
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed">
                Contact our finance office for payment plans and financial aid information.
              </p>
            </div>
            <button onClick={() => router.push("/pages/contact")} className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-slate-900 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm hover:bg-slate-100 transition-all active:scale-95 flex-shrink-0">
              Contact
            </button>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      <ModernModal open={showInfoModal} onClose={() => setShowInfoModal(false)} maxWidth="400px">
        {selectedFeeItem && (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <FiInfo className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{selectedFeeItem.name}</h3>
              <p className="text-sm text-slate-500 mt-1">Fee Item Details</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-bold text-slate-400 mb-1">Description</p>
                <p className="text-slate-900">{selectedFeeItem.description || 'No description available'}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs font-bold text-slate-400 mb-1">Amount</p>
                  <p className="text-xl font-black text-slate-900">KSh {selectedFeeItem.amount?.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs font-bold text-slate-400 mb-1">Status</p>
                  <p className="text-sm font-bold text-slate-900">
                    {selectedFeeItem.optional ? 'Optional' : 'Mandatory'}
                  </p>
                </div>
              </div>

              {selectedFeeItem.admissionOnly && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-xs font-bold text-amber-800">One-time admission fee</p>
                </div>
              )}

              {selectedFeeItem.boardingOnly && (
                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                  <p className="text-xs font-bold text-amber-800">Boarding students only</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowInfoModal(false)}
              className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
            >
              Close
            </button>
          </div>
        )}
      </ModernModal>
    </div>
  );
}