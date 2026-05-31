<?xml version="1.0" encoding="UTF-8"?>
<!--
  ============================================================================
  SITEMAP XSL STYLESHEET - Kinyui Boys Senior School
  ============================================================================
  Version: 2.0
  Created: 2026-03-17
  Last Updated: 2026-04-29
  Author: Kinyui Boys Senior School ICT Department
  ============================================================================
  Purpose: Transforms the raw sitemap.xml into a beautifully styled,
           human-readable HTML page with search functionality, filtering,
           and responsive design for all devices.
  ============================================================================
  
  ┌─────────────────────────────────────────────────────────────────────────┐
  │  FEATURES                                                               │
  │  ─────────────────────────────────────────────────────────────────────  │
  │  • Responsive design (Mobile / Tablet / Desktop)                        │
  │  • Real-time search filtering                                           │
  │  • Category-based filtering tabs                                        │
  │  • Priority-based color coding                                          │
  │  • Change frequency badges with distinct colors                         │
  │  • Clickable URLs that open in new tabs                                 │
  │  • Statistics dashboard (Total pages, categories breakdown)            │
  │  • Dark gradient header with glassmorphism effects                     │
  │  • Print-friendly styles                                                │
  │  • Accessibility-focused semantic HTML                                  │
  └─────────────────────────────────────────────────────────────────────────┘
-->
<xsl:stylesheet version="1.0" 
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>Kinyui Boys Senior School - Official Sitemap</title>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta name="description" content="Complete sitemap for Kinyui Boys Senior School - Find all pages, admissions info, fees structure, gallery, and more."/>
        <meta name="robots" content="noindex, follow"/>
        <link rel="canonical" href="https://kinyuiboyssenior.school/sitemap.xml"/>
        
        <!-- Font Awesome Icons (CDN) -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
        
        <style>
          /* ========================================================================
             GLOBAL RESET & VARIABLES
             ======================================================================== */
          :root {
            --primary: #4f46e5;
            --primary-dark: #4338ca;
            --secondary: #7c3aed;
            --accent: #06b6d4;
            --success: #10b981;
            --warning: #f59e0b;
            --danger: #ef4444;
            --info: #3b82f6;
            --purple: #8b5cf6;
            --pink: #ec4899;
            --slate-50: #f8fafc;
            --slate-100: #f1f5f9;
            --slate-200: #e2e8f0;
            --slate-300: #cbd5e1;
            --slate-400: #94a3b8;
            --slate-500: #64748b;
            --slate-600: #475569;
            --slate-700: #334155;
            --slate-800: #1e293b;
            --slate-900: #0f172a;
            --white: #ffffff;
            --radius-sm: 0.5rem;
            --radius-md: 0.75rem;
            --radius-lg: 1rem;
            --radius-xl: 1.25rem;
            --radius-2xl: 1.5rem;
            --radius-3xl: 2rem;
            --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
            --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
            --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
            --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
            --shadow-2xl: 0 25px 50px -12px rgba(0,0,0,0.25);
            --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 30%, #312e81 60%, #1e1b4b 100%);
            background-attachment: fixed;
            min-height: 100vh;
            padding: 16px;
            color: var(--slate-800);
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          /* Subtle animated background pattern */
          body::before {
            content: '';
            position: fixed;
            inset: 0;
            background: 
              radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 50%);
            pointer-events: none;
            z-index: 0;
          }
          
          /* ========================================================================
             MAIN CONTAINER
             ======================================================================== */
          .container {
            max-width: 1300px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.97);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border-radius: var(--radius-3xl);
            box-shadow: var(--shadow-2xl);
            overflow: hidden;
            position: relative;
            z-index: 1;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          /* ========================================================================
             HEADER SECTION
             ======================================================================== */
          .header {
            background: linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4f46e5 60%, #06b6d4 100%);
            color: white;
            padding: 48px 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          
          /* Header decorative elements */
          .header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -20%;
            width: 60%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
          }
          
          .header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, 
              #f59e0b 0%, #ef4444 16.66%, 
              #ec4899 33.33%, #8b5cf6 50%, 
              #3b82f6 66.66%, #06b6d4 83.33%, 
              #10b981 100%);
            opacity: 0.8;
          }
          
          .header-content {
            position: relative;
            z-index: 1;
          }
          
          .header .logo-area {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            margin-bottom: 12px;
          }
          
          .header .school-badge {
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 8px 20px;
            border-radius: 50px;
            font-size: 0.7em;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            display: inline-block;
            margin-bottom: 8px;
          }
          
          .header h1 {
            font-size: clamp(1.8rem, 4vw, 2.8rem);
            margin-bottom: 8px;
            font-weight: 900;
            letter-spacing: -0.5px;
            line-height: 1.2;
          }
          
          .header h1 .highlight {
            background: linear-gradient(90deg, #fbbf24, #f59e0b, #fbbf24);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .header p {
            font-size: 1.1em;
            opacity: 0.85;
            margin-bottom: 24px;
            font-weight: 500;
          }
          
          /* ========================================================================
             STATISTICS CARDS
             ======================================================================== */
          .stats {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
            margin-top: 8px;
          }
          
          .stat-item {
            background: rgba(255, 255, 255, 0.12);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.18);
            padding: 18px 28px;
            border-radius: var(--radius-xl);
            text-align: center;
            min-width: 120px;
            transition: var(--transition);
          }
          
          .stat-item:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          }
          
          .stat-value {
            font-size: 2.2em;
            font-weight: 900;
            line-height: 1;
            margin-bottom: 4px;
          }
          
          .stat-label {
            font-size: 0.75em;
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-weight: 600;
          }
          
          /* ========================================================================
             CONTENT AREA
             ======================================================================== */
          .content {
            padding: 32px 28px;
          }
          
          /* ========================================================================
             SEARCH BAR
             ======================================================================== */
          .search-container {
            margin-bottom: 24px;
            position: relative;
          }
          
          .search-input {
            width: 100%;
            padding: 14px 20px 14px 50px;
            border: 2px solid var(--slate-200);
            border-radius: var(--radius-2xl);
            font-size: 1em;
            font-family: inherit;
            background: var(--white);
            color: var(--slate-800);
            transition: var(--transition);
            box-shadow: var(--shadow-sm);
          }
          
          .search-input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1), var(--shadow-md);
          }
          
          .search-input::placeholder {
            color: var(--slate-400);
          }
          
          .search-icon {
            position: absolute;
            left: 18px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--slate-400);
            font-size: 1.2em;
            pointer-events: none;
          }
          
          /* ========================================================================
             FILTER TABS
             ======================================================================== */
          .filter-tabs {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            margin-bottom: 24px;
          }
          
          .filter-tab {
            padding: 10px 20px;
            border-radius: 50px;
            border: 2px solid var(--slate-200);
            background: var(--white);
            color: var(--slate-600);
            cursor: pointer;
            font-weight: 600;
            font-size: 0.85em;
            transition: var(--transition);
            white-space: nowrap;
            font-family: inherit;
          }
          
          .filter-tab:hover {
            border-color: var(--primary);
            color: var(--primary);
            background: #eef2ff;
          }
          
          .filter-tab.active {
            background: var(--primary);
            color: white;
            border-color: var(--primary);
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
          }
          
          .filter-tab .count {
            background: rgba(0,0,0,0.1);
            padding: 2px 8px;
            border-radius: 50px;
            font-size: 0.8em;
            margin-left: 6px;
          }
          
          .filter-tab.active .count {
            background: rgba(255,255,255,0.25);
          }
          
          /* ========================================================================
             RESULTS COUNT
             ======================================================================== */
          .results-info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 16px;
            font-size: 0.9em;
            color: var(--slate-500);
            font-weight: 500;
          }
          
          .results-count {
            font-weight: 700;
            color: var(--slate-700);
          }
          
          /* ========================================================================
             TABLE STYLES
             ======================================================================== */
          .table-container {
            overflow-x: auto;
            border-radius: var(--radius-xl);
            border: 1px solid var(--slate-200);
            background: var(--white);
            box-shadow: var(--shadow-sm);
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
          }
          
          thead {
            position: sticky;
            top: 0;
            z-index: 10;
          }
          
          th {
            background: var(--slate-900);
            color: white;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.75em;
            letter-spacing: 1px;
            padding: 16px 18px;
            text-align: left;
            white-space: nowrap;
          }
          
          th:first-child {
            border-radius: var(--radius-xl) 0 0 0;
          }
          
          th:last-child {
            border-radius: 0 var(--radius-xl) 0 0;
          }
          
          td {
            padding: 14px 18px;
            border-bottom: 1px solid var(--slate-100);
            font-size: 0.9em;
          }
          
          tbody tr {
            transition: var(--transition);
          }
          
          tbody tr:hover {
            background: #eef2ff;
          }
          
          tbody tr:last-child td {
            border-bottom: none;
          }
          
          tbody tr.hidden {
            display: none;
          }
          
          /* ========================================================================
             URL LINK STYLES
             ======================================================================== */
          .url {
            color: var(--primary);
            text-decoration: none;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
            word-break: break-all;
          }
          
          .url:hover {
            color: var(--secondary);
            text-decoration: underline;
          }
          
          .url-icon {
            font-size: 1.1em;
            flex-shrink: 0;
          }
          
          .url-page-name {
            font-weight: 700;
            color: var(--slate-800);
            margin-left: 4px;
          }
          
          /* ========================================================================
             BADGE STYLES (Change Frequency)
             ======================================================================== */
          .badge {
            display: inline-block;
            padding: 6px 14px;
            border-radius: 50px;
            font-size: 0.78em;
            font-weight: 700;
            text-transform: capitalize;
            letter-spacing: 0.3px;
          }
          
          .badge.always   { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
          .badge.hourly   { background: #fff7ed; color: #9a3412; border: 1px solid #fed7aa; }
          .badge.daily    { background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; }
          .badge.weekly   { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
          .badge.monthly  { background: #faf5ff; color: #6b21a8; border: 1px solid #e9d5ff; }
          .badge.quarterly { background: #fdf2f8; color: #9d174d; border: 1px solid #fbcfe8; }
          .badge.yearly   { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
          .badge.never    { background: #f8fafc; color: #64748b; border: 1px solid #cbd5e1; }
          
          /* ========================================================================
             PRIORITY STYLES
             ======================================================================== */
          .priority {
            font-weight: 700;
            font-size: 0.95em;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .priority-bar {
            width: 60px;
            height: 6px;
            background: var(--slate-200);
            border-radius: 10px;
            overflow: hidden;
          }
          
          .priority-fill {
            height: 100%;
            border-radius: 10px;
            transition: width 0.5s ease;
          }
          
          .priority-high .priority-fill { background: linear-gradient(90deg, #10b981, #34d399); }
          .priority-medium .priority-fill { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
          .priority-low .priority-fill { background: linear-gradient(90deg, #ef4444, #f87171); }
          
          .priority-text {
            font-size: 0.85em;
            color: var(--slate-500);
          }
          
          /* ========================================================================
             NO RESULTS STATE
             ======================================================================== */
          .no-results {
            text-align: center;
            padding: 40px;
            color: var(--slate-400);
          }
          
          .no-results i {
            font-size: 3em;
            margin-bottom: 16px;
            display: block;
          }
          
          .no-results p {
            font-size: 1.1em;
            font-weight: 600;
          }
          
          /* ========================================================================
             NOTES / INFO BOXES
             ======================================================================== */
          .note {
            background: #fffbeb;
            border: 1px solid #fde68a;
            border-left: 4px solid #f59e0b;
            color: #92400e;
            padding: 16px 20px;
            border-radius: var(--radius-lg);
            margin-bottom: 24px;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            font-weight: 500;
          }
          
          .note-icon {
            font-size: 1.4em;
            flex-shrink: 0;
            margin-top: 2px;
          }
          
          .note-content strong {
            display: block;
            margin-bottom: 4px;
          }
          
          .note-content small {
            opacity: 0.8;
          }
          
          /* ========================================================================
             FOOTER
             ======================================================================== */
          .footer {
            background: var(--slate-900);
            color: var(--slate-300);
            padding: 28px 32px;
            text-align: center;
            font-size: 0.85em;
            border-top: 1px solid var(--slate-800);
          }
          
          .footer a {
            color: #a5b4fc;
            text-decoration: none;
            font-weight: 600;
            transition: var(--transition);
          }
          
          .footer a:hover {
            color: #c7d2fe;
            text-decoration: underline;
          }
          
          .footer-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
            margin: 12px 0;
          }
          
          .footer-divider {
            color: var(--slate-600);
          }
          
          .footer small {
            display: block;
            margin-top: 8px;
            color: var(--slate-500);
          }
          
          /* ========================================================================
             BACK TO TOP BUTTON
             ======================================================================== */
          .back-to-top {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: var(--primary);
            color: white;
            border: none;
            cursor: pointer;
            font-size: 1.2em;
            box-shadow: var(--shadow-lg);
            transition: var(--transition);
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .back-to-top:hover {
            background: var(--primary-dark);
            transform: translateY(-3px);
            box-shadow: var(--shadow-xl);
          }
          
          /* ========================================================================
             PRINT STYLES
             ======================================================================== */
          @media print {
            body {
              background: white;
              padding: 0;
            }
            
            .container {
              box-shadow: none;
              border-radius: 0;
              border: none;
            }
            
            .header {
              background: #1e1b4b !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .back-to-top,
            .search-container,
            .filter-tabs {
              display: none !important;
            }
            
            .table-container {
              border: 1px solid #ccc;
            }
          }
          
          /* ========================================================================
             MOBILE RESPONSIVENESS
             ======================================================================== */
          @media (max-width: 768px) {
            body {
              padding: 8px;
            }
            
            .header {
              padding: 32px 20px;
            }
            
            .header h1 {
              font-size: 1.5rem;
            }
            
            .header p {
              font-size: 0.9em;
            }
            
            .stats {
              gap: 10px;
            }
            
            .stat-item {
              padding: 12px 16px;
              min-width: 90px;
            }
            
            .stat-value {
              font-size: 1.5em;
            }
            
            .stat-label {
              font-size: 0.65em;
            }
            
            .content {
              padding: 20px 14px;
            }
            
            th, td {
              padding: 10px 12px;
              font-size: 0.8em;
            }
            
            .filter-tab {
              padding: 8px 14px;
              font-size: 0.75em;
            }
            
            .url {
              font-size: 0.85em;
            }
            
            .badge {
              padding: 4px 10px;
              font-size: 0.7em;
            }
            
            .priority-bar {
              width: 40px;
            }
            
            .footer {
              padding: 20px 16px;
              font-size: 0.75em;
            }
          }
          
          @media (max-width: 480px) {
            .stats {
              flex-direction: column;
              gap: 8px;
            }
            
            .stat-item {
              width: 100%;
            }
            
            .filter-tabs {
              gap: 4px;
            }
            
            .filter-tab {
              padding: 6px 10px;
              font-size: 0.7em;
            }
            
            th:nth-child(3),
            td:nth-child(3),
            th:nth-child(4),
            td:nth-child(4) {
              display: none;
            }
          }
        </style>
        
        <!-- Inline JavaScript for filtering -->
        <script>
          <![CDATA[
            // Search and filter functionality
            function filterTable() {
              const searchTerm = document.getElementById('searchInput').value.toLowerCase();
              const activeFilter = document.querySelector('.filter-tab.active')?.dataset.filter || 'all';
              const rows = document.querySelectorAll('tbody tr');
              let visibleCount = 0;
              
              rows.forEach(row => {
                const url = row.querySelector('.url')?.textContent.toLowerCase() || '';
                const category = row.dataset.category || '';
                const priority = row.dataset.priority || '';
                
                const matchesSearch = searchTerm === '' || url.includes(searchTerm);
                const matchesFilter = activeFilter === 'all' || 
                  (activeFilter === 'high' && priority === 'high') ||
                  (activeFilter === 'medium' && priority === 'medium') ||
                  (activeFilter === 'low' && priority === 'low') ||
                  category.includes(activeFilter);
                
                if (matchesSearch && matchesFilter) {
                  row.classList.remove('hidden');
                  visibleCount++;
                } else {
                  row.classList.add('hidden');
                }
              });
              
              document.getElementById('visibleCount').textContent = visibleCount;
              document.getElementById('totalCount').textContent = rows.length;
              
              // Show/hide no results message
              const noResults = document.getElementById('noResults');
              if (visibleCount === 0) {
                noResults.style.display = 'block';
              } else {
                noResults.style.display = 'none';
              }
            }
            
            // Initialize on page load
            document.addEventListener('DOMContentLoaded', function() {
              // Set up filter tabs
              document.querySelectorAll('.filter-tab').forEach(tab => {
                tab.addEventListener('click', function() {
                  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                  this.classList.add('active');
                  filterTable();
                });
              });
              
              // Set up search
              document.getElementById('searchInput').addEventListener('input', filterTable);
              
              // Back to top button
              window.addEventListener('scroll', function() {
                const btn = document.getElementById('backToTop');
                if (window.scrollY > 300) {
                  btn.style.display = 'flex';
                } else {
                  btn.style.display = 'none';
                }
              });
              
              document.getElementById('backToTop').addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              });
            });
          ]]>
        </script>
      </head>
      <body>
        <div class="container">
          <!-- ==================================================================
               HEADER
               ================================================================== -->
          <div class="header">
            <div class="header-content">
              <span class="school-badge">📚 Official Sitemap</span>
              <h1>
                Kinyui Boys <span class="highlight">Senior School</span>
              </h1>
              <p>Soaring to Excellence — Complete Website Directory &amp; Navigation Guide</p>
              
              <!-- Statistics Dashboard -->
              <div class="stats">
                <div class="stat-item">
                  <div class="stat-value">
                    <xsl:value-of select="count(urlset/url)"/>
                  </div>
                  <div class="stat-label">Total Pages</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">
                    <xsl:value-of select="count(urlset/url[contains(loc, 'admissions') or contains(loc, 'Apply') or contains(loc, 'fees') or contains(loc, 'StudentPortal')])"/>
                  </div>
                  <div class="stat-label">Core Pages</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">
                    <xsl:value-of select="count(urlset/url[contains(loc, 'gallery') or contains(loc, 'events') or contains(loc, 'magazine') or contains(loc, 'achievements')])"/>
                  </div>
                  <div class="stat-label">Media &amp; News</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">
                    <xsl:value-of select="count(urlset/url[priority > 0.8])"/>
                  </div>
                  <div class="stat-label">High Priority</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- ==================================================================
               CONTENT AREA
               ================================================================== -->
          <div class="content">
            <!-- Info Note -->
            <div class="note">
              <span class="note-icon">📌</span>
              <div class="note-content">
                <strong>SEO-Optimized URLs Active</strong>
                <small>All pages use clean, descriptive URLs for better search engine visibility. Last updated: April 29, 2026.</small>
              </div>
            </div>
            
            <!-- Search Bar -->
            <div class="search-container">
              <span class="search-icon">🔍</span>
              <input 
                type="text" 
                id="searchInput" 
                class="search-input" 
                placeholder="Search pages by name or URL... (e.g., 'admissions', 'fees', 'gallery')"
                autocomplete="off"
              />
            </div>
            
            <!-- Filter Tabs -->
            <div class="filter-tabs">
              <button class="filter-tab active" data-filter="all">
                📋 All Pages <span class="count"><xsl:value-of select="count(urlset/url)"/></span>
              </button>
              <button class="filter-tab" data-filter="high">
                ⭐ High Priority <span class="count"><xsl:value-of select="count(urlset/url[priority > 0.8])"/></span>
              </button>
              <button class="filter-tab" data-filter="medium">
                📄 Medium Priority <span class="count"><xsl:value-of select="count(urlset/url[priority > 0.5 and priority &lt;= 0.8])"/></span>
              </button>
              <button class="filter-tab" data-filter="low">
                📎 Low Priority <span class="count"><xsl:value-of select="count(urlset/url[priority &lt;= 0.5])"/></span>
              </button>
              <button class="filter-tab" data-filter="admissions">
                🎓 Admissions
              </button>
              <button class="filter-tab" data-filter="academics">
                📖 Academics
              </button>
            </div>
            
            <!-- Results Info -->
            <div class="results-info">
              <span>Showing <span class="results-count" id="visibleCount"><xsl:value-of select="count(urlset/url)"/></span> of <span id="totalCount"><xsl:value-of select="count(urlset/url)"/></span> pages</span>
              <span style="font-size:0.8em; opacity:0.7;">📊 Sorted by priority (highest first)</span>
            </div>
            
            <!-- Table -->
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>📄 Page URL</th>
                    <th>📅 Last Modified</th>
                    <th>🔄 Change Frequency</th>
                    <th>⚡ Priority</th>
                  </tr>
                </thead>
                <tbody>
                  <xsl:for-each select="urlset/url">
                    <xsl:sort select="priority" data-type="number" order="descending"/>
                    
                    <!-- Determine category for filtering -->
                    <xsl:variable name="loc" select="loc"/>
                    <xsl:variable name="category">
                      <xsl:choose>
                        <xsl:when test="contains($loc, 'admissions') or contains($loc, 'Apply') or contains($loc, 'fees')">admissions</xsl:when>
                        <xsl:when test="contains($loc, 'StudentPortal') or contains($loc, 'Guidance') or contains($loc, 'Policies')">academics</xsl:when>
                        <xsl:when test="contains($loc, 'gallery') or contains($loc, 'events') or contains($loc, 'magazine') or contains($loc, 'achievements')">media</xsl:when>
                        <xsl:when test="contains($loc, 'staff') or contains($loc, 'careers')">resources</xsl:when>
                        <xsl:when test="contains($loc, 'contact') or contains($loc, 'AboutUs')">info</xsl:when>
                        <xsl:when test="contains($loc, 'Sign')">admin</xsl:when>
                        <xsl:otherwise>other</xsl:otherwise>
                      </xsl:choose>
                    </xsl:variable>
                    
                    <!-- Determine priority level -->
                    <xsl:variable name="priorityLevel">
                      <xsl:choose>
                        <xsl:when test="priority > 0.8">high</xsl:when>
                        <xsl:when test="priority > 0.5">medium</xsl:when>
                        <xsl:otherwise>low</xsl:otherwise>
                      </xsl:choose>
                    </xsl:variable>
                    
                    <tr data-category="{$category}" data-priority="{$priorityLevel}">
                      <td>
                        <a class="url" href="{loc}" target="_blank" rel="noopener noreferrer">
                          <span class="url-icon">
                            <xsl:choose>
                              <xsl:when test="contains($loc, '/') and string-length(substring-after($loc, 'https://kinyuiboyssenior.school')) > 1">📄</xsl:when>
                              <xsl:otherwise>🏠</xsl:otherwise>
                            </xsl:choose>
                          </span>
                          <span>
                            <xsl:value-of select="substring-after($loc, 'https://kinyuiboyssenior.school')"/>
                          </span>
                        </a>
                      </td>
                      <td style="white-space:nowrap;">
                        <xsl:value-of select="lastmod"/>
                      </td>
                      <td>
                        <span class="badge {changefreq}">
                          <xsl:value-of select="changefreq"/>
                        </span>
                      </td>
                      <td>
                        <div class="priority {$priorityLevel}">
                          <div class="priority-bar">
                            <div class="priority-fill" style="width:{priority * 100}%"></div>
                          </div>
                          <span class="priority-text">
                            <xsl:value-of select="priority"/>
                          </span>
                        </div>
                      </td>
                    </tr>
                  </xsl:for-each>
                </tbody>
              </table>
            </div>
            
            <!-- No Results State -->
            <div id="noResults" class="no-results" style="display:none;">
              <i>🔍</i>
              <p>No pages match your search or filter</p>
              <small>Try different keywords or clear filters</small>
            </div>
          </div>
          
          <!-- ==================================================================
               FOOTER
               ================================================================== -->
          <div class="footer">
            <p>
              <strong>Kinyui Boys Senior School</strong> | Matungulu, Machakos County, Kenya
            </p>
            <div class="footer-links">
              <a href="https://kinyuiboyssenior.school" target="_blank" rel="noopener">🏠 Visit Website</a>
              <span class="footer-divider">|</span>
              <a href="https://kinyuiboyssenior.school/pages/contact" target="_blank" rel="noopener">📧 Contact Us</a>
              <span class="footer-divider">|</span>
              <a href="https://kinyuiboyssenior.school/pages/admissions" target="_blank" rel="noopener">🎓 Admissions</a>
              <span class="footer-divider">|</span>
              <a href="https://kinyuiboyssenior.school/pages/fees" target="_blank" rel="noopener">💰 Fee Structure</a>
              <span class="footer-divider">|</span>
              <a href="https://kinyuiboyssenior.school/sitemap.xml" target="_blank" rel="noopener">🗺️ XML Sitemap</a>
            </div>
            <small>
              Generated: <xsl:value-of select="urlset/url[1]/lastmod"/> | 
              Last updated: 2026-04-29 | 
              Next scheduled update: 2026-05-06 |
              Maintained by ICT Department
            </small>
          </div>
        </div>
        
        <!-- Back to Top Button -->
        <button id="backToTop" class="back-to-top" aria-label="Back to top" style="display:none;">
          ↑
        </button>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>