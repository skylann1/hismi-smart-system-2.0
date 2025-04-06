"use client";
import { useState } from "react";

export default function Page() {
  const [divisi, setDivisi] = useState("litbang");
  const [jabatan, setJabatan] = useState("anggota");
  const [isChecked, setIsChecked] = useState(true);
  const [jk, setJk] = useState("laki-laki");
  console.log(divisi);
  console.log(jabatan);
  return (
    <div className="w-full flex justify-center py-12">
      <div className="rounded-2xl bg-white flex flex-col items-start px-6 py-12">
        <h1 className="text-xl font-bold opacity-90">Tambah user</h1>
        <form
          action=""
          className="w-full mt-6 flex flex-col lg:flex-row gap-x-16"
        >
          <div className="">
            <div className="flex flex-col w-full">
              <label htmlFor="email" className="text-sm font-medium opacity-90">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="example@gmail.com"
                className="w-[22rem] bg-gray-50 border-[1.5px] border-gray-300 rounded-md px-2 pb-2 pt-1 mt-1 focus:outline-none focus:border-gray-400 text-sm font-medium text-gray-800"
                required
              />
            </div>
            <div className="flex flex-col w-full mt-4">
              <label htmlFor="name" className="text-sm font-medium opacity-90">
                Nama
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="jhone doe"
                className="w-[22rem] bg-gray-50 border-[1.5px] border-gray-300 rounded-md px-2 pb-2 pt-1 mt-1 focus:outline-none focus:border-gray-400 text-sm font-medium text-gray-800"
                required
              />
            </div>
            <div className="flex flex-col w-full mt-4">
              <label htmlFor="nim" className="text-sm font-medium opacity-90">
                Nim
              </label>
              <input
                type="number"
                name="nim"
                id="nim"
                placeholder="1923****"
                className="w-[22rem] bg-gray-50 border-[1.5px] border-gray-300 rounded-md px-2 pb-2 pt-1 mt-1 focus:outline-none focus:border-gray-400 text-sm font-medium text-gray-800"
                required
              />
            </div>
            <div className="flex flex-col w-full mt-4">
              <label
                htmlFor="no_telp"
                className="text-sm font-medium opacity-90"
              >
                No Telepon
              </label>
              <input
                type="number"
                name="no_telp"
                id="no_telp"
                placeholder="0858********"
                className="w-[22rem] bg-gray-50 border-[1.5px] border-gray-300 rounded-md px-2 pb-2 pt-1 mt-1 focus:outline-none focus:border-gray-400 text-sm font-medium text-gray-800"
                required
              />
            </div>
            <div className="flex flex-col w-full mt-4">
              <label
                htmlFor="divisi"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Divisi
              </label>
              <select
                value={divisi}
                onChange={(e) => {
                  e.preventDefault();
                  const selectedDivisi = e.target.value;
                  setDivisi(selectedDivisi);
                  setJabatan(selectedDivisi === "bph" ? "ketua" : "anggota");
                }}
                id="divisi"
                className="w-[22rem] bg-gray-50 border-[1.5px] border-gray-300 rounded-md px-2 pb-2 pt-1 mt-1 focus:outline-none focus:border-gray-400 text-sm font-medium text-gray-800"
              >
                <option defaultValue="kominfo">litbang</option>
                <option defaultValue="kominfo">pendidikan</option>
                <option defaultValue="kominfo">kominfo</option>
                <option defaultValue="rsdm">rsdm</option>
                <option defaultValue="bph">bph</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex flex-col w-full">
              <label
                htmlFor="jabatan"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Jabatan
              </label>
              <select
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                id="jabatan"
                className="w-[22rem] bg-gray-50 border-[1.5px] border-gray-300 rounded-md px-2 pb-2 pt-1 mt-1 focus:outline-none focus:border-gray-400 text-sm font-medium text-gray-800"
              >
                {divisi === "bph" ? (
                  <>
                    <option defaultValue="ketua">Ketua</option>
                    <option defaultValue="wakil ketua">Wakil ketua</option>
                    <option defaultValue="bendahara">Bendahara</option>
                    <option defaultValue="sekretaris">Sekretaris</option>
                  </>
                ) : (
                  <>
                    <option defaultValue="anggota">Anggota</option>
                    <option defaultValue="wakil koordinator">
                      Wakil koordinator
                    </option>
                    <option defaultValue="koordinator">Koordinator</option>
                  </>
                )}
              </select>
            </div>
            <div className="flex flex-col w-full mt-4">
              <label
                htmlFor="jk"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Jenis kelamin
              </label>
              <select
                value={jk}
                onChange={(e) => setJk(e.target.value)}
                id="underline_select"
                className="block py-1 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-[1.5px] border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-gray-200 peer relative"
              >
                <option value="laki-laki">laki-laki</option>
                <option value="perempuan">Perempuan</option>
              </select>
            </div>
            <div className="flex flex-col w-full mt-4">
              <label
                htmlFor="status"
                className="text-sm font-medium opacity-90"
              >
                Status aktif
              </label>
              <label className="inline-flex items-center me-5 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  value="aktif"
                  className="sr-only peer"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
                <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900">
                  {isChecked ? "Aktif" : "Nonaktif"}
                </span>
              </label>
            </div>
            <div className="flex flex-col w-full mt-4">
              <label
                htmlFor="password"
                className="text-sm font-medium opacity-90"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="********"
                className="w-[22rem] bg-gray-50 border-[1.5px] border-gray-300 rounded-md px-2 pb-2 pt-1 mt-1 focus:outline-none focus:border-gray-400 text-sm font-medium text-gray-800"
                required
              />
            </div>
            <div className="flex flex-col w-full mt-4">
              <label
                htmlFor="password"
                className="text-sm font-medium opacity-90"
              >
                Confirm password
              </label>
              <input
                type="password"
                name="confirm-password"
                placeholder="********"
                id="confirm-password"
                className="w-[22rem] bg-gray-50 border-[1.5px] border-gray-300 rounded-md px-2 pb-2 pt-1 mt-1 focus:outline-none focus:border-gray-400 text-sm font-medium text-gray-800"
                required
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
