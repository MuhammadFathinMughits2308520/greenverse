// Ecombot.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import markFinishApi from "../scripts/markFinishApi";
import axios from "axios";

function Ecombot() {
  const navigate = useNavigate();
  const params = useParams(); // expects route like /comics/:comic/:episode/ecombot (optional)
  // try params.comic or params.comic_slug or fallback later
  const comicParam = params.comic || params.comic_slug || params.comicSlug || null;
  const episodeParam = params.episode || params.episode_slug || params.episodeSlug || null;

  // determine comic/episode slugs (fallback to sensible defaults or localStorage)
  const comicSlug = comicParam || localStorage.getItem("last_comic_slug") || "my-comic";
  const episodeSlug = episodeParam || localStorage.getItem("last_episode_slug") || "e_001";

  // determine currentPage from localStorage (saved by ComicReader)
  const storageKey = `comic_last_${comicSlug}_${episodeSlug}`;
  const savedPage = Number(localStorage.getItem(storageKey) ?? 0);

  const [message, setMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [permission, setPermission] = useState({ finish: false, last_page: savedPage });
  const toastTimerRef = useRef(null);

  // cleanup toast timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access");
    // If you expect ecombot endpoint under a different path, change URL accordingly
    axios.get("http://127.0.0.1:8000/api/ecombot/", {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    .then(res => {
      // assume res.data.message exists
      setMessage(res.data?.message ?? "Halo dari Ecombot");
    })
    .catch(err => {
      // prefer server message if available
      const serverMsg = err?.response?.data?.detail || err?.response?.data?.message;
      setMessage(serverMsg ? `Terjadi kesalahan: ${serverMsg}` : "Terjadi kesalahan saat mengambil data");
      console.error("Ecombot fetch error:", err);
    });
    // only run once
  }, [comicSlug, episodeSlug]);

  const showToast = (msg, timeout = 2500) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage("");
      toastTimerRef.current = null;
    }, timeout);
  };

  const handleMarkFinish = async () => {
  const currentPage = Number(localStorage.getItem(storageKey) ?? 0);
  const token = localStorage.getItem("access");
  console.debug("handleMarkFinish called", { comic: comicSlug, episode: episodeSlug, currentPage, tokenPresent: !!token });

  try {
    const result = await markFinishApi(comicSlug, episodeSlug, currentPage, { complete: true });
    console.log("markFinish result:", result);
    if (result.finish) {
      showToast("Selamat! Eksplorasi selesai.");
      setPermission(p => ({ ...p, finish: true, last_page: Math.max(p.last_page ?? 0, currentPage) }));
      setTimeout(() => navigate('/ecomic'), 3000);
    } else {
      showToast(result.message || "Gagal menandai selesai");
    }
  } catch (err) {
    console.error("markFinishApi error:", err);
    const msg = err?.body?.message || err?.message || "Gagal menandai selesai";
    showToast(msg);
    if (err.status === 401) {
      // token invalid / user harus login ulang
      navigate('/login');
    }
  }
};




  return (
    <div style={{ marginTop: "100px", textAlign: "center", padding: "1rem" }}>
      <h2>Ini halaman bot</h2>
      <p>{message}</p>

      <div style={{ marginTop: 16 }}>
        <button onClick={handleMarkFinish} style={{ padding: "10px 16px", borderRadius: 8, cursor: "pointer" }}>
          Klik ini untuk menandai selesai
        </button>
      </div>

      {toastMessage && (
        <div className="ecombot-toast" role="status" style={{
          position: "fixed",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: "3.5rem",
          background: "rgba(0,0,0,0.85)",
          color: "#fff",
          padding: "0.6rem 1rem",
          borderRadius: 8,
          zIndex: 9999
        }}>
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default Ecombot;
