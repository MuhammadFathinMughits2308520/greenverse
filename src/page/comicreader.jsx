// ComicReader.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/comicreader.css";

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
  const [permission, setPermission] = useState(null); // { finish: bool, allowed_page: number, last_page: number }

  const containerRef = useRef(null);
  const imageCache = useRef({});
  const hideHeaderTimer = useRef(null);

  // key localStorage per comic/episode
  const storageKey = `comic_last_${comic}_${episode}`;

  // --- Fetch manifest (same as before) ---
  useEffect(() => {
    let ignore = false;
    const fetchManifest = async () => {
      try {
        const response = await fetch(
          `https://backendecombot-production.up.railway.app/api/comics/${comic}/${episode}/manifest.json`
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
    // tunggu permission jika belum null; jika permission null berarti
    // kita masih loading permission — tetapi ambil localStorage agar tidak kosong.
    const savedLocal = Number(localStorage.getItem(storageKey) ?? 0);
    const serverLast = (permission && typeof permission.last_page === "number") ? permission.last_page : null;
    // prioritas: server -> local -> 0
    const startFrom = (serverLast !== null) ? serverLast : savedLocal;
    const clamped = Math.max(0, Math.min(startFrom, manifest.pages.length - 1));
    setCurrentPage(clamped);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manifest, permission]);


  // --- Load user permission & last page from backend (if logged in) ---
  useEffect(() => {
    let ignore = false;
    const token = localStorage.getItem("access");
    if (!token) {
      // fallback: try localStorage only
      const saved = localStorage.getItem(storageKey);
      if (saved) setCurrentPage(Number(saved));
      setPermission({ finish: true, allowed_page: Infinity }); // allow everything for anonymous
      return;
    }

    const fetchPermission = async () => {
      try {
        const params = new URLSearchParams({ comic, episode });
        const res = await fetch(`https://backendecombot-production.up.railway.app/api/comic-progress/?${params.toString()}`, {
          headers: { "Content-Type": "application/json", ...getAuthHeader() },
        });
        if (!res.ok) {
          // If endpoint not found or error, fallback safe defaults
          setPermission({ finish: false, allowed_page: Infinity, last_page: 0 });
          const saved = localStorage.getItem(storageKey);
          if (saved) setCurrentPage(Number(saved));
          return;
        }
        const data = await res.json();
        if (!ignore) {
          // expected response example: { finish: false, allowed_page: 2, last_page: 1 }
          setPermission({
            finish: data.finish ?? false,
            allowed_page: typeof data.allowed_page === "number" ? data.allowed_page : (data.last_page ?? 0),
            last_page: data.last_page ?? 0
          });
          // restore last page (priority: server -> localStorage)
          const startPage = data.last_page ?? Number(localStorage.getItem(storageKey) ?? 0);
          setCurrentPage(Math.max(0, Math.min(startPage, (manifest?.pages?.length ?? 1) - 1)));
        }
      } catch (err) {
        console.warn("permission fetch failed:", err);
        setPermission({ finish: false, allowed_page: Infinity, last_page: 0 });
        const saved = localStorage.getItem(storageKey);
        if (saved) setCurrentPage(Number(saved));
      }
    };
    fetchPermission();
    return () => { ignore = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comic, episode]);

  // --- Image preloading & caching (aggressive, keeps cache so switching pages doesn't reload) ---
  useEffect(() => {
    if (!manifest?.pages) return;
    const preloadImage = (idx, priority = false) => {
      if (idx < 0 || idx >= manifest.pages.length) return;
      if (loadedImages.has(idx) || imageErrors.has(idx)) return;
      if (imageCache.current[idx]) return; // already cached

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

    // preload current (high), next two, prev one, and a couple further ahead
    preloadImage(currentPage, true);
    preloadImage(currentPage + 1, true);
    preloadImage(currentPage + 2);
    preloadImage(currentPage - 1);
    preloadImage(currentPage + 3);
  }, [currentPage, manifest, loadedImages, imageErrors]);

  // --- Save last-read into localStorage and optionally backend (debounced-ish) ---
  // --- Tampilkan chatbot ketika user sudah di halaman 3 atau sudah finish eksplorasi ---
useEffect(() => {
  // tampilkan jika user di halaman ke-3 atau status finish true
  const shouldShow = currentPage >= 2 || permission?.finish === true;
  setShowChatbot(shouldShow);

  // simpan progress ke localStorage + backend
  localStorage.setItem(storageKey, String(currentPage));
  const saveBackend = async () => {
    const token = localStorage.getItem("access");
    if (!token) return;
    try {
      await fetch("https://backendecombot-production.up.railway.app/api/comic-progress/", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify({ comic, episode, last_page: currentPage }),
      });
    } catch (err) {
      console.debug("save progress failed:", err);
    }
  };
  saveBackend();
}, [currentPage, comic, episode, permission]);


  // --- Utility: show toast */}
  const showToast = (msg, timeout = 2500) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), timeout);
  };

  // --- Navigation checks (permission) ---
  const canGoToPage = useCallback(async (targetIndex) => {
  if (!manifest) return false;
  const lastIndex = manifest.pages.length - 1;
  if (targetIndex < 0 || targetIndex > lastIndex) return false;

  // semua halaman diizinkan kalau sudah finish
  if (permission?.finish) return true;

  // kalau belum finish, hanya boleh sampai halaman terakhir yang pernah dibaca
  if (targetIndex <= 2) return true;

  // fallback ke server check
  try {
    const params = new URLSearchParams({ comic, episode, page: targetIndex });
    const res = await fetch(`https://backendecombot-production.up.railway.app/api/comic-progress/?${params.toString()}`, {
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
    });
    const data = await res.json();
    return data.finish === true || targetIndex <= data.last_page;
  } catch (err) {
    console.warn("permission-check failed:", err);
    return true;
  }
}, [manifest, permission, comic, episode]);



  // --- Navigation functions with permission checks ---
  const goToNextPage = useCallback(async () => {
    if (!manifest) return;
    const target = currentPage + 1;
    const allowed = await canGoToPage(target);
    if (!allowed) {
      showToast("Selesaikan explorasi terlebih dahulu");
      setTimeout(() => {
        navigate('/ecombot');
      }, 1500);
      return;
    }
    setCurrentPage(prev => Math.min(prev + 1, manifest.pages.length - 1));
    setHeaderVisible(true);
  }, [currentPage, manifest, canGoToPage]);

  const goToPrevPage = useCallback(async () => {
    if (!manifest) return;
    const target = currentPage - 1;
    const allowed = await canGoToPage(target);
    if (!allowed) {
      showToast("Tidak bisa pindah ke halaman tersebut");
      return;
    }
    setCurrentPage(prev => Math.max(prev - 1, 0));
    setHeaderVisible(true);
  }, [currentPage, manifest, canGoToPage]);

  const goToPage = useCallback(async (pageIndex) => {
    if (!manifest) return;
    const allowed = await canGoToPage(pageIndex);
    if (!allowed) {
      showToast("Selesaikan explorasi terlebih dahulu");
      return;
    }
    setCurrentPage(pageIndex);
    setHeaderVisible(true);
  }, [manifest, canGoToPage]);

  // keyboard & touch handlers (same as before)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goToNextPage(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goToPrevPage(); }
      if (e.key === "Home") { e.preventDefault(); goToPage(0); }
      if (e.key === "End") { e.preventDefault(); goToPage(manifest?.pages.length - 1); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNextPage, goToPrevPage, goToPage, manifest]);

  // touch/swipe handlers
  const touchStartX = useRef(0);
  const handleTouchStart = (e) => touchStartX.current = e.touches[0].clientX;
  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - endX;
    if (Math.abs(diff) < 50) return;
    if (diff > 0) goToNextPage(); else goToPrevPage();
  };

  // header toggle
  const handleImageClick = () => {
    setHeaderVisible(v => !v);
    clearTimeout(hideHeaderTimer.current);
    hideHeaderTimer.current = setTimeout(() => setHeaderVisible(false), 3000);
  };

  // cleanup timer on unmount
  useEffect(() => () => clearTimeout(hideHeaderTimer.current), []);

  // save progress on unload (defensive)
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem(storageKey, String(currentPage));
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [currentPage, storageKey]);

  // Rendering fallback states
  if (error) return (<div className="comic-reader-container"><div className="comic-reader-error"><p className="error-message">❌ Error: {error}</p><p className="error-detail">Failed to load comic.</p></div></div>);
  if (!manifest) return (<div className="comic-reader-container"><div className="comic-reader-loading"><Loader /><p>Loading comic...</p></div></div>);
  if (!manifest.pages || manifest.pages.length === 0) return (<div className="comic-reader-container"><p className="comic-reader-no-pages">⚠️ No pages found in this comic</p></div>);

  const currentPageData = manifest.pages[currentPage];
  const isImageLoaded = loadedImages.has(currentPage);
  const progress = ((currentPage + 1) / manifest.pages.length) * 100;

  return (
    <div ref={containerRef} className="comic-reader" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="comic-reader-progress" style={{ width: `${progress}%` }} />

      <div className={`comic-reader-header ${!headerVisible ? 'hidden' : ''}`}>
        <div className="comic-reader-title">{manifest.title || `${comic} - Episode ${episode}`}</div>
        <div className="comic-reader-counter">{currentPage + 1} / {manifest.pages.length}</div>
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

      {/* touch areas */}
      {currentPage > 0 && <div className="comic-reader-touch-area left" onClick={() => goToPrevPage()} />}
      {currentPage < manifest.pages.length - 1 && <div className="comic-reader-touch-area right" onClick={() => goToNextPage()} />}

      {/* navigation buttons */}
      {currentPage > 0 && <button onClick={() => goToPrevPage()} className="comic-reader-nav-btn prev" aria-label="Previous page"><ChevronLeft /></button>}
      {currentPage < manifest.pages.length - 1 && <button onClick={() => goToNextPage()} className="comic-reader-nav-btn next" aria-label="Next page"><ChevronRight /></button>}

      {/* dots */}
      <div className="comic-reader-dots">{manifest.pages.map((_, idx) => (<button key={idx} onClick={() => goToPage(idx)} className={`comic-reader-dot ${currentPage === idx ? 'active' : ''}`} aria-label={`Go to page ${idx + 1}`}></button>))}</div>

      {/* Chatbot floating (requirement #1) */}
      {showChatbot && (
        <div className="chatbot-floating" role="button" tabIndex={0} onClick={() => showToast("Chatbot opened (placeholder)")}>
          <img src="/item/chatbot-icon.svg" alt="Chatbot" onClick={() => navigate('/ecombot')}/>
        </div>
      )}

      {/* Toast */}
      {toastMessage && <div className="comic-toast" role="status">{toastMessage}</div>}
    </div>
  );
}
