
interface FocusPoint {
  title: string;
  description: string;
}

export interface Member {
  name: string;
  role: string;
  imageUrl: string;
}

export interface DivisionData {
  heroImages: string[];
  focusSection: {
    title: string;
    description: string;
    points: FocusPoint[];
  };
  members: Member[];
}

export const pendidikanData: DivisionData = {
  heroImages: [
    "/assets/static-img/pendidikan/pendidikan1.jpg",
    "/assets/static-img/pendidikan/pendidikan2.jpg",
    "/assets/static-img/pendidikan/pendidikan3.jpg",
    "/assets/static-img/pendidikan/pendidikan4.jpg",
    "/assets/static-img/pendidikan/pendidikan5.JPG",
  ],

  focusSection: {
    title: "Fokus Pada Pengembangan Akademik",
    description:
      "Divisi Pendidikan HIMSI berkomitmen mendampingi mahasiswa dalam proses belajar dengan program-program yang terstruktur, menyenangkan, dan bermanfaat langsung untuk perkembangan akademik dan soft skill.",
    points: [
      {
        title: "Konsultasi Tugas Akhir Mata Kuliah",
        description:
          "Program pendampingan untuk membantu mahasiswa memahami kebutuhan tugas akhir matkul secara mendalam, mulai dari brainstorming ide, struktur, sampai penyusunan isi dan presentasi.",
      },
      {
        title: "Pendampingan Akademik",
        description:
          "Pendampingan personal dari kakak tingkat untuk adik tingkat yang butuh bimbingan belajar atau arah akademik yang lebih jelas.",
      },
      {
        title: "Kelas Belajar Bareng",
        description:
          "Program belajar intensif selama 4 bulan yang dirancang untuk mahasiswa dari berbagai semester. Setiap bulan, peserta akan mempelajari tahapan-tahapan Web Development, mulai dari dasar hingga membuat project sederhana.",
      },
    ],
  },

  members: [
    {
      name: "Muhammad Rajib",
      role: "Koordinator",
      imageUrl: "/assets/static-img/pendidikan/Rajib.JPG",
    },
    {
      name: "Siti Aminah",
      role: "Wakil Koordinator",
      imageUrl: "https://placehold.co/400x600/a2d2ff/ffffff?text=Siti",
    },
    {
      name: "Budi Santoso",
      role: "Anggota",
      imageUrl: "https://placehold.co/400x600/bde0fe/ffffff?text=Budi",
    },
    {
      name: "Citra Lestari",
      role: "Anggota",
      imageUrl: "https://placehold.co/400x600/ffafcc/ffffff?text=Citra",
    },
    {
      name: "Eko Prasetyo",
      role: "Anggota",
      imageUrl: "https://placehold.co/400x600/ffc8dd/ffffff?text=Eko",
    },
  ],
};
