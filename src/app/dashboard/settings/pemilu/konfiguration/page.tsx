/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { alertIsAktif } from "@/features/alert/alertSlice";
import {
  Info,
  AlertTriangle,
  Save,
  CheckCircle,
  XCircle,
  Trash2,
  Download,       // Baru
  FileSpreadsheet // Baru
} from "lucide-react";

export default function PemiluInformationPage() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // State Config
  const [config, setConfig] = useState({
    isVotingOpen: false,
    isResultPublished: false,
  });

  // 1. Fetch Config saat Load
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch("/dashboard/api/pemilu/config");
        const json = await res.json();

        if (json.success) {
          setConfig({
            isVotingOpen: json.data.isVotingOpen,
            isResultPublished: json.data.isResultPublished,
          });
        }
      } catch (error) {
        console.error("Gagal load config", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfig();
  }, []);

  // 2. Handle Save Config
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/dashboard/api/pemilu/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      dispatch(
        alertIsAktif({
          status: true,
          title: "Berhasil",
          message: "Pengaturan pemilu berhasil disimpan.",
        })
      );
    } catch (error: any) {
      dispatch(
        alertIsAktif({
          status: true,
          title: "Gagal",
          message: error.message || "Gagal menyimpan pengaturan",
        })
      );
    } finally {
      setIsSaving(false);
    }
  };

  // 3. Handle Export CSV (BARU)
  const handleExportData = async () => {
    try {
      const res = await fetch("/dashboard/api/pemilu/export");
      const json = await res.json();

      if (!json.success) throw new Error(json.message);

      // Logic Download File di Browser
      const csvContent =
        "data:text/csv;charset=utf-8," + encodeURIComponent(json.csvData);
      const link = document.createElement("a");
      link.setAttribute("href", csvContent);
      // Nama file pake timestamp biar unik
      link.setAttribute(
        "download",
        `DPT_HIMSI_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      dispatch(
        alertIsAktif({
          status: true,
          title: "Download Berhasil",
          message: "Data pemilih berhasil diunduh.",
        })
      );
    } catch (error: any) {
      dispatch(
        alertIsAktif({
          status: true,
          title: "Gagal Export",
          message: error.message,
        })
      );
    }
  };

  // 4. Handle Reset Vote
  const handleResetVote = async () => {
    // Pengaman 1: Konfirmasi Biasa
    if (
      !window.confirm(
        "PERINGATAN: Apakah Anda yakin ingin menghapus SEMUA data suara? Tindakan ini tidak bisa dibatalkan!"
      )
    ) {
      return;
    }

    // Pengaman 2: Ketik manual
    const verification = window.prompt(
      "Ketik 'KONFIRMASI' untuk menghapus data permanen:"
    );

    if (verification !== "KONFIRMASI") {
      alert("Verifikasi salah. Batal menghapus.");
      return;
    }

    setIsResetting(true);
    try {
      const res = await fetch("/dashboard/api/pemilu/reset", {
        method: "DELETE",
      });
      const json = await res.json();

      if (!res.ok) throw new Error(json.message);

      dispatch(
        alertIsAktif({
          status: true,
          title: "Reset Berhasil",
          message: "Seluruh data suara telah dihapus bersih.",
        })
      );

      // Matikan voting otomatis kalau reset
      setConfig((prev) => ({
        ...prev,
        isVotingOpen: false,
        isResultPublished: false,
      }));
    } catch (error: any) {
      dispatch(
        alertIsAktif({
          status: true,
          title: "Gagal Reset",
          message: error.message || "Terjadi kesalahan saat reset data",
        })
      );
    } finally {
      setIsResetting(false);
    }
  };

  const ToggleSwitch = ({
    isActive,
    onClick,
    labelOn,
    labelOff,
    color = "bg-green-500",
  }: any) => (
    <div className="flex items-center justify-between mt-4">
      <div className="flex flex-col">
        <span
          className={`font-bold text-lg ${
            isActive ? "text-green-600" : "text-gray-500"
          }`}
        >
          {isActive ? labelOn : labelOff}
        </span>
        <span className="text-xs text-gray-400">
          Klik tombol di samping untuk mengubah status.
        </span>
      </div>
      <button
        onClick={onClick}
        type="button"
        className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 ${
          isActive ? color : "bg-gray-200"
        }`}
      >
        <span
          aria-hidden="true"
          className={`${isActive ? "translate-x-6" : "translate-x-0"}
                pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Info className="w-6 h-6 text-blue-600" />
          Pusat Kontrol Pemilu
        </h1>
        <p className="mt-2 text-gray-600">
          Halaman ini digunakan untuk mengontrol jalannya proses pemilihan umum.
          Pastikan Anda memahami dampak dari setiap tombol sebelum mengubah
          pengaturan.
        </p>
      </div>

      {/* CONTROL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PANEL 1: STATUS VOTING */}
        <div
          className={`p-6 rounded-lg shadow border transition-all ${
            config.isVotingOpen
              ? "bg-green-50 border-green-200"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {config.isVotingOpen ? (
                <CheckCircle className="text-green-600 w-8 h-8" />
              ) : (
                <XCircle className="text-gray-400 w-8 h-8" />
              )}
              <div>
                <h2 className="font-bold text-lg text-gray-800">
                  Sesi Pemungutan Suara
                </h2>
                <p className="text-sm text-gray-500">
                  Akses user untuk melakukan voting.
                </p>
              </div>
            </div>
          </div>

          <hr className="my-4 border-gray-200" />

          <div className="bg-white/50 p-3 rounded text-sm text-gray-600 mb-4 border">
            <ul className="list-disc pl-4 space-y-1">
              <li>
                <strong>ON:</strong> Mahasiswa BISA masuk ke bilik suara dan
                memilih kandidat.
              </li>
              <li>
                <strong>OFF:</strong> Bilik suara terkunci. Mahasiswa tidak bisa
                memilih.
              </li>
            </ul>
          </div>

          <ToggleSwitch
            isActive={config.isVotingOpen}
            onClick={() =>
              setConfig({ ...config, isVotingOpen: !config.isVotingOpen })
            }
            labelOn="Sedang Berlangsung (OPEN)"
            labelOff="Ditutup (CLOSED)"
            color="bg-green-500"
          />
        </div>

        {/* PANEL 2: PUBLISH HASIL */}
        <div
          className={`p-6 rounded-lg shadow border transition-all ${
            config.isResultPublished
              ? "bg-blue-50 border-blue-200"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {config.isResultPublished ? (
                <CheckCircle className="text-blue-600 w-8 h-8" />
              ) : (
                <AlertTriangle className="text-orange-400 w-8 h-8" />
              )}
              <div>
                <h2 className="font-bold text-lg text-gray-800">
                  Publikasi Hasil (Real Count)
                </h2>
                <p className="text-sm text-gray-500">
                  Transparansi data suara ke publik.
                </p>
              </div>
            </div>
          </div>

          <hr className="my-4 border-gray-200" />

          <div className="bg-white/50 p-3 rounded text-sm text-gray-600 mb-4 border">
            <ul className="list-disc pl-4 space-y-1">
              <li>
                <strong>ON:</strong> Grafik perolehan suara tampil di halaman
                user/landing page.
              </li>
              <li>
                <strong>OFF:</strong> Hasil suara disembunyikan (Rahasia).
              </li>
            </ul>
          </div>

          <ToggleSwitch
            isActive={config.isResultPublished}
            onClick={() =>
              setConfig({
                ...config,
                isResultPublished: !config.isResultPublished,
              })
            }
            labelOn="Ditampilkan (PUBLIC)"
            labelOff="Disembunyikan (PRIVATE)"
            color="bg-blue-500"
          />
        </div>
      </div>

      {/* WARNING AREA CONFIG */}
      {config.isVotingOpen && config.isResultPublished && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded shadow-sm flex items-start gap-3">
          <AlertTriangle className="text-orange-500 w-6 h-6 shrink-0" />
          <div>
            <h3 className="font-bold text-orange-800">
              Peringatan Konfigurasi
            </h3>
            <p className="text-sm text-orange-700">
              Anda membuka voting dan menampilkan hasil secara bersamaan.
              Biasanya hasil (Quick Count) baru ditampilkan setelah sesi voting
              ditutup untuk menghindari penggiringan opini. Pastikan ini memang
              disengaja.
            </p>
          </div>
        </div>
      )}

      {/* BUTTON SAVE CONFIG */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={isLoading || isSaving}
          className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-lg shadow hover:bg-gray-800 transition disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>

      {/* ======================================================= */}
      {/* SECTION EXPORT DATA (BARU) */}
      {/* ======================================================= */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FileSpreadsheet className="w-6 h-6 text-blue-600" />
          Laporan & Data Pemilih
        </h2>

        <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800">
              Export Daftar Hadir (Log Voting)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Unduh data mahasiswa yang telah menggunakan hak suaranya dalam
              format CSV (Excel). Data ini berisi <strong>Email</strong> dan{" "}
              <strong>Waktu Voting</strong> untuk keperluan verifikasi/LPJ.
              <br />
              <span className="text-xs text-gray-400 italic">
                *Demi kerahasiaan (Luber Jurdil), pilihan kandidat TIDAK
                disertakan dalam file ini.
              </span>
            </p>
          </div>

          <button
            onClick={handleExportData}
            className="flex items-center gap-2 bg-white border-2 border-green-600 text-green-700 px-6 py-3 rounded-lg font-bold hover:bg-green-50 transition-all shadow-sm shrink-0"
          >
            <Download className="w-5 h-5" />
            DOWNLOAD CSV
          </button>
        </div>
      </div>

      {/* ======================================================= */}
      {/* DANGER ZONE: RESET VOTE */}
      {/* ======================================================= */}
      <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-300">
        <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6" />
          Danger Zone
        </h2>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-800">
              Reset Semua Suara (Mulai Nol)
            </h3>
            <p className="text-sm text-red-700 mt-1">
              Tindakan ini akan <strong>menghapus permanen</strong> seluruh data
              suara yang masuk di database. Akun yang sudah memilih akan bisa
              memilih kembali. Gunakan fitur ini hanya untuk simulasi atau jika
              terjadi kesalahan fatal sistem.
            </p>
          </div>

          <button
            onClick={handleResetVote}
            disabled={isResetting}
            className="flex items-center gap-2 bg-white border-2 border-red-500 text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResetting ? (
              "Sedang Menghapus..."
            ) : (
              <>
                <Trash2 className="w-5 h-5" />
                RESET DATABASE
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}