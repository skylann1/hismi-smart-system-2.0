"use client";

import { useState, useEffect } from "react";
import DashboardSection from "@/components/ui/templates/DashboardSection";
import {
    BarChart3,
    Users,
    RefreshCw,
    Clock,
    TrendingUp,
    Download
} from "lucide-react";

// Tipe Data
type SummaryType = {
    id: string;
    nomor_urut: number;
    ketua: string;
    wakil: string;
    totalSuara: number;
};

type VoteLogType = {
    id: string;
    voterEmail: string;
    votingTime: string;
};

export default function VotesMonitoringPage() {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState<SummaryType[]>([]);
    const [totalVotes, setTotalVotes] = useState(0);
    const [recentVotes, setRecentVotes] = useState<VoteLogType[]>([]);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    // Function Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/dashboard/api/pemilu/stats");
            const json = await res.json();

            if (json.success) {
                // Sort paslon by nomor urut
                const sortedSummary = json.summary.sort((a: any, b: any) => a.nomor_urut - b.nomor_urut);
                setSummary(sortedSummary);
                setTotalVotes(json.totalVotes);
                setRecentVotes(json.recentVotes);
                setLastUpdated(new Date());
            }
        } catch (error) {
            console.error("Gagal ambil data stats:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch pertama kali & Auto Refresh tiap 15 detik
    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, []);

    return (
        <DashboardSection>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Monitoring Suara (Real Count)</h1>

                {/* === HEADER CONTROLS === */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow-sm border">
                    <div>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Terakhir diperbarui: <span className="font-semibold text-gray-700">{lastUpdated ? lastUpdated.toLocaleTimeString() : "-"}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">Data diperbarui otomatis setiap 15 detik.</p>
                    </div>
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition text-sm font-semibold"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        Refresh Manual
                    </button>
                </div>

                {/* === STATS CARDS === */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Total Suara */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100 flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 text-white rounded-lg">
                            <Users className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Suara Masuk</p>
                            <h3 className="text-3xl font-bold text-gray-900">{totalVotes}</h3>
                        </div>
                    </div>

                    {/* Card 2: Partisipasi (Opsional, kalau tau total DPT bisa dihitung %) */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 flex items-center gap-4">
                        <div className="p-3 bg-green-600 text-white rounded-lg">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Status Monitoring</p>
                            <h3 className="text-lg font-bold text-green-600">LIVE ACTIVE</h3>
                        </div>
                    </div>
                </div>

                {/* === MAIN CONTENT: CHART & LOGS === */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* KOLOM KIRI (2/3): GRAFIK PASLON */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-gray-500" />
                            Perolehan Suara Paslon
                        </h3>

                        <div className="space-y-6">
                            {summary.map((paslon) => {
                                const percentage = totalVotes > 0 ? ((paslon.totalSuara / totalVotes) * 100).toFixed(1) : 0;
                                return (
                                    <div key={paslon.id} className="relative">
                                        <div className="flex justify-between items-end mb-2">
                                            <div>
                                                <span className="text-xs font-bold bg-gray-900 text-white py-1 px-2 rounded mr-2">
                                                    No. {paslon.nomor_urut}
                                                </span>
                                                <span className="font-bold text-gray-700 text-lg">{paslon.ketua} & {paslon.wakil}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-2xl font-bold text-indigo-600">{percentage}%</span>
                                                <span className="text-sm text-gray-500 ml-2">({paslon.totalSuara} Suara)</span>
                                            </div>
                                        </div>
                                        {/* Progress Bar */}
                                        <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                                            <div
                                                className="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )
                            })}

                            {summary.length === 0 && !loading && (
                                <p className="text-center text-gray-500 py-8">Belum ada data paslon.</p>
                            )}
                        </div>
                    </div>

                    {/* KOLOM KANAN (1/3): LIVE LOG */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-500" />
                            5 Aktivitas Terakhir
                        </h3>

                        <div className="space-y-4">
                            {recentVotes.map((vote, idx) => (
                                <div key={idx} className="flex items-start gap-3 border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                                    <div className="w-2 h-2 mt-2 bg-green-500 rounded-full animate-pulse shrink-0"></div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold text-gray-800 truncate">{vote.voterEmail}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(vote.votingTime).toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {recentVotes.length === 0 && !loading && (
                                <p className="text-sm text-gray-500 italic">Belum ada suara masuk.</p>
                            )}
                        </div>

                        <div className="mt-6 pt-4 border-t">
                            <a href="/dashboard/pemilu/settings" className="flex items-center justify-center gap-2 w-full py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded hover:bg-gray-200 transition">
                                <Download className="w-4 h-4" />
                                Download Full Data CSV
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardSection>
    );
}