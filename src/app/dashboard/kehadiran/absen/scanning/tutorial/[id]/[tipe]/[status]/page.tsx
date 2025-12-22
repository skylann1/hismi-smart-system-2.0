"use client";

import Image from "next/image";
import { FaLongArrowAltLeft } from "react-icons/fa";
import Link from "next/link";
import { useParams } from "next/navigation";
import ModalSecondary from "@/components/ui/templates/modal/ModalSecondary";
import { redirect } from "next/navigation";
import { RiAlarmWarningFill } from "react-icons/ri";

export default function Page() {
  // const { id } = use(params);
  const { id, tipe, status } = useParams();
  console.log(status, tipe, id);

  const handleRedirect = () => {
    if (status !== "Ongoing") {
      redirect("/dashboard/kehadiran/absen");
    }
  };
  return (
    <>
      {status !== "Ongoing" ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 overflow-hidden">
          <div className="bg-gray-200/90 p-2 rounded-lg">
          <div className="bg-white p-6 flex flex-col items-center justify-center relative md:max-w-96 rounded-lg">
            <RiAlarmWarningFill className="text-5xl text-red-600/70"/>
            <div className="flex flex-col items-center mt-6">
              <h1 className="text-lg font-bold">Oops!</h1>
              <p className="text-[13px] font-semibold opacity-80 text-center">Event tidak sedang berlangsung, kamu hanya dapat mengakses fitur scan QR Code untuk absensi ketika event sedang berlangsung. Jika ada kesalahan input absensi silahkan gunakan absensi manual dan jika ada kendala teknis silahkan hubungi divisi pendidikan.</p>
            </div>
            <div className="mt-6 w-full flex justify-end">
              <button
                onClick={handleRedirect}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer"
              >
                Kembali
              </button>
            </div>
          </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-white p-4 sm:p-8 py-6">
          <div className="mx-auto max-w-6xl">
            <div className="w-full flex justify-center items-center flex-col gap-3">
              <span className="bg-primary px-3 py-1 rounded-2xl uppercase text-white font-bold text-sm">
                Cara menggunakan
              </span>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
                Fitur scan QR Code untuk absensi
              </h1>
              <span className="text-font-normal text-gray-600 text-base">
                berikut langkah - langkah untuk membuka / menggunakan fitur ini
              </span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
              <div className="p-4 gap-4 flex flex-col items-start bg-gray-100 rounded-lg">
                <div className="flex flex-col">
                  <h1 className="text-5xl font-bold text-blue-900">#1</h1>
                  <span className="text-lg font-bold text-blue-900">
                    Click start camera
                  </span>
                </div>
                <div className="h-[1px] bg-black/30 w-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  Klik tombol <span> Start camera</span> untuk menyalakan kamera
                  di perangkatmu. Setelah kamera aktif, kamu bisa langsung
                  mengarahkan ke objek atau QR Code yang ingin dipindai agar
                  sistem bisa mengenalinya secara otomatis dengan cepat dan
                  mudah.
                </span>
              </div>

              <div className="p-4 gap-4 flex flex-col items-start bg-gray-100 rounded-lg">
                <div className="flex flex-col">
                  <h1 className="text-5xl font-bold text-blue-900">#2</h1>
                  <span className="text-lg font-bold text-blue-900">
                    Akses camera browser
                  </span>
                </div>
                <div className="h-[1px] bg-black/30 w-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  Akses terhadap camera, pastikan device kamu memberikan izin
                  browser / chrome untuk mengakses kamera.
                </span>
              </div>

              <div className="p-4 gap-4 flex flex-col items-start bg-gray-100 rounded-lg">
                <div className="flex flex-col">
                  <h1 className="text-5xl font-bold text-blue-900">#3</h1>
                  <span className="text-lg font-bold text-blue-900">
                    Pastikan QR terbaca
                  </span>
                </div>
                <div className="h-[1px] bg-black/30 w-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  Pastikan camera membaca QR dengan memperhatikan cahaya dan
                  blur pada camera, gunakan pencahayaan yang cukup dan hindari
                  gerakan yang terlalu cepat.
                </span>
              </div>
            </div>

            <div className="mt-16 w-full grid grid-cols-1 lg:grid-cols-[50%_50%] lg:justify-between gap-y-6">
              <div className="flex flex-col items-start gap-2">
                <h2 className="font-bold text-3xl text-gray-800">Next steps</h2>
                <span className="text-base font-normal text-gray-600">
                  Sebelum memulai scan QR, pastikan tahap di atas berhasil dan
                  selanjutnya scan QR code yang ada pada belakang ID card. Jika
                  QR code terdeteksi sistem akan memunculkan data anggota, click
                  tombol{" "}
                  <span className="font-semibold text-gray-800">
                    selanjutnya
                  </span>{" "}
                  dan anggota akan otomatis tercatat hadir.
                </span>
                <div className="mt-8 flex items-center justify-between w-full">
                  <Link
                    href={`/dashboard/kehadiran/absen/scanning/qrcode/${id}`}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer"
                  >
                    Start scan
                  </Link>
                  <FaLongArrowAltLeft className="text-blue-600 text-4xl" />
                </div>
              </div>
              <div className="lg:flex justify-end hidden">
                <Image
                  src="/assets/undraw/undraw_sentiment-analysis_rke9.svg" // Ganti dengan ilustrasi yang relevan
                  height={5000}
                  width={5000}
                  alt="finance illustration"
                  className="w-1/2 lg:w-[70%] max-w-sm mx-auto lg:mx-0 object-center object-cover"
                />
              </div>
            </div>

            {/* <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <div
                id="qr-reader"
                className="w-full overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-white p-4 shadow-sm"
              >
                {!isScannerReady && (
                  <p className="text-center text-gray-500">Memuat kamera...</p>
                )}
              </div>
            </div>
          </div> */}
          </div>
        </div>
      )}
    </>
  );
}
