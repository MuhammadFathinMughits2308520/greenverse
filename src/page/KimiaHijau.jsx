import React from "react";
import contohImg from "../assets/image.png";

const KimiaHijau = () => {
  return (
        <>
          {/* Konten Materi */}
          <div className="p-6 overflow-y-auto h-full">
            <div className="flex flex-col bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4">
              <p className="text-gray-500 text-center">Materi 1</p>
              <h2 className='text-3xl text-gray-800 font-bold text-center mb-4'>Kimia Hijau</h2>
              <p className="text-gray-500 text-center mb-4">
                Sebelum bahas tradisi Mapag Hujan, Aquano akan membahas terlebih dahulu mengenai kimia hijau atau green chemistry.
              </p>
              <div className="flex justify-center bg-white rounded-xl shadow-md p-4 border border-gray-200">
                <img src={contohImg} alt="Contoh" className="w-80 h-auto rounded-lg object-cover" />
              </div>
              <p className="text-sm mb-4 text-gray-400 text-center">*Gambar 1. Prinsip Kimia Hijau</p>
              <p className="text-gray-500 text-center">
                Kimia hijau berperan penting dalam menjaga lingkungan dari dampak bahan kimia berbahaya.
              </p>
            </div>
          </div>
        </>
  );
};

export default KimiaHijau;
