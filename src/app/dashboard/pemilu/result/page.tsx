"use client";

import { useState, useEffect } from "react";
import { Lock, RefreshCw, Trophy } from "lucide-react";
import Image from "next/image";

type ResultType = {
  id: string;
  nomor_urut: number;
  ketua: string;
  wakil: string;
  foto: string;
  totalSuara: number;
};

export default function ResultPage() {
  const [loading, setLoading] = useState(true);
  const [isPublished, setIsPublished] = useState(false);
  const [results, setResults] = useState<ResultType[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Panggil API yang baru kita buat
      const res = await fetch("/dashboard/api/pemilu/result"); 
      const json = await res.json();

      if (json.success) {
        setIsPublished(json.isPublished);
        if (json.isPublished) {
          // Sort biar yang menang paling atas/kiri
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sorted = json.data.sort((a: any, b: any) => b.totalSuara - a.totalSuara);
          setResults(sorted);
          setTotalVotes(json.totalVotesAll);
        }
      }
    } catch (error) {
      console.error("Error fetching results", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Opsional: Auto refresh setiap 30 detik buat Real Count effect
    const interval = setInterval(fetchData, 30000); 
    return () => clearInterval(interval);
  }, []);

  // --- TAMPILAN 1: LOADING ---
  if (loading && results.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-500">Mengambil data suara...</p>
      </div>
    );
  }

  // --- TAMPILAN 2: BELUM DIPUBLIKASI (CONFIG OFF) ---
  if (!isPublished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <div className="mx-auto bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Hasil Belum Tersedia</h1>
          <p className="mt-2 text-gray-500">
            Proses pemungutan atau perhitungan suara sedang berlangsung. 
            Hasil akan ditampilkan di halaman ini setelah dikonfirmasi oleh panitia.
          </p>
          <button 
            onClick={fetchData}
            className="mt-6 flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            <RefreshCw className="w-4 h-4" /> Cek Lagi
          </button>
        </div>
      </div>
    );
  }

  // --- TAMPILAN 3: HASIL REAL COUNT (CONFIG ON) ---
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Hasil Real Count Pemilu
          </h1>
          <p className="mt-2 text-gray-600">
            Total Suara Masuk: <span className="font-bold text-blue-600">{totalVotes} Suara</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Data diperbarui secara otomatis setiap 30 detik.
          </p>
        </div>

        {/* Grid Card Paslon */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((paslon, index) => {
            // Hitung Persentase
            const percentage = totalVotes > 0 
                ? ((paslon.totalSuara / totalVotes) * 100).toFixed(1) 
                : "0";
            
            // Cek apakah dia pemenang sementara (Index 0 karena udah di sort)
            const isWinner = index === 0 && totalVotes > 0;

            return (
              <div 
                key={paslon.id} 
                className={`relative bg-white rounded-xl shadow-sm overflow-hidden border-2 transition-transform hover:scale-[1.02] ${
                    isWinner ? "border-yellow-400 ring-4 ring-yellow-100" : "border-transparent"
                }`}
              >
                {/* Crown Icon buat Pemenang */}
                {isWinner && (
                    <div className="absolute top-0 right-0 bg-yellow-400 text-white p-2 rounded-bl-xl z-10">
                        <Trophy className="w-5 h-5" />
                    </div>
                )}

                {/* Nomor Urut Badge */}
                <div className="absolute top-0 left-0 bg-gray-900 text-white py-1 px-3 rounded-br-lg font-bold z-10">
                    No. {paslon.nomor_urut}
                </div>

                {/* Foto Paslon */}
                <div className="aspect-video w-full bg-gray-100 relative">
                    <Image
                        width={500}
                        height={500} 
                        src={paslon.foto} 
                        alt={`Paslon ${paslon.nomor_urut}`} 
                        className="w-full h-full object-cover object-top"
                    />
                    {/* Overlay Gradient biar text kebaca */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    
                    {/* Persentase Besar di Foto */}
                    <div className="absolute bottom-4 left-4 text-white">
                        <span className="text-4xl font-black">{percentage}%</span>
                        <span className="text-sm opacity-80 ml-2">({paslon.totalSuara} Suara)</span>
                    </div>
                </div>

                {/* Detail Nama & Progress Bar */}
                <div className="p-5 space-y-4">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900 leading-tight">
                            {paslon.ketua}
                        </h3>
                        <p className="text-sm text-gray-500">& {paslon.wakil}</p>
                    </div>

                    {/* Progress Bar Visual */}
                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${
                                isWinner ? "bg-yellow-500" : "bg-blue-600"
                            }`}
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}