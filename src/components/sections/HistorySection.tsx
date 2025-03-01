"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  IconCalendar,
  IconDownload,
  IconFilter,
  IconSearch,
  IconChevronDown,
  IconCreditCard,
  IconWallet,
  IconCircle,
  IconChartBar, // Add this import
  IconClock, // Add this import
} from "@tabler/icons-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";

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
    paymentMethod: "Credit Card",
  },
  {
    id: "TX123457",
    type: "bid-participation",
    amount: 25,
    status: "success",
    date: new Date("2024-02-23T15:45:00"),
    bidTitle: "Gaming Console PS5",
    paymentMethod: "PayPal",
  },
  {
    id: "TX123458",
    type: "bid-creation",
    amount: 50,
    status: "pending",
    date: new Date("2024-02-22T09:15:00"),
    bidTitle: "Antique Furniture Set",
    paymentMethod: "Credit Card",
  },
  {
    id: "TX123459",
    type: "bid-participation",
    amount: 25,
    status: "success",
    date: new Date("2024-02-21T14:20:00"),
    bidTitle: "Limited Edition Sneakers",
    paymentMethod: "PayPal",
  },
  {
    id: "TX123460",
    type: "bid-creation",
    amount: 50,
    status: "failed",
    date: new Date("2024-02-20T11:10:00"),
    bidTitle: "Rare Comic Book Collection",
    paymentMethod: "Credit Card",
  },
];

export function HistorySection() {
  const [filters, setFilters] = useState({
    type: "all",
    status: "all",
    dateRange: null,
    search: "",
    paymentMethod: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showFilters, setShowFilters] = useState(false);

  const filteredTransactions = sampleTransactions.filter((tx) => {
    if (filters.type !== "all" && tx.type !== filters.type) return false;
    if (filters.status !== "all" && tx.status !== filters.status) return false;
    // Add date filtering logic if needed
    return true;
  });

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate statistics
  const stats = {
    totalAmount: filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0),
    successfulBids: filteredTransactions.filter((tx) => tx.status === "success")
      .length,
    avgTransactionValue:
      filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0) /
        filteredTransactions.length || 0,
    pendingAmount: filteredTransactions
      .filter((tx) => tx.status === "pending")
      .reduce((sum, tx) => sum + tx.amount, 0),
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 lg:p-6 bg-gradient-to-b from-neutral-800 to-neutral-900 min-h-screen"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Enhanced Header with Search */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
              Transaction History
            </h1>
            <p className="text-neutral-400 mt-1">
              Track and manage your bidding activities
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            {/* Search Bar */}
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="pl-10 pr-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 w-full sm:w-64"
              />
            </div>

            {/* Export Button */}
            <button className="flex items-center gap-2 px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors">
              <IconDownload className="w-4 h-4" />
              <span>Export</span>
            </button>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg transition-colors",
                showFilters
                  ? "bg-blue-500 text-white"
                  : "bg-neutral-800 border border-neutral-700 text-neutral-200"
              )}
            >
              <IconFilter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Type Filter */}
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Transaction Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) =>
                    setFilters({ ...filters, type: e.target.value })
                  }
                  className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2.5 text-neutral-200"
                >
                  <option value="all">All Types</option>
                  <option value="bid-creation">Bid Creation</option>
                  <option value="bid-participation">Bid Entry</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2.5 text-neutral-200"
                >
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {/* Payment Method Filter */}
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Payment Method
                </label>
                <select
                  value={filters.paymentMethod}
                  onChange={(e) =>
                    setFilters({ ...filters, paymentMethod: e.target.value })
                  }
                  className="w-full bg-neutral-700 border border-neutral-600 rounded-lg px-4 py-2.5 text-neutral-200"
                >
                  <option value="all">All Methods</option>
                  <option value="credit-card">Credit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="crypto">Cryptocurrency</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Date Range
                </label>
                <DateRangePicker
                  onChange={(range) =>
                    setFilters({ ...filters, dateRange: range })
                  }
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Total Amount",
              value: `$${stats.totalAmount.toLocaleString()}`,
              change: "+12.5%",
              trend: "up",
              icon: <IconWallet className="w-5 h-5" />,
            },
            {
              title: "Successful Bids",
              value: stats.successfulBids,
              change: "+8.2%",
              trend: "up",
              icon: <IconChartBar className="w-5 h-5" />,
            },
            {
              title: "Avg. Transaction",
              value: `$${stats.avgTransactionValue.toFixed(2)}`,
              change: "-2.4%",
              trend: "down",
              icon: <IconChartBar className="w-5 h-5" />,
            },
            {
              title: "Pending Amount",
              value: `$${stats.pendingAmount.toLocaleString()}`,
              change: "+5.7%",
              trend: "up",
              icon: <IconClock className="w-5 h-5" />,
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              className="bg-neutral-800/50 rounded-lg p-6 border border-neutral-700"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-neutral-700/50">
                  {stat.icon}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium",
                    stat.trend === "up" ? "text-green-400" : "text-red-400"
                  )}
                >
                  {stat.change}
                </span>
              </div>
              <p className="text-sm text-neutral-400">{stat.title}</p>
              <p className="text-2xl font-bold text-neutral-200 mt-1">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Table */}
        <div className="bg-neutral-800/50 rounded-lg overflow-hidden border border-neutral-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="p-4 text-xs uppercase tracking-wider text-neutral-400 font-medium text-left">
                    Date
                  </th>
                  <th className="p-4 text-xs uppercase tracking-wider text-neutral-400 font-medium text-left">
                    ID
                  </th>
                  <th className="p-4 text-xs uppercase tracking-wider text-neutral-400 font-medium text-left">
                    Type
                  </th>
                  <th className="p-4 text-xs uppercase tracking-wider text-neutral-400 font-medium text-left">
                    Title
                  </th>
                  <th className="p-4 text-xs uppercase tracking-wider text-neutral-400 font-medium text-left">
                    Amount
                  </th>
                  <th className="p-4 text-xs uppercase tracking-wider text-neutral-400 font-medium text-left">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((tx) => (
                  <motion.tr
                    key={tx.id}
                    className="border-b border-neutral-700 hover:bg-neutral-700/30 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <td className="p-4 text-sm text-neutral-200">
                      {format(tx.date, "MMM dd, yyyy")}
                    </td>
                    <td className="p-4 text-sm font-mono text-neutral-200">
                      {tx.id}
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-medium",
                          tx.type === "bid-creation"
                            ? "bg-purple-500/20 text-purple-300"
                            : "bg-blue-500/20 text-blue-300"
                        )}
                      >
                        {tx.type === "bid-creation"
                          ? "Bid Creation"
                          : "Bid Entry"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-neutral-200">
                      {tx.bidTitle}
                    </td>
                    <td className="p-4 text-sm text-neutral-200">
                      ${tx.amount}
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-medium",
                          tx.status === "success" &&
                            "bg-green-500/20 text-green-300",
                          tx.status === "pending" &&
                            "bg-yellow-500/20 text-yellow-300",
                          tx.status === "failed" && "bg-red-500/20 text-red-300"
                        )}
                      >
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Enhanced Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
          <div className="flex items-center gap-4 order-2 sm:order-1">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-200"
            >
              <option value="5">5 per page</option>
              <option value="10">10 per page</option>
              <option value="20">20 per page</option>
              <option value="50">50 per page</option>
            </select>

            <p className="text-sm text-neutral-400">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(
                currentPage * itemsPerPage,
                filteredTransactions.length
              )}{" "}
              of {filteredTransactions.length}
            </p>
          </div>

          <div className="flex gap-2 order-1 sm:order-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={
                currentPage * itemsPerPage >= filteredTransactions.length
              }
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
