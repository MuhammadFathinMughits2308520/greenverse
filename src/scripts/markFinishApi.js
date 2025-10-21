// src/scripts/markFinishApi.js
export default async function markFinishApi(comic, episode, last_page = 0, opts = {}) {
  const token = localStorage.getItem("access");
  const body = { comic, episode, last_page, ...opts };

  const res = await fetch("https://backendecombot-production.up.railway.app/api/comic-progress/finish/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body)
  });

  // always parse JSON regardless of ok so we can throw detailed error
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // sertakan info agar caller bisa menampilkan pesan
    const err = new Error(data.message || data.detail || "Request failed");
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}


//gunakan di handler ketika explorasi selesai
// const handleMarkFinish = async () => {
//   try {
//     const result = await markFinishApi(comicSlug, episodeSlug, currentPage);
//     if (result.finish) {
//       showToast("Selamat! Eksplorasi selesai.");
//       // update UI / permission local
//       setPermission(p => ({ ...p, finish: true }));
//     }
//   } catch (err) {
//     // err.message / err.current_last_page tersedia dari server
//     showToast(err.message || "Gagal menandai selesai");
//   }
// };
