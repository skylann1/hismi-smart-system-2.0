"use client";

import React, { useMemo } from "react";
import currency from "currency.js";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { TooltipProps } from "recharts";
import {
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface Transaction {
  month: string;
  income: number;
  expense: number;
}

interface ChartData extends Transaction {
  net: number;
}

const DUMMY_TRANSACTIONS: Transaction[] = [
  { month: "Jan", income: 5000000, expense: 2000000 },
  { month: "Feb", income: 4500000, expense: 2500000 },
  { month: "Mar", income: 7000000, expense: 3000000 },
  { month: "Apr", income: 8000000, expense: 3500000 },
  { month: "May", income: 6000000, expense: 2800000 },
  { month: "Jun", income: 7500000, expense: 3200000 },
];

// --- UTILITY FUNCTION ---
const formatIDR = (value: number): string =>
  currency(value, { symbol: "Rp ", precision: 0, separator: "." }).format();

// --- REUSABLE COMPONENTS ---

// StatCard Component
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
}

function StatCard({ title, value, icon: Icon, colorClass }: StatCardProps) {
  return (
    <Link href={"/dashboard/keuangan/pemasukan"} className="bg-white shadow rounded-lg p-5 flex items-center space-x-4">
      <div className={`p-3 rounded-full ${colorClass}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
    </Link>
  );
}

// TransactionChart Component
interface TransactionChartProps {
  data: ChartData[];
}

function TransactionChart({ data }: TransactionChartProps) {
  // Type the props for the custom tooltip
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
          <p className="font-bold text-gray-800">{label}</p>
          {payload.map((pld) => (
            <p key={pld.dataKey} style={{ color: pld.color }}>
              {`${pld.name}: ${formatIDR(pld.value ?? 0)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 h-96">
      <h3 className="font-bold text-lg mb-4 text-gray-700">Tren Bulanan</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 30, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="month" stroke="#6b7280" tick={{ fontSize: 10 }} />
          <YAxis
            tickFormatter={(value: number) =>
              `Rp${currency(value, { precision: 0 }).value / 1000000} Jt`
            }
            stroke="#6b7280"
            tick={{ fontSize: 10 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#16a34a"
            strokeWidth={2}
            name="Income"
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#dc2626"
            strokeWidth={2}
            name="Expense"
          />
          <Line
            type="monotone"
            dataKey="net"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Net"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
interface MoneyStatisticsProps {
  transactions?: Transaction[];
}

export default function MoneyStatistics({
  transactions = DUMMY_TRANSACTIONS,
}: MoneyStatisticsProps) {
  const stats = useMemo(() => {
    const totalIncome = transactions.reduce((sum, t) => sum + t.income, 0);
    const totalExpense = transactions.reduce((sum, t) => sum + t.expense, 0);
    const totalNet = totalIncome - totalExpense;
    const avgIncome =
      transactions.length > 0 ? totalIncome / transactions.length : 0;

    return { totalIncome, totalExpense, totalNet, avgIncome };
  }, [transactions]);

  const chartData = useMemo((): ChartData[] => {
    return transactions.map((t) => ({
      ...t,
      net: t.income - t.expense,
    }));
  }, [transactions]);

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-2 mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Ikhtisar Keuangan
          </h1>
          <p className="text-sm font-normal opacity-80">
            Berikut adalah ikhtisar keuangan. Anda dapat melihat statistik
            keuangan untuk setiap bulan. Hanya Akun yang terdaftar sebagai
            bendahara yang dapat mengakses statistik keuangan ini.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            title="Total Income"
            value={formatIDR(stats.totalIncome)}
            icon={ArrowUpRightIcon}
            colorClass="bg-green-500"
          />
          <StatCard
            title="Total Expense"
            value={formatIDR(stats.totalExpense)}
            icon={ArrowDownRightIcon}
            colorClass="bg-red-500"
          />
          <StatCard
            title="Net Income"
            value={formatIDR(stats.totalNet)}
            icon={BanknotesIcon}
            colorClass="bg-blue-500"
          />
        </div>
        <TransactionChart data={chartData} />
      </div>
    </div>
  );
}
