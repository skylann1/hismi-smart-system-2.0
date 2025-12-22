import { NextResponse } from "next/server";
import { getData } from "@/lib/firebase/services";

interface AcaraItem {
    id: string;
    judul: string;
    tanggal: string;
    lokasi: string;
    status: string;
}

export async function GET() {
    try {
        const proker = await getData("proker");
        const kegiatan = await getData("kegiatan");
        const pertemuan = await getData("pertemuan");

        if (!proker.success || !kegiatan.success || !pertemuan.success) {
            return NextResponse.json(
                { message: "Gagal mengambil data acara.", status: false },
                { status: 404 }
            );
        }

        const combinedData = [
            ...(proker.datas || []).map((item: any) => ({ ...item, type: "proker" })),
            ...(kegiatan.datas || []).map((item: any) => ({ ...item, type: "kegiatan" })),
            ...(pertemuan.datas || []).map((item: any) => ({ ...item, type: "pertemuan" })),
        ];

        combinedData.sort((a, b) => {
            const tA = new Date(a.tanggal || a.tanggal_selesai || 0).getTime();
            const tB = new Date(b.tanggal || b.tanggal_selesai || 0).getTime();
            return tA - tB;
        });

        return NextResponse.json(
            {
                message: "Data acara berhasil diambil.",
                status: true,
                data: combinedData,
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("Error get data:", err);
        return NextResponse.json(
            { message: "Terjadi kesalahan di server.", status: false },
            { status: 500 }
        );
    }
}
