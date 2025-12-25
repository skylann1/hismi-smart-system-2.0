"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface CustomUser {
  id?: string;
  name?: string | null;
  email?: string | null;
}

export default function RekapAbsenPage() {
  const { data: session } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = session?.user as CustomUser;
    if (user?.id) {
      const fetchData = async () => {
        try {
          const res = await fetch(
            `/dashboard/api/rekap-absensi?userId=${user.id}`
          );
          const json = await res.json();

          if (json.success) {
            setData(json.data);
          } else {
            setData([]);
          }
        } catch {
          console.log("error fetch rekap absensi");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [session]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-500">Mengambil data rekap absensi mu...</p>
      </div>
    );

  return (
    <div className="p-6 w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Rekap Absensi Saya</h1>
        <p className="text-gray-500">
          Berikut adalah riwayat kehadiran Anda di berbagai kegiatan, proker,
          dan pertemuan.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {data.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Belum ada data absensi.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Kegiatan / Acara</th>
                  <th className="px-6 py-4">Tipe</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {item.parentJudul}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded uppercase bg-slate-100 text-slate-600">
                        {item.parentCollection}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.tanggal
                        ? new Date(item.tanggal).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                        ${item.status === "hadir"
                            ? "bg-green-100 text-green-800"
                            : item.status === "izin"
                              ? "bg-yellow-100 text-yellow-800"
                              : item.status === "sakit"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                          }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
