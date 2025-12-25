import { NextResponse } from "next/server";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "@/lib/firebase/config";

const firestore = getFirestore(app);


export async function GET() {
    try {
        const collections = ["pertemuan", "kegiatan", "proker"];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let allEvents: any[] = [];

        for (const colName of collections) {
            const snapshot = await getDocs(collection(firestore, colName));
            const docs = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    type: colName, // "pertemuan", "kegiatan", or "proker"
                };
            });
            allEvents = [...allEvents, ...docs];
        }

        // Sort by date (ascending - earliest first)
        allEvents.sort((a, b) => {
            const tA = new Date(a.tanggal || 0).getTime();
            const tB = new Date(b.tanggal || 0).getTime();
            return tA - tB;
        });

        return NextResponse.json({
            message: "Data acara berhasil diambil.",
            status: true,
            data: allEvents,
        }, { status: 200 });
    } catch (err) {
        console.error("Error get data:", err);
        return NextResponse.json(
            { message: "Terjadi kesalahan di server.", status: false },
            { status: 500 }
        );
    }
}
