import { inter } from "../../fonts";

export default function Page() {
  return (
    <div className="">
      <TableAnggota />
    </div>
  );
}

const TableAnggota = () => {
  return (
    <div
      className={`shadow-md rounded-md sm:rounded-lg overflow-hidden h-screen bg-white ${inter.className}`}
    >
      <div className="p-5 text-lg text-left rtl:text-right text-gray-900 font-bold flex justify-between items-end gap-4 bg-white">
        <div>
          Daftar Anggota
          <p className="font-normal mt-1 text-xs sm:text-sm text-gray-500 ">
            Daftar anggota HIMSI UBSI KLA satu priode, data ini akan di
            riset ketika masa priode tersebut habis atau berganti ke
            priode yang baru.
          </p>
        </div>
      </div>
      <div className="relative overflow-x-auto mt-4 bg-white">
        <table className="w-full h-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 mt-10 overflow-x-auto">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nama
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Nim
              </th>
              <th scope="col" className="px-6 py-3">
                No telepon
              </th>
              <th scope="col" className="px-6 py-3">
                Divisi
              </th>
              <th scope="col" className="px-6 py-3">
                Jabatan
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="md:max-h-[50vh] overflow-y-auto ">
            <tr className="bg-white border-b   border-gray-200">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
              >
                Lorem, ipsum dolor.
              </th>
              <td className="px-6 py-4">Lorem, ipsum dolor.</td>
              <td className="px-6 py-4">19230802</td>
              <td className="px-6 py-4">085848773284</td>
              <td className="px-6 py-4">Pendidikan</td>
              <td className="px-6 py-4">Koordinator</td>
              <td className="px-6 py-4 text-right">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Edit
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
