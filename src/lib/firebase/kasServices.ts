import { getFirestore, collection, addDoc, getDocs, query, where, doc, updateDoc, setDoc } from "firebase/firestore";
import { app } from "./config";
import type { MemberPayment, MemberKasSummary } from "@/types/kas";

const firestore = getFirestore(app);
const KAS_AMOUNT = 10000; // Rp 10,000 per month

// ===================================
// MEMBER KAS TRACKING SERVICES
// ===================================

// 1. Initialize member kas records (create payment records for all months)
export async function initializeMemberKas(
    userId: string,
    nama: string,
    nim: string,
    divisi: string,
    startMonth: string // "2025-01"
) {
    try {
        const payment: Omit<MemberPayment, "id"> = {
            userId,
            nama,
            nim,
            divisi,
            bulan: startMonth,
            jumlah: KAS_AMOUNT,
            isPaid: false,
        };

        await addDoc(collection(firestore, "member_kas"), payment);

        return { success: true, message: "Member kas initialized" };
    } catch (error) {
        console.error("Error initializing member kas:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to initialize",
        };
    }
}

// 2. Update payment status
export async function updateMemberPayment(
    paymentId: string,
    isPaid: boolean,
    updatedBy: string
) {
    try {
        const paymentRef = doc(firestore, "member_kas", paymentId);

        await updateDoc(paymentRef, {
            isPaid,
            paidAt: isPaid ? new Date() : null,
            updatedBy,
            updatedAt: new Date(),
        });

        return {
            success: true,
            message: `Pembayaran berhasil ${isPaid ? "ditandai lunas" : "dibatalkan"}`,
        };
    } catch (error) {
        console.error("Error updating payment:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to update",
        };
    }
}

// 3. Get member payments by userId
export async function getMemberPayments(userId: string) {
    try {
        const q = query(
            collection(firestore, "member_kas"),
            where("userId", "==", userId)
        );

        const snapshot = await getDocs(q);

        const payments = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as MemberPayment[];

        return {
            success: true,
            data: payments,
        };
    } catch (error) {
        console.error("Error getting member payments:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to fetch",
            data: [],
        };
    }
}

// 4. Get all members kas summary
export async function getAllMembersKasSummary(): Promise<{ success: boolean; data: MemberKasSummary[] }> {
    try {
        const snapshot = await getDocs(collection(firestore, "member_kas"));

        const paymentsByUser: Record<string, MemberPayment[]> = {};

        snapshot.docs.forEach((doc) => {
            const payment = { id: doc.id, ...doc.data() } as MemberPayment;
            if (!paymentsByUser[payment.userId]) {
                paymentsByUser[payment.userId] = [];
            }
            paymentsByUser[payment.userId].push(payment);
        });

        const summaries: MemberKasSummary[] = Object.entries(paymentsByUser).map(
            ([userId, payments]) => {
                const paid = payments.filter((p) => p.isPaid);
                const unpaid = payments.filter((p) => !p.isPaid);

                return {
                    userId,
                    nama: payments[0].nama,
                    nim: payments[0].nim,
                    divisi: payments[0].divisi,
                    totalPaid: paid.reduce((sum, p) => sum + p.jumlah, 0),
                    totalUnpaid: unpaid.reduce((sum, p) => sum + p.jumlah, 0),
                    monthsPaid: paid.length,
                    monthsUnpaid: unpaid.length,
                    debt: unpaid.reduce((sum, p) => sum + p.jumlah, 0),
                };
            }
        );

        return {
            success: true,
            data: summaries.sort((a, b) => b.debt - a.debt), // Sort by debt descending
        };
    } catch (error) {
        console.error("Error getting kas summary:", error);
        return {
            success: false,
            data: [],
        };
    }
}

// 5. Bulk create payments for a member (for multiple months)
export async function bulkCreateMemberPayments(
    userId: string,
    nama: string,
    nim: string,
    divisi: string,
    months: string[] // ["2025-01", "2025-02", ...]
) {
    try {
        const promises = months.map((bulan) =>
            addDoc(collection(firestore, "member_kas"), {
                userId,
                nama,
                nim,
                divisi,
                bulan,
                jumlah: KAS_AMOUNT,
                isPaid: false,
            })
        );

        await Promise.all(promises);

        return {
            success: true,
            message: `${months.length} bulan kas berhasil ditambahkan`,
        };
    } catch (error) {
        console.error("Error bulk creating payments:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to create",
        };
    }
}
