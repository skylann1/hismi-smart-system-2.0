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
    role?: string;
    image?: File | null | string;
    id?: string;
    access?: string[];
    password?: string;
    imageUrl: string;
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