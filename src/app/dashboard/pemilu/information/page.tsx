"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PaslonType } from "@/types";
import {
  Target,
  ListChecks,
  Briefcase,
  Quote,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";

export default function InformationPage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<PaslonType[]>([]);
  const [loading, setLoading] = useState(true);

  // State buat Tab aktif per paslon (Key: ID Paslon, Value: string tab name)
  const [activeTabs, setActiveTabs] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/dashboard/api/pemilu/paslon");
        const json = await res.json();
        if (json.success) {
          const sorted = json.data.sort(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (a: any, b: any) => a.nomor_urut - b.nomor_urut
          );
          setCandidates(sorted);

          // Set default tab 'visi' buat semua paslon
          const initialTabs: Record<string, string> = {};
          sorted.forEach((c: PaslonType) => {
            initialTabs[c.id] = "visi";
          });
          setActiveTabs(initialTabs);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTabChange = (paslonId: string, tab: string) => {
    setActiveTabs((prev) => ({ ...prev, [paslonId]: tab }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-500">Mengambil data paslon...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <div className="mb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center text-slate-500 hover:text-indigo-600 transition mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
          </button>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Kenali Kandidat
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Pelajari visi, misi, dan program kerja unggulan dari setiap pasangan
            calon sebelum menentukan pilihan Anda.
          </p>
        </div>

        {/* LIST PASLON */}
        <div className="space-y-16">
          {candidates.map((paslon) => (
            <div
              key={paslon.id}
              className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col lg:flex-row"
            >
              {/* === KOLOM KIRI: FOTO & PROFIL === */}
              <div className="lg:w-5/12 bg-slate-900 text-white p-8 flex flex-col items-center text-center relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500 via-slate-900 to-slate-900"></div>

                <div className="relative z-10 w-full">
                  {/* Badge Nomor */}
                  <div className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-bold tracking-widest mb-8">
                    PASLON NO. {paslon.nomor_urut}
                  </div>

                  <div className="flex flex-col justify-center items-center">
                    <div className="flex justify-center items-end -space-x-4 mb-6">
                      {/* KETUA */}
                      <div className="relative z-10 hover:z-30 transition-all duration-300 hover:scale-105">
                        <div className="w-32 h-40 sm:w-40 sm:h-52 bg-slate-800 rounded-2xl overflow-hidden border-4 border-slate-900 shadow-xl">
                          <Image
                            src={paslon.ketua.foto || "/placeholder.jpg"}
                            alt="Ketua"
                            width={300}
                            height={400}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="mt-3">
                          <p className="text-xs text-indigo-300 font-bold uppercase tracking-wider">
                            Calon Ketua
                          </p>
                        </div>
                      </div>

                      {/* WAKIL */}
                      <div className="relative z-20 hover:z-30 transition-all duration-300 hover:scale-105">
                        <div className="w-32 h-40 sm:w-40 sm:h-52 bg-slate-800 rounded-2xl overflow-hidden border-4 border-slate-900 shadow-xl mt-8">
                          <Image
                            src={paslon.wakil.foto || "/placeholder.jpg"}
                            alt="Wakil"
                            width={300}
                            height={400}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="mt-3">
                          <p className="text-xs text-indigo-300 font-bold uppercase tracking-wider">
                            Calon Wakil
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <p className="font-bold text-lg leading-tight">
                        {paslon.ketua.nama}
                      </p>
                      <p className="text-xs text-indigo-300 font-bold uppercase tracking-wider">
                        {" "}
                        &{" "}
                      </p>
                      <p className="font-bold text-lg leading-tight">
                        {paslon.wakil.nama}
                      </p>
                    </div>
                  </div>

                  {/* TAGLINE */}
                  <div className="mt-6 px-4">
                    <Quote className="w-8 h-8 text-indigo-500 mx-auto mb-2 opacity-50" />
                    <p className="text-xl font-medium italic text-indigo-100">
                      `{paslon.tagline}`
                    </p>
                  </div>
                </div>
              </div>

              {/* === KOLOM KANAN: DETAIL INFO (TABS) === */}
              <div className="lg:w-7/12 flex flex-col">
                {/* Tab Navigation */}
                <div className="flex border-b border-slate-100">
                  {[
                    { id: "visi", label: "Visi", icon: Target },
                    { id: "misi", label: "Misi", icon: ListChecks },
                    { id: "proker", label: "Program Kerja", icon: Briefcase },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(paslon.id, tab.id)}
                      className={`flex-1 py-4 px-2 text-sm sm:text-base font-semibold flex items-center justify-center gap-2 transition-all relative ${
                        activeTabs[paslon.id] === tab.id
                          ? "text-indigo-600 bg-indigo-50/50"
                          : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      {tab.label}
                      {/* Indikator Aktif */}
                      {activeTabs[paslon.id] === tab.id && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-8 flex-grow bg-white">
                  {activeTabs[paslon.id] === "visi" && (
                    <div className="animate-in fade-in zoom-in-95 duration-200">
                      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Target className="text-indigo-500" /> Visi Paslon
                      </h3>
                      <p className="text-slate-600 leading-relaxed whitespace-pre-line text-lg">
                        {/* FIX: Tambah || "" biar gak error kalo visi null */}
                        {paslon.visi || "-"}
                      </p>
                    </div>
                  )}

                  {activeTabs[paslon.id] === "misi" && (
                    <div className="animate-in fade-in zoom-in-95 duration-200">
                      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <ListChecks className="text-indigo-500" /> Misi Paslon
                      </h3>
                      <ul className="space-y-3">
                        {/* FIX: Tambah || "" sebelum split */}
                        {(paslon.misi || "").split("\n").map(
                          (item, idx) =>
                            item.trim() && (
                              <li
                                key={idx}
                                className="flex items-start gap-3 text-slate-600"
                              >
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold mt-0.5">
                                  {idx + 1}
                                </span>
                                <span className="leading-relaxed">{item}</span>
                              </li>
                            )
                        )}
                      </ul>
                    </div>
                  )}

                  {activeTabs[paslon.id] === "proker" && (
                    <div className="animate-in fade-in zoom-in-95 duration-200">
                      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Briefcase className="text-indigo-500" /> Program Kerja
                        Unggulan
                      </h3>
                      <div className="grid gap-3">
                        {/* FIX: Tambah || "" sebelum split */}
                        {(paslon.program_kerja || "").split("\n").map(
                          (item, idx) =>
                            item.trim() && (
                              <div
                                key={idx}
                                className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-indigo-200 transition"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                  <span className="text-slate-700 font-medium">
                                    {item}
                                  </span>
                                </div>
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Card */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => router.push("/dashboard/pemilu/votes")} // FIX: Pastikan path ini benar sesuai file vote lu
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
                  >
                    Vote Paslon No. {paslon.nomor_urut}{" "}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
