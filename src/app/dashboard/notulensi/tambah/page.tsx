"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Page() {
  const router = useRouter();
  const { data: session } = useSession();

  const [kategori, setKategori] = useState<"acara" | "pertemuan">("acara");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [judul, setJudul] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [isi, setIsi] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`/dashboard/api/${kategori}`);
        const json = await res.json();
        if (json.success) {
          setItems(json.data);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error(err);
        setItems([]);
      }
    };
    fetchItems();
  }, [kategori]);

  useEffect(() => {
    const item = items.find((i) => i.id === selectedId);
    if (item) {
      setJudul(item.judul || item.nama);
      setTanggal(item.tanggal);
    } else {
      setJudul("");
      setTanggal("");
    }
  }, [selectedId, items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/dashboard/api/notulensi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          judul,
          kategori,
          refId: selectedId,
          tanggal,
          isi,
          author: session?.user?.name || "Admin",
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      router.push("/dashboard/notulensi");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menyimpan notulensi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white w-full md:p-6">
      <div className="w-full flex flex-col">
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="font-bold text-2xl font-sans">Tambah Notulensi</h1>
            <span className="text-base font-normal font-sans opacity-80">
              Tambahkan notulensi baru dari Acara ataupun Pertemuan yang sudah berlangsung
            </span>
          </div>
        </div>
        <div className="w-full mt-8">
          <form onSubmit={handleSubmit} className="w-full flex flex-wrap gap-8 items-start">
            <div className="w-full md:w-72 flex flex-col gap-6">
              <div className="w-full">
                <label htmlFor="kategori" className="text-sm font-semibold">
                  Kategori
                </label>
                <select
                  id="kategori"
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value as "acara" | "pertemuan")}
                  className="w-full bg-gray-50 border-[1.5px] border-gray-300 rounded-md px-2 py-2 mt-1 focus:outline-none focus:border-indigo-500 text-sm font-medium text-gray-800"
                >
                  <option value="acara">Acara</option>
                  <option value="pertemuan">Pertemuan</option>
                </select>
              </div>
              <div className="w-full">
                <label htmlFor="item" className="text-sm font-semibold">
                  Pilih {kategori === 'acara' ? 'Acara' : 'Pertemuan'}
                </label>
                <select
                  id="item"
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full bg-gray-50 border-[1.5px] border-gray-300 rounded-md px-2 py-2 mt-1 focus:outline-none focus:border-indigo-500 text-sm font-medium text-gray-800"
                  required
                >
                  <option value="">-- Pilih --</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.judul || item.nama} ({item.tanggal})
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full">
                <label htmlFor="time" className="text-sm font-semibold">
                  Waktu
                </label>
                <input
                  disabled
                  id="time"
                  value={tanggal}
                  placeholder="DD-MM-YYYY"
                  className="w-full bg-gray-100 border-[1.5px] border-gray-300 rounded-md px-2 py-2 mt-1 focus:outline-none text-sm font-medium text-gray-600 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex-1 min-w-[300px]">
              <div className="w-full">
                <label
                  htmlFor="notulensi"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Isi Notulensi
                </label>
                <textarea
                  id="notulensi"
                  name="notulensi"
                  rows={12}
                  value={isi}
                  onChange={(e) => setIsi(e.target.value)}
                  className="w-full bg-gray-50 border-[1.5px] border-gray-300 rounded-md p-3 focus:outline-none focus:border-indigo-500 text-sm font-medium text-gray-800"
                  placeholder="Tulis hasil rapat disini..."
                  required
                ></textarea>
              </div>
            </div>

            <div className="w-full flex justify-end items-center mt-2 border-t pt-6">
              <button
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition-colors disabled:opacity-50"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Menyimpan..." : "Submit Notulensi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
