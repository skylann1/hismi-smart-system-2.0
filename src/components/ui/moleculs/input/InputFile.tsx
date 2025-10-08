// "@/components/ui/moleculs/input/InputFile.tsx"
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaUpload, FaTrash } from "react-icons/fa";

interface InputFileProps {
  label: string;
  // value bisa berupa URL gambar lama (string) atau file baru (File)
  value: File | string | null;
  onChange: (file: File | null) => void;
  name: string;
  isError?: {
    status: boolean;
    message: string;
  };
}

export default function InputFile({
  label,
  onChange,
  value,
  name,
  isError,
}: InputFileProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    if (value instanceof File) {
      // Jika value adalah file baru, buat URL preview
      objectUrl = URL.createObjectURL(value);
      setPreview(objectUrl);
    } else if (typeof value === "string" && value) {
      // Jika value adalah string (URL dari server), langsung gunakan
      setPreview(value);
    } else {
      setPreview(null);
    }

    // Cleanup function untuk mencegah memory leak
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [value]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onChange(file);
  };

  const handleRemoveFile = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex items-center gap-4">
        <div className="w-32 h-32 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border">
          {preview ? (
            <Image
              src={preview}
              alt="Preview"
              width={128}
              height={128}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="text-gray-400 flex flex-col items-center gap-2">
              <FaUpload size={24} />
              <span className="text-xs text-center">Pilih Gambar</span>
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          name={name}
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark"
          >
            Pilih File
          </button>
          {value && (
            <button
              type="button"
              onClick={handleRemoveFile}
              className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-100 rounded-lg hover:bg-red-200 flex items-center justify-center gap-2"
            >
              <FaTrash size={12} /> Hapus
            </button>
          )}
        </div>
      </div>
      <div className="text-xs font-medium text-gray-600">
        {isError?.status ? (
          <span className="text-red-600">* {isError.message}</span>
        ) : (
          "Format: .jpg, .jpeg, .png"
        )}
      </div>
    </div>
  );
}
