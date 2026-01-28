export interface MemberPayment {
    id?: string;
    userId: string;
    nama: string;
    nim: string;
    divisi: string;
    bulan: string; // "2025-01", "2025-02", etc (YYYY-MM format)
    jumlah: number; // 10000
    isPaid: boolean;
    paidAt?: Date;
    updatedBy?: string;
    updatedAt?: Date;
}

export interface MemberKasSummary {
    userId: string;
    nama: string;
    nim: string;
    divisi: string;
    totalPaid: number;
    totalUnpaid: number;
    monthsPaid: number;
    monthsUnpaid: number;
    debt: number;
}
