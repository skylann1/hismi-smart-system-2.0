"use client";

export default function Page() {
  return (
    <div className="bg-white w-full md:p-6">
      <div className="w-full flex flex-col">
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="font-bold text-2xl font-sans">Tambah Notulensi</h1>
            <span className="text-base font-normal font-sans opacity-80">
              Tambahkan notulensi baru dari Acara ataupun Pertemuan yang sudah
              berlangsung
            </span>
          </div>
        </div>
        <div className="w-full mt-8">
          <form
            action=""
            className="w-full flex flex-wrap justify-around items-baseline"
          >
            <div className="w-72">
              <div className="w-full">
                <label htmlFor="kategori" className="text-sm font-semibold">
                  Kategori
                </label>
                <select
                  id="kategori"
                  className="w-full bg-gray-50 border-[1.5px] border-gray-300 rounded-md px-2 pb-2 pt-1 mt-1 focus:outline-none focus:border-gray-400 text-sm font-medium text-gray-800"
                >
                  <option defaultValue="acara">Acara</option>
                  <option defaultValue="pertemuan">Pertemuan</option>
                </select>
              </div>
              <div className="w-full mt-6">
                <label htmlFor="kategori" className="text-sm font-semibold">
                  Title
                </label>
                <select
                  id="value"
                  className="w-full bg-gray-50 border-[1.5px] border-gray-300 rounded-md px-2 pb-2 pt-1 mt-1 focus:outline-none focus:border-gray-400 text-sm font-medium text-gray-800"
                >
                  <option defaultValue="acara">Rapat bulanan oprec</option>
                  <option defaultValue="pertemuan">Pertemuan</option>
                </select>
              </div>
              <div className="w-full mt-6">
                <label htmlFor="time" className="text-sm font-semibold">
                  Waktu
                </label>
                <input
                  // disabled={true}
                  disabled
                  id="time"
                  placeholder="24-08-2005"
                  className="w-full bg-gray-50 border-[1.5px] border-gray-300 rounded-md px-2 pb-2 pt-1 mt-1 focus:outline-none focus:border-gray-400 text-sm font-medium text-gray-800 cursor-not-allowed"
                />
              </div>
            </div>
            <div className="w-[450px] ">
              <div className="w-full ">
                <label
                  htmlFor="notulensi"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Notulensi
                </label>
                <textarea
                  id="notulensi"
                  name="notulensi"
                  rows={4}
                  className="w-full bg-gray-50 border-[1.5px] border-gray-300 rounded-md px-2 pb-2 pt-1 focus:outline-none focus:border-gray-400 text-sm font-medium text-gray-800 h-52"
                  // placeholder="Write your thoughts here..."
                ></textarea>
              </div>
            </div>
            <div className="w-full flex justify-end items-center mt-8">
              <button
                className="px-4 py-2 bg-primary text-white rounded-md"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
