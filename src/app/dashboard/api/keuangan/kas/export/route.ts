import { NextRequest, NextResponse } from "next/server";
import { getAllMembersKasSummary, getMemberPayments } from "@/lib/firebase/kasServices";
import * as XLSX from "xlsx";

// GET - Export kas data to Excel
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const type = searchParams.get("type"); // "summary" or "detail"
        const userId = searchParams.get("userId"); // for detail export

        if (type === "detail" && userId) {
            // Export detail for single user
            const result = await getMemberPayments(userId);

            if (!result.success || result.data.length === 0) {
                return NextResponse.json({
                    success: false,
                    message: "Data tidak ditemukan",
                }, { status: 404 });
            }

            const data = result.data.map((p: any, index: number) => ({
                No: index + 1,
                Nama: p.nama,
                NIM: p.nim,
                Divisi: p.divisi,
                Bulan: p.bulan,
                Jumlah: p.jumlah,
                Status: p.isPaid ? "Lunas" : "Belum Bayar",
                "Tanggal Bayar": p.paidAt ? new Date(p.paidAt).toLocaleDateString("id-ID") : "-",
            }));

            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Detail Kas");

            const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

            return new NextResponse(buffer, {
                headers: {
                    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "Content-Disposition": `attachment; filename="Kas_Detail_${result.data[0].nama}_${Date.now()}.xlsx"`,
                },
            });
        } else {
            // Export summary for all members
            const result = await getAllMembersKasSummary();

            if (!result.success) {
                return NextResponse.json({
                    success: false,
                    message: "Gagal mengambil data",
                }, { status: 500 });
            }

            const data = result.data.map((member: any, index: number) => ({
                No: index + 1,
                Nama: member.nama,
                NIM: member.nim,
                Divisi: member.divisi,
                "Bulan Lunas": member.monthsPaid,
                "Bulan Belum Bayar": member.monthsUnpaid,
                "Total Lunas": `Rp ${member.totalPaid.toLocaleString("id-ID")}`,
                "Tunggakan": `Rp ${member.debt.toLocaleString("id-ID")}`,
            }));

            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Summary Kas");

            const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

            return new NextResponse(buffer, {
                headers: {
                    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "Content-Disposition": `attachment; filename="Kas_Summary_${Date.now()}.xlsx"`,
                },
            });
        }
    } catch (error) {
        console.error("Error exporting Excel:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}
