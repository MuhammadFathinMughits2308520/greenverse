// ComicReader.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
import LogoutButton from "../component/logoutbutton";
import "../styles/comicreader.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://backendecombot-production.up.railway.app/api';


// SVG Icons
const ChevronLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const Loader = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spinner">
    <line x1="12" y1="2" x2="12" y2="6"></line>
    <line x1="12" y1="18" x2="12" y2="22"></line>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
    <line x1="2" y1="12" x2="6" y2="12"></line>
    <line x1="18" y1="12" x2="22" y2="12"></line>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
  </svg>
);

// Helper: ambil token JWT (jika ada)
const getAuthHeader = () => {
  const token = localStorage.getItem("access");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function ComicReader({ comic = "sample", episode = "1" }) {
  const [manifest, setManifest] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [imageErrors, setImageErrors] = useState(new Set());
  const [headerVisible, setHeaderVisible] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [showChatbot, setShowChatbot] = useState(false);
  const { isDark, toggleDarkMode } = useDarkMode();
  const [permission, setPermission] = useState(null);
  const [needsPermissionRefresh, setNeedsPermissionRefresh] = useState(false);

  const containerRef = useRef(null);
  const imageCache = useRef({});
  const hideHeaderTimer = useRef(null);

  // key localStorage per comic/episode
  const storageKey = `comic_last_${comic}_${episode}`;

  // --- Fetch manifest ---
  useEffect(() => {
    let ignore = false;
    const fetchManifest = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/comics/${comic}/${episode}/manifest.json`
        );
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (!ignore) {
          setManifest(data);
        }
      } catch (err) {
        if (!ignore) setError(err.message);
      }
    };
    fetchManifest();
    return () => { ignore = true; };
  }, [comic, episode]);

  useEffect(() => {
    if (!manifest) return;
    const savedLocal = Number(localStorage.getItem(storageKey) ?? 0);
    const serverLast = (permission && typeof permission.last_page === "number") ? permission.last_page : null;
    const startFrom = (serverLast !== null) ? serverLast : savedLocal;
    const clamped = Math.max(0, Math.min(startFrom, manifest.pages.length - 1));
    setCurrentPage(clamped);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manifest, permission]);

  // --- Load user permission & last page from backend ---
  useEffect(() => {
    let ignore = false;
    const token = localStorage.getItem("access");
    if (!token) {
      const saved = localStorage.getItem(storageKey);
      if (saved) setCurrentPage(Number(saved));
      setPermission({ finish: true, allowed_page: Infinity });
      return;
    }

    const fetchPermission = async () => {
      try {
        const params = new URLSearchParams({ comic, episode });
        const res = await fetch(`${API_BASE}/comic-progress/?${params.toString()}`, {
          headers: { "Content-Type": "application/json", ...getAuthHeader() },
        });
        if (!res.ok) {
          setPermission({ finish: false, allowed_page: 2, last_page: 0 });
          const saved = localStorage.getItem(storageKey);
          if (saved) setCurrentPage(Number(saved));
          return;
        }
        const data = await res.json();
        if (!ignore) {
          setPermission({
            finish: data.finish ?? false,
            allowed_page: typeof data.allowed_page === "number" ? data.allowed_page : 2,
            last_page: data.last_page ?? 0
          });
          const startPage = data.last_page ?? Number(localStorage.getItem(storageKey) ?? 0);
          setCurrentPage(Math.max(0, Math.min(startPage, (manifest?.pages?.length ?? 1) - 1)));
        }
      } catch (err) {
        console.warn("permission fetch failed:", err);
        setPermission({ finish: false, allowed_page: 2, last_page: 0 });
        const saved = localStorage.getItem(storageKey);
        if (saved) setCurrentPage(Number(saved));
      }
    };
    fetchPermission();
    return () => { ignore = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comic, episode, needsPermissionRefresh]);

  // --- Image preloading & caching ---
  useEffect(() => {
    if (!manifest?.pages) return;
    const preloadImage = (idx, priority = false) => {
      if (idx < 0 || idx >= manifest.pages.length) return;
      if (loadedImages.has(idx) || imageErrors.has(idx)) return;
      if (imageCache.current[idx]) return;

      const page = manifest.pages[idx];
      const img = new Image();
      if (priority) img.fetchPriority = "high";
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, idx]));
        imageCache.current[idx] = img;
      };
      img.onerror = () => {
        setImageErrors(prev => new Set([...prev, idx]));
      };
      img.src = page.url;
    };

    preloadImage(currentPage, true);
    preloadImage(currentPage + 1, true);
    preloadImage(currentPage + 2);
    preloadImage(currentPage - 1);
    preloadImage(currentPage + 3);
  }, [currentPage, manifest, loadedImages, imageErrors]);

  // --- Save progress & show chatbot ---
  useEffect(() => {
    const shouldShow = currentPage >= 2 || permission?.finish === true;
    setShowChatbot(shouldShow);

    localStorage.setItem(storageKey, String(currentPage));
    const saveBackend = async () => {
      const token = localStorage.getItem("access");
      if (!token) return;
      try {
        await fetch(`${API_BASE}/comic-progress/`, {
          method: "POST",
          headers: { "Content-Type": "application/json", ...getAuthHeader() },
          body: JSON.stringify({ comic, episode, last_page: currentPage }),
        });
      } catch (err) {
        console.debug("save progress failed:", err);
      }
    };
    saveBackend();
  }, [currentPage, comic, episode, permission, storageKey]);

  // --- Utility: show toast ---
  const showToast = (msg, timeout = 2500) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), timeout);
  };

  // --- Navigation checks (permission) ---
  const canGoToPage = useCallback(async (targetIndex) => {
    if (!manifest) return false;
    const lastIndex = manifest.pages.length - 1;
    if (targetIndex < 0 || targetIndex > lastIndex) return false;

    if (permission?.finish === true) return true;

    const MAX_PAGE_WITHOUT_FINISH = 2;
    if (targetIndex <= MAX_PAGE_WITHOUT_FINISH) return true;

    if (!permission) {
      try {
        const params = new URLSearchParams({ comic, episode });
        const res = await fetch(`${API_BASE}/comic-progress/?${params.toString()}`, {
          headers: { "Content-Type": "application/json", ...getAuthHeader() },
        });
        if (!res.ok) return false;
        const data = await res.json();
        
        setPermission({
          finish: data.finish ?? false,
          allowed_page: data.allowed_page ?? 2,
          last_page: data.last_page ?? 0
        });
        
        return data.finish === true;
      } catch (err) {
        console.warn("permission-check failed:", err);
        return false;
      }
    }

    return false;
  }, [manifest, permission, comic, episode]);

  // --- Navigation functions ---
  const goToNextPage = useCallback(async () => {
    if (!manifest) return;
    const target = currentPage + 1;
    
    if (target >= manifest.pages.length) {
      showToast("Ini adalah halaman terakhir");
      return;
    }
    
    const allowed = await canGoToPage(target);
    
    if (!allowed) {
      showToast("Selesaikan explorasi terlebih dahulu untuk membuka halaman berikutnya");
      setTimeout(() => {
        navigate('/ecombot');
      }, 2000);
      return;
    }
    
    setCurrentPage(target);
    setHeaderVisible(true);
  }, [currentPage, manifest, canGoToPage, navigate]);

  const goToPrevPage = useCallback(async () => {
    if (!manifest) return;
    const target = currentPage - 1;
    
    if (target < 0) {
      showToast("Ini adalah halaman pertama");
      return;
    }
    
    const allowed = await canGoToPage(target);
    if (!allowed) {
      showToast("Tidak bisa mengakses halaman tersebut");
      return;
    }
    
    setCurrentPage(target);
    setHeaderVisible(true);
  }, [currentPage, manifest, canGoToPage]);

  const goToPage = useCallback(async (pageIndex) => {
    if (!manifest) return;
    
    if (pageIndex < 0 || pageIndex >= manifest.pages.length) {
      showToast("Halaman tidak valid");
      return;
    }
    
    const allowed = await canGoToPage(pageIndex);
    if (!allowed) {
      showToast("Selesaikan explorasi terlebih dahulu untuk membuka halaman ini");
      setTimeout(() => {
        navigate('/ecombot');
      }, 2000);
      return;
    }
    
    setCurrentPage(pageIndex);
    setHeaderVisible(true);
  }, [manifest, canGoToPage, navigate]);

  // --- Keyboard handlers ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goToNextPage(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goToPrevPage(); }
      if (e.key === "Home") { e.preventDefault(); goToPage(0); }
      if (e.key === "End" && manifest) { e.preventDefault(); goToPage(manifest.pages.length - 1); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextPage, goToPrevPage, goToPage, manifest]);

  // --- Touch handlers ---
  const touchStartX = useRef(0);
  const handleTouchStart = (e) => touchStartX.current = e.touches[0].clientX;
  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - endX;
    if (Math.abs(diff) < 50) return;
    if (diff > 0) goToNextPage(); else goToPrevPage();
  };

  // --- Header toggle ---
  const handleImageClick = () => {
    setHeaderVisible(v => !v);
    clearTimeout(hideHeaderTimer.current);
    hideHeaderTimer.current = setTimeout(() => setHeaderVisible(false), 3000);
  };

  // --- Cleanup timer ---
  useEffect(() => () => clearTimeout(hideHeaderTimer.current), []);

  // --- Refresh permission when tab becomes visible ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setNeedsPermissionRefresh(prev => !prev);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', () => setNeedsPermissionRefresh(prev => !prev));
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', () => {});
    };
  }, []);

  // --- Save on unload ---
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem(storageKey, String(currentPage));
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [currentPage, storageKey]);

  // --- Rendering ---
  if (error) return (<div className="comic-reader-container"><div className="comic-reader-error"><p className="error-message">❌ Error: {error}</p><p className="error-detail">Failed to load comic.</p></div></div>);
  if (!manifest) return (<div className="comic-reader-container"><div className="comic-reader-loading"><Loader /><p>Loading comic...</p></div></div>);
  if (!manifest.pages || manifest.pages.length === 0) return (<div className="comic-reader-container"><p className="comic-reader-no-pages">⚠️ No pages found in this comic</p></div>);

  const currentPageData = manifest.pages[currentPage];
  const isImageLoaded = loadedImages.has(currentPage);
  const progress = ((currentPage + 1) / manifest.pages.length) * 100;

  const handleLogout = () => {
    window.location.href = "/login";
  };

  return (
    <div ref={containerRef} className="comic-reader" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="comic-reader-progress" style={{ width: `${progress}%` }} />

      <div className={`comic-reader-header ${!headerVisible ? 'hidden' : ''}`}>
        <div className="comic-reader-title" onClick={()=>navigate('/')}>
          <img src="/item/logo.svg" alt="Logo" loading='lazy' className='logo'/>
          <span className="title-text">Ecombot</span>
        </div>
        <div className="comic-reader-counter">{currentPage + 1} / {manifest.pages.length}</div>
        <div className="comic-reader-aksi">
          <button 
            className="dark-mode-toggle-comic" 
            onClick={toggleDarkMode}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <LogoutButton onLogoutSuccess={handleLogout} />
        </div>
      </div>

      <div className="comic-reader-main">
        {!isImageLoaded && <div className="comic-reader-page-loading"><Loader /><p>Loading page {currentPage + 1}...</p></div>}
        <img
          src={currentPageData.url}
          alt={currentPageData.alt || `Page ${currentPage + 1}`}
          className={`comic-reader-image ${isImageLoaded ? 'visible' : ''}`}
          onClick={handleImageClick}
          onLoad={() => setLoadedImages(prev => new Set([...prev, currentPage]))}
          onError={(e) => { setImageErrors(prev => new Set([...prev, currentPage])); e.target.src = ""; }}
        />
      </div>

      {currentPage > 0 && <div className="comic-reader-touch-area left" onClick={goToPrevPage} />}
      {currentPage < manifest.pages.length - 1 && <div className="comic-reader-touch-area right" onClick={goToNextPage} />}

      {currentPage > 0 && <button onClick={goToPrevPage} className="comic-reader-nav-btn prev" aria-label="Previous page"><ChevronLeft /></button>}
      {currentPage < manifest.pages.length - 1 && <button onClick={goToNextPage} className="comic-reader-nav-btn next" aria-label="Next page"><ChevronRight /></button>}

      {showChatbot && (
        <div className="chatbot-floating" role="button" tabIndex={0} onClick={() => showToast("Chatbot opened (placeholder)")}>
          <img src="/item/chatbot-icon.svg" alt="Chatbot" onClick={() => navigate('/ecombot')}/>
        </div>
      )}

      {toastMessage && <div className="comic-toast" role="status">{toastMessage}</div>}
    </div>
  );
}