// components/TransactionsTable.tsx
"use client";

import React from 'react';
import {
  BuildingOffice2Icon,
  GlobeAltIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import Link from "next/link";


// --- TYPE DEFINITIONS ---
interface Transaction {
  id: number;
  client: {
    name: string;
    description: string;
    logo: React.ElementType; // Use React.ElementType for component icons
    logoColor: string;
  };
  datePaid: string;
  gst: number;
  amount: number;
  isRecurring?: boolean;
}

// --- DUMMY DATA ---
const transactions: Transaction[] = [
  {
    id: 1,
    client: {
      name: 'Plaid Inc',
      description: 'Financial services company',
      logo: BuildingOffice2Icon,
      logoColor: 'text-gray-800 bg-gray-100',
    },
    datePaid: '2023-11-17T00:00:00Z',
    gst: -230.00,
    amount: 2300.00,
    isRecurring: true,
  },
  {
    id: 2,
    client: {
      name: 'Plaid Inc',
      description: 'Foreign exchange company',
      logo: GlobeAltIcon,
      logoColor: 'text-cyan-600 bg-cyan-50',
    },
    datePaid: '2023-11-16T00:00:00Z',
    gst: -100.00,
    amount: 1000.00,
  },
  {
    id: 3,
    client: {
      name: 'Plaid Inc',
      description: 'Foreign exchange company',
      logo: GlobeAltIcon,
      logoColor: 'text-cyan-600 bg-cyan-50',
    },
    datePaid: '2023-11-15T00:00:00Z',
    gst: -670.00,
    amount: 6700.00,
  },
  {
    id: 4,
    client: {
      name: 'Plaid Inc',
      description: 'Financial services company',
      logo: BuildingOffice2Icon,
      logoColor: 'text-gray-800 bg-gray-100',
    },
    datePaid: '2023-11-12T00:00:00Z',
    gst: -54.00,
    amount: 549.00,
  },
];

// --- HELPER FUNCTIONS ---
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// --- MAIN COMPONENT ---
export default function SecondaryTable() {
  return (
    <div className="bg-white">
      <div className="hidden md:grid grid-cols-[minmax(0,_3fr)_repeat(4,_minmax(0,_1fr))] p-4 text-xs font-semibold text-gray-500 uppercase rounded-t-lg border border-gray-200 bg-gray-100">
        <div>Title / Type</div>
        <div className="text-left">Date Paid</div>
        <div className="text-right">GST</div>
        <div className="text-right">Amount</div>
        <div></div> {/* Empty header for actions */}
      </div>

      {/* For mobile view: display a title instead of the full header */}
      <div className="md:hidden p-4 border-b rounded-t-lg border border-gray-200 bg-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Recent</h2>
      </div>

      <div className="divide-y divide-gray-100">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="grid grid-cols-2 md:grid-cols-[minmax(0,_3fr)_repeat(4,_minmax(0,_1fr))] items-center p-4 hover:bg-gray-50 transition-colors"
          >
            {/* Client Info */}
            <div className="flex items-center gap-3 col-span-2 md:col-span-1">
              <div className={`p-2 rounded-full ${tx.client.logoColor}`}>
                <tx.client.logo className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-gray-800">{tx.client.name}</div>
                <div className="text-sm text-gray-500">{tx.client.description}</div>
              </div>
            </div>

            {/* Date Paid */}
            <div className="text-sm text-gray-600 mt-2 md:mt-0 md:text-left">
              <span className="md:hidden font-semibold">Date: </span>
              {formatDate(tx.datePaid)}
            </div>

            {/* GST */}
            <div className="text-sm text-gray-600 mt-2 md:mt-0 text-right">
              <span className="md:hidden font-semibold">GST: </span>
              {formatCurrency(tx.gst)}
            </div>

            {/* Amount */}
            <div className="text-sm font-semibold text-gray-800 mt-2 md:mt-0 text-right">
              <span className="md:hidden font-semibold">Amount: </span>
              {formatCurrency(tx.amount)}
            </div>
            
            {/* Repeat & Actions */}
            <div className="flex items-center justify-end gap-3 mt-4 md:mt-0 col-span-2 md:col-span-1">
              {tx.isRecurring && (
                <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                  Repeat
                </span>
              )}
              <Link href={`/dashboard/keuangan/pemasukan/edit/${tx.id}`} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <PencilIcon className="h-5 w-5" />
              </Link>
              <Link href={`/delete/${tx.id}`} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <TrashIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}