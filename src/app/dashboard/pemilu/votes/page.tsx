"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, CheckCircle, Vote } from "lucide-react";
import { PaslonType } from "@/types";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function VotePage() {
  const router = useRouter();
  const { data: session } = useSession();

  // State Data & Logic (SAMA SEPERTI SEBELUMNYA)
  const [candidates, setCandidates] = useState<PaslonType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<PaslonType | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // MOCK USER
  const currentUser = {
    id: session?.user?.id as string,
    email: session?.user?.email as string,
  };

  // 1. Fetch Data Awal (SAMA SEPERTI SEBELUMNYA)
  useEffect(() => {
    const initPage = async () => {
      try {
        const configRes = await fetch("/dashboard/api/pemilu/config");
        const configJson = await configRes.json();

        if (!configJson.data?.isVotingOpen) {
          setIsVotingOpen(false);
          setLoading(false);
          return;
        }
        setIsVotingOpen(true);

        const paslonRes = await fetch("/dashboard/api/pemilu/paslon");
        const paslonJson = await paslonRes.json();

        if (paslonJson.success) {
          setCandidates(
            paslonJson.data.sort(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (a: any, b: any) => a.nomor_urut - b.nomor_urut
            )
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    initPage();
  }, []);

  // 2. Handle Klik & 3. Konfirmasi (SAMA SEPERTI SEBELUMNYA)
  const handleVoteClick = (candidate: PaslonType) => {
    setSelectedCandidate(candidate);
  };

  const confirmVote = async () => {
    if (!selectedCandidate) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/dashboard/api/pemilu/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          paslonId: selectedCandidate.id,
          userProfile: currentUser,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setHasVoted(true);
      setSelectedCandidate(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.message);
      if (error.message.includes("sudah menggunakan hak suara")) {
        setHasVoted(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // UI BARU DIMULAI DARI SINI
  // ==========================================

  // --- TAMPILAN 1: LOADING (Ganti jadi Skeleton) ---
  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-500">Mengambil data paslon...</p>
      </div>
    );

  // --- TAMPILAN 2: VOTING DITUTUP (UI dipercantik dengan Card) ---
  if (!isVotingOpen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full mx-auto">
          <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-slate-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Bilik Suara Ditutup
          </h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Sesi pemungutan suara saat ini sedang tidak aktif. Mohon tunggu
            informasi selanjutnya dari panitia.
          </p>
          <button
            onClick={() => router.push("/dashboard/pemilu/information")}
            className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition w-full"
          >
            Lihat informasi paslon
          </button>
        </div>
      </div>
    );
  }

  // --- TAMPILAN 3: SUDAH MEMILIH (UI dipercantik) ---
  if (hasVoted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50/50 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full mx-auto relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Suara Anda Telah Terekam!
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Terima kasih telah menggunakan hak pilih Anda. Partisipasi Anda
            sangat berarti untuk masa depan himpunan.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/dashboard/pemilu/result")}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Vote className="w-5 h-5" />
              Lihat Hasil Real Count
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full bg-white border-2 border-gray-200 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- TAMPILAN 4: BILIK SUARA UTAMA (UI BARU) ---
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header yang lebih rapi */}
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-3">
            Pemilu Raya HIMSI
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Bilik Suara Digital
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Tentukan pilihan terbaikmu untuk masa depan himpunan. <br />
            <span className="font-medium text-slate-900">
              Ingat, satu akun hanya memiliki satu hak suara.
            </span>
          </p>
          <Link href={'/dashboard/pemilu/information'} className="text-sm text-indigo-600 mt-6 font-semibold underline underline-offset-1">informasi lengkap paslon.</Link>
        </div>

        {/* Grid Card yang baru */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {candidates.map((paslon) => (
            <div
              key={paslon.id}
              className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full relative"
            >
              {/* Floating Number Badge (Pengganti Header Hitam) */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-slate-900 py-1.5 px-4 rounded-full font-bold text-sm shadow-sm z-10 border border-slate-100/50">
                No. Urut {paslon.nomor_urut}
              </div>

              {/* Foto dengan rasio baru (3:4 portrait) */}
              <div className="aspect-[3/4] bg-slate-200 relative overflow-hidden">
                <Image
                  width={600}
                  height={800}
                  src={paslon.ketua.foto || "/placeholder.jpg"}
                  alt={`Paslon ${paslon.nomor_urut}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay Gradient Halus untuk Tagline */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                  <p className="text-white font-medium italic text-center text-lg leading-snug">
                    `{paslon.tagline}`
                  </p>
                </div>
              </div>

              {/* Info Paslon */}
              <div className="p-6 flex-grow flex flex-col items-center justify-center text-center bg-white relative z-20">
                {/* Garis dekorasi kecil */}
                <div className="w-12 h-1 bg-indigo-500 rounded-full mb-5"></div>

                <h3 className="text-2xl font-bold text-slate-900 leading-tight">
                  {paslon.ketua.nama}
                </h3>
                <span className="text-slate-400 text-sm font-medium my-1">
                  &
                </span>
                <h3 className="text-xl font-bold text-slate-700 leading-tight">
                  {paslon.wakil.nama}
                </h3>
              </div>

              {/* Button Pilih yang Baru */}
              <div className="p-6 pt-0 mt-auto bg-white relative z-20">
                <button
                  onClick={() => handleVoteClick(paslon)}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg focus:ring-4 focus:ring-indigo-200 active:scale-[0.98]"
                >
                  PILIH KANDIDAT INI
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- MODAL CONFIRMATION (UI DI PERCANTIK) --- */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header Modal Lebih Soft */}
            <div className="bg-indigo-50 p-6 flex items-start gap-4">
              <div className="bg-indigo-100 p-2 rounded-full shrink-0">
                <Vote className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-indigo-900">
                  Konfirmasi Pilihan Anda
                </h3>
                <p className="text-sm text-indigo-700/80 mt-1 leading-relaxed">
                  Anda akan memberikan suara untuk{" "}
                  <span className="font-semibold">
                    Paslon No. {selectedCandidate.nomor_urut}
                  </span>
                  . Pastikan pilihan Anda sudah benar dan pastikan anda telah memeriksa informasi mengenai paslon sebelum melanjutkan, karena setelah dikonfirmasi, suara Anda tidak dapat diubah.
                </p>
              </div>
            </div>

            <div className="p-8 text-center">
              <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-3">
                Kandidat Pilihan:
              </p>
              <h4 className="text-3xl font-extrabold text-slate-900 leading-tight mb-1">
                {selectedCandidate.ketua.nama}
              </h4>
              <p className="text-xl text-slate-600 font-medium">
                & {selectedCandidate.wakil.nama}
              </p>
            </div>

            <div className="p-6 pt-0 flex gap-4">
              <button
                onClick={() => setSelectedCandidate(null)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3.5 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                onClick={confirmVote}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Memproses...
                  </span>
                ) : (
                  "Ya, Saya Yakin"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
