import { NextRequest, NextResponse } from "next/server";
import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";
import { app } from "@/lib/firebase/config";

const firestore = getFirestore(app);

/**
 * QR Code Attendance Scanner API
 * 
 * This endpoint handles attendance marking via QR code scanning.
 * It's a dedicated, simple endpoint that does ONE thing well.
 */
export async function POST(req: NextRequest) {
    console.log("\n=== QR SCAN ATTENDANCE REQUEST ===");

    try {
        const body = await req.json();
        const { eventId, eventType, userNim, status = "hadir" } = body;

        console.log("📥 Request Data:", { eventId, eventType, userNim, status });

        // Validate required parameters
        if (!eventId || !eventType || !userNim) {
            console.log("❌ Missing required parameters");
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing required fields: eventId, eventType, and userNim are required"
                },
                { status: 400 }
            );
        }

        // Validate event type
        const validEventTypes = ["pertemuan", "kegiatan", "proker"];
        if (!validEventTypes.includes(eventType)) {
            console.log("❌ Invalid event type:", eventType);
            return NextResponse.json(
                {
                    success: false,
                    message: `Invalid event type. Must be one of: ${validEventTypes.join(", ")}`
                },
                { status: 400 }
            );
        }

        // Step 1: Get all attendance records for this event
        const absenCollectionPath = `${eventType}/${eventId}/absen`;
        console.log("📂 Querying collection:", absenCollectionPath);

        const absenSnapshot = await getDocs(collection(firestore, eventType, eventId, "absen"));
        console.log(`📊 Found ${absenSnapshot.docs.length} attendance records`);

        // Step 2: Find the user by NIM
        const userDoc = absenSnapshot.docs.find(doc => {
            const data = doc.data();
            return data.nim === userNim;
        });

        if (!userDoc) {
            console.log("❌ User not found with NIM:", userNim);
            console.log("Available NIMs:", absenSnapshot.docs.map(d => d.data().nim).join(", "));

            return NextResponse.json(
                {
                    success: false,
                    message: `Anggota dengan NIM ${userNim} tidak terdaftar pada acara ini`
                },
                { status: 404 }
            );
        }

        const userId = userDoc.id;
        const userData = userDoc.data();

        console.log("✅ User found:", {
            userId,
            nama: userData.nama,
            nim: userData.nim,
            currentStatus: userData.status
        });

        // Step 3: Update attendance status
        const userDocPath = `${eventType}/${eventId}/absen/${userId}`;
        const userDocRef = doc(firestore, eventType, eventId, "absen", userId);

        console.log("📝 Updating document:", userDocPath);
        console.log("📝 New status:", status);

        await setDoc(
            userDocRef,
            {
                status: status,
                updatedAt: new Date(),
            },
            { merge: true }
        );

        console.log("✅ Status updated successfully!");
        console.log("=== QR SCAN COMPLETE ===\n");

        return NextResponse.json(
            {
                success: true,
                message: "Absensi berhasil diperbarui",
                data: {
                    userId,
                    nama: userData.nama,
                    nim: userData.nim,
                    status: status,
                    divisi: userData.divisi,
                    role: userData.role,
                },
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("❌ ERROR in QR scan API:", error);
        console.error("Error details:", {
            name: error instanceof Error ? error.name : "Unknown",
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : "No stack trace"
        });
        console.log("=== QR SCAN FAILED ===\n");

        return NextResponse.json(
            {
                success: false,
                message: `Terjadi kesalahan: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
            { status: 500 }
        );
    }
}
