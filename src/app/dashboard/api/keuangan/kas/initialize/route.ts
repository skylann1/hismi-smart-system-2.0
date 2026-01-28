import { NextRequest, NextResponse } from "next/server";
import { getData } from "@/lib/firebase/services";
import { bulkCreateMemberPayments, getMemberPayments } from "@/lib/firebase/kasServices";

// POST - Initialize kas for all members
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { startMonth, endMonth } = body; // "2025-01", "2025-12"

        // Get all users
        const usersResult = await getData("users");

        if (!usersResult.success || !usersResult.datas) {
            return NextResponse.json({
                success: false,
                message: "Gagal mengambil data users",
            });
        }

        const users = usersResult.datas;

        // Generate months
        const generateMonths = (start: string, end: string) => {
            const months: string[] = [];
            const [startYear, startMo] = start.split("-").map(Number);
            const [endYear, endMo] = end.split("-").map(Number);

            for (let year = startYear; year <= endYear; year++) {
                const startM = year === startYear ? startMo : 1;
                const endM = year === endYear ? endMo : 12;

                for (let month = startM; month <= endM; month++) {
                    months.push(`${year}-${String(month).padStart(2, "0")}`);
                }
            }
            return months;
        };

        const allMonths = generateMonths(startMonth, endMonth);

        // Create payments for each user
        let successCount = 0;
        let errorCount = 0;
        let skipCount = 0;

        for (const user of users) {
            if (!user.id || !user.nama) continue;

            try {
                // Check existing payments for this user
                const existingResult = await getMemberPayments(user.id);
                const existingMonths = existingResult.success
                    ? existingResult.data.map((p: any) => p.bulan)
                    : [];

                // Filter out months that already exist
                const newMonths = allMonths.filter(month => !existingMonths.includes(month));

                if (newMonths.length === 0) {
                    skipCount++;
                    continue; // Skip if all months already exist
                }

                await bulkCreateMemberPayments(
                    user.id,
                    user.nama,
                    user.nim || "-",
                    user.divisi || "-",
                    newMonths
                );
                successCount++;
            } catch (error) {
                console.error(`Error for user ${user.nama}:`, error);
                errorCount++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Inisialisasi selesai! ${successCount} anggota ditambahkan, ${skipCount} dilewati (sudah ada data), ${errorCount} error`,
            data: {
                totalUsers: users.length,
                successCount,
                skipCount,
                errorCount,
                monthsRequested: allMonths.length,
            },
        });
    } catch (error) {
        console.error("Error in POST /api/keuangan/kas/initialize:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Internal server error",
            },
            { status: 500 }
        );
    }
}
