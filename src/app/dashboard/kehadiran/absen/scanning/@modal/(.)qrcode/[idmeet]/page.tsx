/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ModalSecondary from "@/components/ui/templates/modal/ModalSecondary";
import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import type { Html5Qrcode, CameraDevice } from "html5-qrcode";
import Image from "next/image";
import { FaSquarePhone } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { IoPersonCircleSharp } from "react-icons/io5";
import CardActionStatus from "@/components/ui/templates/modal/CardActionStatus";
import { useRouter } from "next/navigation";

type ScanStatus = "idle" | "starting" | "scanning" | "stopping" | "error";
interface statusAbsen {
  status: true | false;
  message: string;
}

export default function ModalScanQRCode() {
  const router = useRouter();

  const handleCLickClose = () => {
    router.back();
  }

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [onProsses, setOnProsses] = useState(false);
  const [prossesIsDone, setProssesIsDone] = useState<boolean>(false);
  const [statusAbsen, setStatusAbsen] = useState<statusAbsen>({
    status: false,
    message: "",
  });

  const [status, setStatus] = useState<ScanStatus>("idle");
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerId = "qr-reader";

  // --- Utils
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const ensureScanner = () => {
    if (!scannerRef.current && (window as any).Html5Qrcode) {
      scannerRef.current = new (window as any).Html5Qrcode(scannerId);
    }
    return scannerRef.current;
  };

  const pickBackCameraFirst = (list: CameraDevice[]) => {
    const backIdx = list.findIndex((c) =>
      /(back|rear|environment)/i.test(c.label)
    );
    return backIdx >= 0 ? list[backIdx].id : list[0]?.id ?? null;
  };

  // --- Start scanning
  const startScanning = async (cameraId: string) => {
    if (!isScriptLoaded || !(window as any).Html5Qrcode) return;
    if (!cameraId) return;

    setErrMsg(null);
    setStatus("starting");

    try {
      await new Promise((r) => setTimeout(r, 100)); // kasih jeda 100ms

      const scanner = ensureScanner();
      if (!scanner) return;

      await scanner.start(
        { deviceId: { exact: cameraId } },
        {
          fps: 10,
          qrbox: (viewfinderWidth, viewfinderHeight) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const qrboxSize = Math.floor(minEdge * 0.7);
            return { width: qrboxSize, height: qrboxSize };
          },
          aspectRatio: 1.0,
          disableFlip: true,
        },
        (decodedText: string) => {
          setScanResult(decodedText);
          stopScanning();
        },
        () => {}
      );

      setStatus("scanning");
    } catch (e) {
      console.error("Failed to start scanner:", e);
      setErrMsg(e instanceof Error ? e.message : "Gagal membuka kamera.");
      setStatus("error");
    }
  };

  // --- Stop scanning
  const stopScanning = async () => {
    if (!scannerRef.current) {
      setStatus("idle");
      return;
    }
    if (status === "stopping") return;

    setStatus("stopping");
    try {
      await scannerRef.current.stop();
      await scannerRef.current.clear();
      await sleep(200); // jeda kecil biar stream bener2 rilis
      setStatus("idle");
    } catch (e) {
      console.error("Failed to stop scanner:", e);
      setErrMsg(e instanceof Error ? e.message : "Gagal menghentikan kamera.");
      setStatus("error");
    }
  };

  // --- Switch camera
  const switchCamera = async (newCamId: string) => {
    setSelectedCamera(newCamId);
    if (status === "scanning" || status === "starting") {
      await stopScanning();
      await startScanning(newCamId);
    }
  };

  // --- Reset scan result
  const handleResetScan = async () => {
    setScanResult(null);
    setProssesIsDone(false);
    setErrMsg(null);
    if (selectedCamera) {
      if (status !== "idle") await stopScanning();
      await startScanning(selectedCamera);
    }
  };

  // --- Load cameras
  useEffect(() => {
    if (!isScriptLoaded || !(window as any).Html5Qrcode) return;

    (window as any).Html5Qrcode.getCameras()
      .then((devices: CameraDevice[]) => {
        setCameras(devices);
        setSelectedCamera((prev) => prev ?? pickBackCameraFirst(devices));
      })
      .catch((err: unknown) => {
        console.error("Camera fetch error:", err);
        setErrMsg("Tidak bisa mengambil daftar kamera.");
      });

    return () => {
      stopScanning().finally(() => {
        scannerRef.current = null;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScriptLoaded]);

  const onAbsenSubmit = () => {
    setOnProsses(true);
    setTimeout(() => {
      setOnProsses(false);
      setStatusAbsen({
        status: true,
        message: "Absen Berhasil",
      });
      setProssesIsDone(true);
    }, 2000);
  };

  return (
    <>
      <Script
        src="https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js"
        onLoad={() => setIsScriptLoaded(true)}
        strategy="lazyOnload"
      />

      <ModalSecondary handleCLickClose={handleCLickClose}>
        {prossesIsDone ? (
          <CardActionStatus
            status={true}
            onClick={handleResetScan}
            title="Hore!, absensi berhasil dilakukan."
            message="Data sudah berhasil direkam oleh sistem dan otomatis tercatat hadir."
            buttonActionTitle="Scan lagi"
          />
        ) : (
          <div className="flex flex-col gap-4 py-0 text-center">
            {!scanResult && (
              <h2 className="text-xl font-bold">Scan QR Code Anggota</h2>
            )}

            {!scanResult ? (
              <>
                {/* Select Kamera */}
                {cameras.length > 0 && (
                  <div className="flex flex-col items-center gap-2 justify-center">
                    <label className="text-sm text-gray-600">
                      Pilih Kamera
                    </label>
                    <select
                      value={selectedCamera || ""}
                      onChange={(e) => switchCamera(e.target.value)}
                      className="px-3 py-2 border rounded-md text-sx"
                      disabled={status === "starting" || status === "stopping"}
                    >
                      {cameras.map((cam) => (
                        <option key={cam.id} value={cam.id}>
                          {cam.label || `Camera ${cam.id}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex flex-col items-center">
                  {status !== "scanning" ? (
                    <button
                      onClick={() =>
                        selectedCamera && startScanning(selectedCamera)
                      }
                      disabled={
                        !selectedCamera ||
                        !isScriptLoaded ||
                        status === "starting" ||
                        status === "stopping"
                      }
                      className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                    >
                      {status === "starting" ? "Starting..." : "Start Scanning"}
                    </button>
                  ) : (
                    <button
                      onClick={stopScanning}
                      disabled={status !== "scanning"}
                      className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
                    >
                      {status === "scanning" ? "Stop Scanning" : "Stopping..."}
                    </button>
                  )}

                  <div
                    id={scannerId}
                    className="w-full h-full max-w-sm mx-auto mt-4"
                  />

                  {errMsg && (
                    <p className="text-sm text-red-600 mt-2 break-all">
                      {errMsg}
                    </p>
                  )}
                  {status === "idle" && (
                    <>
                      <p className="text-xs text-gray-500 mt-2">
                        Tekan <b>Start Scanning</b> untuk membuka kamera.
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Jika tombol start tidak bisa digunakan silahkan refresh.
                      </p>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex gap-16 justify-center items-stretch">
                <div className="flex flex-col w-72 lg:w-64 justify-start items-start gap-0">
                  <div className="w-full bg-stone-200 h-44 rounded-t-lg relative">
                    <Image
                      className="w-[60%] object-center object-cover absolute mx-auto left-0 right-0 top-11"
                      src="/assets/static-img/sahlan.jpg"
                      alt="Scan Success"
                      width={1000}
                      height={1000}
                    />
                  </div>
                  <div className="mt-16 lg-mt-10 text-start w-full">
                    <span>
                      <h3 className="text-base font-semibold text-gray-800">
                        Sahlan muzaqi
                      </h3>
                      <p className="text-xs text-gray-600">
                        koordinator divisi Pendidikan
                      </p>
                    </span>
                    <div className="grid grid-cols-[65%_35%] gap-2 w-full mt-4 text-gray-700">
                      <div className="rounded-lg border border-gray-300/80 p-1 text-center text-sm bg-red-600 text-white font-medium">
                        tidak hadir
                      </div>
                      <div className="rounded-lg border border-gray-300/80 p-1 text-center text-sm bg-green-600 text-white font-medium">
                        aktif
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-1.5">
                      <span className="text-xs text-gray-600 flex items-center gap-2 font-medium">
                        <IoPersonCircleSharp className="text-lg" />
                        19230802
                      </span>
                      <span className="text-xs text-gray-600 flex items-center gap-2 font-medium">
                        <FaSquarePhone className="text-lg" />
                        08123456789
                      </span>
                      <span className="text-xs text-gray-600 flex items-center gap-2 font-medium">
                        <IoMdMail className="text-lg" />
                        sahlan@example.com
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end lg:hidden w-full mt-12">
                    <button
                      className="px-3 py-1 bg-indigo-500 text-white rounded-md text-sm font-semibold cursor-pointer flex gap-2 items-center disabled:opacity-80"
                      onClick={onAbsenSubmit}
                      disabled={onProsses}
                    >
                      Selanjutnya
                      {onProsses && (
                        <div className="w-4 h-4 border-3 border-sky-300 border-t-transparent border-solid rounded-full animate-spin"></div>
                      )}
                    </button>
                  </div>
                </div>

                {/* section right */}
                <div className="hidden lg:flex flex-col justify-between items-start w-64 gap-6">
                  <div className="flex flex-col text-start">
                    <span className="text-lg font-semibold text-gray-800">
                      Personal Document
                    </span>
                    <p className="text-[13px] font-normal text-gray-600">
                      Informasi data anggota atau pengurus pada section kiri.
                    </p>
                  </div>
                  <div className="w-full">
                    <Image
                      className="w-full object-center object-cover "
                      src="/assets/undraw/social-bio.svg"
                      alt="Scan Success"
                      width={1000}
                      height={1000}
                    />
                  </div>
                  <div className="w-full flex items-center justify-end mt-10">
                    <button
                      className="px-3 py-1 bg-indigo-500 text-white rounded-md text-sm font-semibold cursor-pointer flex gap-2 items-center disabled:opacity-80"
                      onClick={onAbsenSubmit}
                      disabled={onProsses}
                    >
                      Selanjutnya
                      {onProsses && (
                        <div className="w-4 h-4 border-3 border-sky-300 border-t-transparent border-solid rounded-full animate-spin"></div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ModalSecondary>
    </>
  );
}
