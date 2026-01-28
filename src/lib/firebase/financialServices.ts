import { getFirestore, collection, addDoc, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { app } from "./config";
import type { PaymentSubmission, FinancialTransaction } from "@/types";

const firestore = getFirestore(app);

// ===================================
// FINANCIAL MANAGEMENT SERVICES
// ===================================

// 1. Submit Payment (Member pays monthly kas)
export async function submitPayment(data: Omit<PaymentSubmission, "id" | "status" | "createdAt" | "updatedAt">) {
    try {
        // Check if payment already exists for this month/year
        const q = query(
            collection(firestore, "payments"),
            where("userId", "==", data.userId),
            where("bulan", "==", data.bulan),
            where("tahun", "==", data.tahun)
        );

        const existingPayment = await getDocs(q);

        if (!existingPayment.empty) {
            return {
                success: false,
                message: `Anda sudah melakukan pembayaran untuk bulan ${data.bulan} ${data.tahun}.`,
            };
        }

        const paymentDoc = await addDoc(collection(firestore, "payments"), {
            ...data,
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return {
            success: true,
            message: "Pembayaran berhasil disubmit. Menunggu persetujuan bendahara.",
            id: paymentDoc.id,
        };
    } catch (error) {
        console.error("Error submitting payment:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Gagal submit pembayaran",
        };
    }
}

// 2. Get Payments by User ID
export async function getPaymentsByUser(userId: string) {
    try {
        const q = query(
            collection(firestore, "payments"),
            where("userId", "==", userId)
        );

        const snapshot = await getDocs(q);

        const payments = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as PaymentSubmission[];

        return {
            success: true,
            data: payments,
        };
    } catch (error) {
        console.error("Error getting user payments:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Gagal mengambil data pembayaran",
        };
    }
}

// 3. Get All Payments (for treasurer)
export async function getAllPayments(status?: "pending" | "approved" | "rejected") {
    try {
        let q;

        if (status) {
            q = query(
                collection(firestore, "payments"),
                where("status", "==", status)
            );
        } else {
            q = query(collection(firestore, "payments"));
        }

        const snapshot = await getDocs(q);

        const payments = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as PaymentSubmission[];

        return {
            success: true,
            data: payments,
        };
    } catch (error) {
        console.error("Error getting all payments:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Gagal mengambil data pembayaran",
        };
    }
}

// 4. Update Payment Status (Approve/Reject)
export async function updatePaymentStatus(
    paymentId: string,
    status: "approved" | "rejected",
    keterangan?: string
) {
    try {
        const paymentRef = doc(firestore, "payments", paymentId);

        await updateDoc(paymentRef, {
            status,
            keterangan: keterangan || "",
            updatedAt: new Date(),
        });

        return {
            success: true,
            message: `Pembayaran berhasil ${status === "approved" ? "disetujui" : "ditolak"}.`,
        };
    } catch (error) {
        console.error("Error updating payment status:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Gagal update status pembayaran",
        };
    }
}

// 5. Add Financial Transaction
export async function addTransaction(data: Omit<FinancialTransaction, "id" | "createdAt" | "updatedAt">) {
    try {
        const transactionDoc = await addDoc(collection(firestore, "transactions"), {
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return {
            success: true,
            message: `Transaksi ${data.tipe} berhasil ditambahkan.`,
            id: transactionDoc.id,
        };
    } catch (error) {
        console.error("Error adding transaction:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Gagal menambahkan transaksi",
        };
    }
}

// 6. Get All Transactions
export async function getTransactions(tipe?: "pemasukan" | "pengeluaran") {
    try {
        let q;

        if (tipe) {
            q = query(
                collection(firestore, "transactions"),
                where("tipe", "==", tipe)
            );
        } else {
            q = query(collection(firestore, "transactions"));
        }

        const snapshot = await getDocs(q);

        const transactions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as FinancialTransaction[];

        return {
            success: true,
            data: transactions,
        };
    } catch (error) {
        console.error("Error getting transactions:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Gagal mengambil data transaksi",
        };
    }
}

// 7. Get Financial Summary
export async function getFinancialSummary() {
    try {
        // Get approved payments
        const paymentsQuery = query(
            collection(firestore, "payments"),
            where("status", "==", "approved")
        );
        const paymentsSnapshot = await getDocs(paymentsQuery);
        const totalKas = paymentsSnapshot.docs.reduce((sum, doc) => {
            const data = doc.data() as PaymentSubmission;
            return sum + data.jumlah;
        }, 0);

        // Get transactions
        const transactionsSnapshot = await getDocs(collection(firestore, "transactions"));

        let totalPemasukan = 0;
        let totalPengeluaran = 0;

        transactionsSnapshot.docs.forEach((doc) => {
            const data = doc.data() as FinancialTransaction;
            if (data.tipe === "pemasukan") {
                totalPemasukan += data.jumlah;
            } else {
                totalPengeluaran += data.jumlah;
            }
        });

        // Total income includes kas payments + other income
        const totalIncome = totalKas + totalPemasukan;
        const totalExpense = totalPengeluaran;
        const balance = totalIncome - totalExpense;

        // Get pending payment count
        const pendingQuery = query(
            collection(firestore, "payments"),
            where("status", "==", "pending")
        );
        const pendingSnapshot = await getDocs(pendingQuery);
        const pendingCount = pendingSnapshot.size;

        return {
            success: true,
            data: {
                totalKas,
                totalPemasukan,
                totalPengeluaran,
                totalIncome,
                totalExpense,
                balance,
                pendingCount,
            },
        };
    } catch (error) {
        console.error("Error getting financial summary:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Gagal mengambil ringkasan keuangan",
        };
    }
}

// 8. Get Monthly Payment Summary (for kas tracking)
export async function getMonthlyPaymentSummary(tahun: string) {
    try {
        const q = query(
            collection(firestore, "payments"),
            where("tahun", "==", tahun),
            where("status", "==", "approved")
        );

        const snapshot = await getDocs(q);

        // Group by month
        const monthlyData: Record<string, { terkumpul: number; jumlahAnggota: number }> = {};

        snapshot.docs.forEach((doc) => {
            const data = doc.data() as PaymentSubmission;
            const bulan = data.bulan;

            if (!monthlyData[bulan]) {
                monthlyData[bulan] = { terkumpul: 0, jumlahAnggota: 0 };
            }

            monthlyData[bulan].terkumpul += data.jumlah;
            monthlyData[bulan].jumlahAnggota += 1;
        });

        return {
            success: true,
            data: monthlyData,
        };
    } catch (error) {
        console.error("Error getting monthly payment summary:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Gagal mengambil ringkasan bulanan",
        };
    }
}
