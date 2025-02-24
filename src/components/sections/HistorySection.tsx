"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  type: "bid-creation" | "bid-participation";
  amount: number;
  status: "success" | "pending" | "failed";
  date: Date;
  bidTitle: string;
  paymentMethod: string;
}

const sampleTransactions: Transaction[] = [
  {
    id: "TX123456",
    type: "bid-creation",
    amount: 50,
    status: "success",
    date: new Date("2024-02-24T10:30:00"),
    bidTitle: "Vintage Rolex Watch",
    paymentMethod: "Credit Card"
  },
  {
    id: "TX123457",
    type: "bid-participation",
    amount: 25,
    status: "success",
    date: new Date("2024-02-23T15:45:00"),
    bidTitle: "Gaming Console PS5",
    paymentMethod: "PayPal"
  },
  {
    id: "TX123458",
    type: "bid-creation",
    amount: 50,
    status: "pending",
    date: new Date("2024-02-22T09:15:00"),
    bidTitle: "Antique Furniture Set",
    paymentMethod: "Credit Card"
  },
  {
    id: "TX123459",
    type: "bid-participation",
    amount: 25,
    status: "success",
    date: new Date("2024-02-21T14:20:00"),
    bidTitle: "Limited Edition Sneakers",
    paymentMethod: "PayPal"
  },
  {
    id: "TX123460",
    type: "bid-creation",
    amount: 50,
    status: "failed",
    date: new Date("2024-02-20T11:10:00"),
    bidTitle: "Rare Comic Book Collection",
    paymentMethod: "Credit Card"
  }
];

export function HistorySection() {
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    dateFrom: "",
    dateTo: ""
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredTransactions = sampleTransactions.filter(tx => {
    if (filters.type !== "all" && tx.type !== filters.type) return false;
    if (filters.status !== "all" && tx.status !== filters.status) return false;
    // Add date filtering logic if needed
    return true;
  });

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 lg:p-6 bg-neutral-900 min-h-screen"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-200">
            Transaction History
          </h1>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select 
              className={cn(
                "bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5",
                "text-sm text-neutral-200 hover:border-neutral-600 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              )}
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="all">All Types</option>
              <option value="bid-creation">Bid Creation</option>
              <option value="bid-participation">Bid Entry</option>
            </select>
            
            <select
              className={cn(
                "bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5",
                "text-sm text-neutral-200 hover:border-neutral-600 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              )}
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Total Transactions", value: filteredTransactions.length },
            { title: "Total Amount", value: `$${filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0)}` },
            { title: "Successful Transactions", value: filteredTransactions.filter(tx => tx.status === "success").length }
          ].map((card, idx) => (
            <motion.div
              key={idx}
              className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="text-sm text-neutral-400">{card.title}</p>
              <p className="text-2xl font-bold text-neutral-200 mt-1">{card.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-neutral-800/50 rounded-lg overflow-hidden border border-neutral-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="p-4 text-xs uppercase tracking-wider text-neutral-400 font-medium text-left">Date</th>
                  <th className="p-4 text-xs uppercase tracking-wider text-neutral-400 font-medium text-left">ID</th>
                  <th className="p-4 text-xs uppercase tracking-wider text-neutral-400 font-medium text-left">Type</th>
                  <th className="p-4 text-xs uppercase tracking-wider text-neutral-400 font-medium text-left">Title</th>
                  <th className="p-4 text-xs uppercase tracking-wider text-neutral-400 font-medium text-left">Amount</th>
                  <th className="p-4 text-xs uppercase tracking-wider text-neutral-400 font-medium text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((tx) => (
                  <motion.tr 
                    key={tx.id}
                    className="border-b border-neutral-700 hover:bg-neutral-700/30 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <td className="p-4 text-sm text-neutral-200">{format(tx.date, "MMM dd, yyyy")}</td>
                    <td className="p-4 text-sm font-mono text-neutral-200">{tx.id}</td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium",
                        tx.type === "bid-creation" 
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-blue-500/20 text-blue-300"
                      )}>
                        {tx.type === "bid-creation" ? "Bid Creation" : "Bid Entry"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-neutral-200">{tx.bidTitle}</td>
                    <td className="p-4 text-sm text-neutral-200">${tx.amount}</td>
                    <td className="p-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium",
                        tx.status === "success" && "bg-green-500/20 text-green-300",
                        tx.status === "pending" && "bg-yellow-500/20 text-yellow-300",
                        tx.status === "failed" && "bg-red-500/20 text-red-300"
                      )}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
          <p className="text-sm text-neutral-400 order-2 sm:order-1">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length}
          </p>
          <div className="flex gap-2 order-1 sm:order-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium",
                "bg-neutral-800 hover:bg-neutral-700 transition-colors",
                "text-neutral-200 disabled:opacity-50",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              )}
            >
              Previous
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage * itemsPerPage >= filteredTransactions.length}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium",
                "bg-neutral-800 hover:bg-neutral-700 transition-colors",
                "text-neutral-200 disabled:opacity-50",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              )}
            >
              Next
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}