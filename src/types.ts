export interface UserType {
  nama: string;
  tanggal_lahir?: string;
  email?: string;
  no_hp?: string;
  nim?: string;
  jenjang_pendidikan?: string;
  semester?: number;
  tipe_kelas: string;
  tahun_masuk?: string;
  divisi?: string;
  role?: string; // "1" | "2" | ... | "guest"
  image?: File | null | string;
  id?: string;
  access?: string[];
  password?: string;
  imageUrl: string;
  status?: string;
}

export interface PoinDivisi {
  title: string;
  description: string;
}

export interface DivisiSettingsType {
  nama?: string;
  mainTitle: string;
  secondaryTitle: string;
  mainDescription: string;
  secondaryDescription: string;
  poinDivisi: PoinDivisi[];
  images: {
    image1: string | File | null;
    image2: string | File | null;
    image3: string | File | null;
    image4: string | File | null;
    image5: string | File | null;
  };
}

interface Paragraph {
  konten: string;
}

export interface FormBlog {
  judul: string;
  author: string;
  paragraf: Paragraph[];
  kategori: string;
  tanggal: string;
  status: string;
  cover: File | null | string;
  gambar_tambahan: {
    gambar1: File | string;
    gambar2: File | string;
  };
}

export interface PertemuanFormData {
  judul: string;
  lokasi: string;
  maps: string;
  tanggal: string;
  status: "Upcoming" | "Passed" | "Ongoing";
  metode: "Offline" | "Online";
  penanggungJawab?: string;
  nomerPenanggungJawab?: string;
  jamMulai: string;
  jamSelesai: string;
}

export interface ProkerFormData {
  judul: string;
  lokasi: string;
  divisi: string;
  tanggal: string;
  status: "Upcoming" | "Passed" | "Ongoing";
  penanggung_jawab: string;
  deskripsi: string;
  maps: string;
  blogs: string;
  jamMulai: string;
  jamSelesai: string;

}

export interface KegiatanFormData {
  judul: string;
  lokasi: string;
  divisi: string;
  tanggal: string;
  maps: string;
  status: "Upcoming" | "Passed" | "Ongoing";
  deskripsi: string;
  jamMulai: string;
  jamSelesai: string;
}

export interface PaslonType {
  id: string;
  nomor_urut: number;
  tagline: string;
  visi: string;
  misi: string;
  program_kerja: string;
  ketua: {
    nama: string;
    nim: string;
    semester: string;
    foto: string; // URL dari Supabase
  };
  wakil: {
    nama: string;
    nim: string;
    semester: string;
    foto: string; // URL dari Supabase
  };
  createdAt: Date;
};


export interface NotulensiFormData {
  judul: string;
  kategori: "acara" | "pertemuan";
  refId: string; // ID dari Acara atau Pertemuan
  tanggal: string;
  isi: string;
  author: string;
}
