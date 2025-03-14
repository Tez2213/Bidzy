"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { ProfileContent } from "./ProfileContent";
import { YourBidsContent } from "./YourBidsContent";
import { FindBidsContent } from "./FindBidsContent";
import { HistorySection } from "./HistorySection";
import PriceCalculator from "@/components/sections/PriceCalculator";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconUser,
  IconHome,
  IconChartBar,
  IconMessages,
  IconBolt,
  IconShield,
  IconUserCheck,
  IconBrain,
  IconCalculator,
  IconTrendingUp,
  IconCalendar,
  IconClock,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from 'next/image';

export function SidebarDemo({ activeLink }: { activeLink?: string }) {
  const [open, setOpen] = useState(false);
  const links = [
    { 
      label: "Home",
      href: "/home",
      icon: <IconHome className="text-zinc-300 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <IconUserBolt className="text-zinc-300 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Your Bids",
      href: "/your-bid",
      icon: <IconChartBar className="text-zinc-300 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Find Bids",
      href: "/findbid",
      icon: <IconMessages className="text-zinc-300 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "History",
      href: "/history",
      icon: <IconCalendar className="text-zinc-300 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Price Calculator",
      href: "/price-calculator",
      icon: <IconCalculator className="text-zinc-300 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Live Bid",
      href: "/livebid",
      icon: <IconClock className="text-zinc-300 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Logout",
      href: "/",
      icon: <IconArrowLeft className="text-zinc-300 h-5 w-5 flex-shrink-0" />,
    },
  ];

  return (
    <div className="flex h-screen">
      <div className="flex w-full">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10 bg-black h-full border-r border-zinc-900">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
            <div className="border-t border-zinc-900 pt-4">
              <SidebarLink
                link={{
                  label: "Profile",
                  href: "/profile",
                  icon: (
                    <div className="h-7 w-7 rounded-full bg-zinc-900 flex items-center justify-center">
                      <IconUser className="h-4 w-4 text-zinc-300" />
                    </div>
                  ),
                }}
              />
            </div>
          </SidebarBody>
        </Sidebar>
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-screen">
            {activeLink === "Profile" ? (
              <ProfileContent />
            ) : activeLink === "Your Bids" ? (
              <YourBidsContent />
            ) : activeLink === "Find Bids" ? (
              <FindBidsContent />
            ) : activeLink === "History" ? (
              <HistorySection />
            ) : activeLink === "Price Calculator" ? (
              <PriceCalculator />
            ) : (
              <Dashboard />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

const Logo = () => {
  return (
    <Link href="/" className="flex items-center gap-2 px-3">
      <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center border border-zinc-800">
        <IconBrandTabler className="h-5 w-5 text-zinc-200" />
      </div>
      <span className="font-bold text-xl text-white">Bidzy</span>
    </Link>
  );
};

const LogoIcon = () => {
  return (
    <Link href="/" className="px-3">
      <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center border border-zinc-800">
        <IconBrandTabler className="h-5 w-5 text-zinc-200" />
      </div>
    </Link>
  );
};

const Dashboard = () => {
  const stats = [
    { label: "Active Auctions", value: "2,345", change: "+12.3%", trend: "up" },
    { label: "Total Users", value: "15.4K", change: "+8.7%", trend: "up" },
    { label: "Successful Bids", value: "92%", change: "+2.1%", trend: "up" },
    { label: "Total Volume", value: "$1.2M", change: "+15.3%", trend: "up" },
  ];

  const features = [
    {
      title: "Live Bidding",
      description:
        "Participate in real-time auctions with instant updates and notifications",
      icon: <IconClock className="w-6 h-6 text-zinc-300" />,
    },
    {
      title: "Secure Payments",
      description:
        "Multiple payment options with encrypted transaction processing",
      icon: <IconShield className="w-6 h-6 text-zinc-300" />,
    },
    {
      title: "Verified Sellers",
      description:
        "All sellers are verified to ensure authentic items and reliable service",
      icon: <IconUserCheck className="w-6 h-6 text-zinc-300" />,
    },
    {
      title: "Smart Bidding",
      description:
        "Automated bidding system to help you win auctions at the best price",
      icon: <IconBrain className="w-6 h-6 text-zinc-300" />,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Logistics Manager",
      content:
        "Bidzy has transformed how we handle our shipping needs. The platform is intuitive and reliable.",
      image: "/realistic-ai-female-face-in-brown-hair_2023-03-30-103218_pqpn.webp",
    },
    {
      name: "Michael Chen",
      role: "Freight Carrier",
      content:
        "The best logistics platform I've used. Secure, fast, and professional service.",
      image: "/original.webp",
    },
    {
      name: "John Wilson",
      role: "Supply Chain Director",
      content:
        "Love the real-time bidding feature. It makes the whole process transparent and cost-effective.",
      image: "/positive-pleased-male-with-curly-hair_176532-8136.webp",
    },
  ];

  const auctions = [
    {
      id: 1,
      title: "Electronics Shipment - LA to NYC",
      currentBid: "$2,500",
      timeLeft: "8h 15m",
      image: "/61s2jZwZIQL._AC_SX679_.jpg"
    },
    {
      id: 2,
      title: "Furniture Transport - 3 Tons",
      currentBid: "$1,800",
      timeLeft: "24h 45m",
      image: "/61zYrox-H4L._AC_SX679_.jpg"
    },
    {
      id: 3,
      title: "Retail Goods - Express Delivery",
      currentBid: "$950",
      timeLeft: "16h 20m",
      image: "/71eacOTRB-L.webp"
    }
  ];

  // Sample data for bid trend charts
  const bidTrendData = [
    { month: "Jan", avgBid: 850, bidCount: 120 },
    { month: "Feb", avgBid: 940, bidCount: 132 },
    { month: "Mar", avgBid: 1120, bidCount: 145 },
    { month: "Apr", avgBid: 990, bidCount: 160 },
    { month: "May", avgBid: 1050, bidCount: 175 },
    { month: "Jun", avgBid: 1250, bidCount: 190 },
    { month: "Jul", avgBid: 1400, bidCount: 210 },
  ];

  // Price decline data for specific auctions
  const priceDeclineData = [
    { day: "Day 1", price: 2500 },
    { day: "Day 2", price: 2350 },
    { day: "Day 3", price: 2200 },
    { day: "Day 4", price: 2100 },
    { day: "Day 5", price: 1950 },
    { day: "Day 6", price: 1800 },
    { day: "Day 7", price: 1650 },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-black min-h-screen">
      {/* Hero Section - Dark theme with subtle gradient */}
      <div className="mb-10 p-6 md:p-8 rounded-xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/30 shadow-xl">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Welcome to <span className="text-zinc-300">Bidzy</span>
          </h1>
          <p className="text-zinc-300 text-lg max-w-2xl">
            Your premier destination for logistics bidding. Connect with carriers, 
            get competitive rates, and streamline your shipping process with our 
            blockchain-secured platform.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link 
              href="/findbid" 
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-medium transition-colors shadow-lg"
            >
              Browse Bids
            </Link>
            <Link 
              href="/create-bid" 
              className="px-5 py-2.5 bg-black hover:bg-zinc-900 text-white rounded-lg font-medium transition-colors border border-zinc-800"
            >
              Create Shipping Request
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid - Dark theme with consistent blacks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => (
          <div
            key={`stat-${i}`}
            className="p-6 rounded-lg bg-zinc-900 border border-zinc-800/50 shadow-md hover:shadow-lg transition-all duration-200"
          >
            <div className="text-sm font-medium text-zinc-400">
              {stat.label}
            </div>
            <div className="text-2xl font-bold text-white mt-2">
              {stat.value}
            </div>
            <div
              className={cn(
                "text-xs mt-1 flex items-center",
                stat.trend === "up" ? "text-emerald-400" : "text-red-400"
              )}
            >
              {stat.trend === "up" ? "↑" : "↓"} {stat.change} from last month
            </div>
          </div>
        ))}
      </div>

      {/* Bid Trends Chart - Dark theme */}
      <div className="mb-10 p-6 rounded-lg bg-zinc-900 border border-zinc-800/50 shadow-md">
        <h2 className="text-2xl font-bold text-white mb-6">Bid Trends</h2>
        <div className="h-80 w-full">
          <div className="relative h-64 w-full">
            <div className="absolute bottom-0 left-0 w-full h-64 flex items-end justify-between px-2">
              {bidTrendData.map((data, i) => (
                <div key={i} className="flex flex-col items-center w-1/8 group">
                  <div 
                    className="w-12 bg-zinc-800 hover:bg-zinc-700 transition-all rounded-t-sm relative"
                    style={{ height: `${data.avgBid / 15}px` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                      ${data.avgBid} - {data.bidCount} bids
                    </div>
                  </div>
                  <div className="text-xs text-zinc-400 mt-2">{data.month}</div>
                </div>
              ))}
            </div>
            <div className="absolute left-0 top-0 h-full border-l border-zinc-800"></div>
            <div className="absolute bottom-0 left-0 w-full border-b border-zinc-800"></div>
          </div>
          <div className="text-center text-sm text-zinc-400 mt-4">Average Bid Amount by Month</div>
        </div>
      </div>

      {/* Price Decline Chart - Dark theme */}
      <div className="mb-10 p-6 rounded-lg bg-zinc-900 border border-zinc-800/50 shadow-md">
        <h2 className="text-2xl font-bold text-white mb-6">Price Decline Analysis</h2>
        <div className="h-80 w-full">
          <div className="relative h-64 w-full">
            <div className="absolute top-0 left-0 w-full h-64">
              <svg className="w-full h-full" viewBox="0 0 700 300">
                <polyline
                  points="50,50 150,100 250,150 350,170 450,220 550,250 650,270"
                  fill="none"
                  stroke="#525252" 
                  strokeWidth="3"
                />
                {/* Data points */}
                {[50, 150, 250, 350, 450, 550, 650].map((x, i) => (
                  <circle
                    key={i}
                    cx={x}
                    cy={[50, 100, 150, 170, 220, 250, 270][i]}
                    r="6"
                    fill="#18181b"
                    stroke="#525252"
                    strokeWidth="2"
                  />
                ))}
              </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-full flex items-center justify-between px-2">
              {priceDeclineData.map((data, i) => (
                <div key={i} className="text-xs text-zinc-400">{data.day}</div>
              ))}
            </div>
            <div className="absolute left-0 top-0 h-full border-l border-zinc-800"></div>
            <div className="absolute bottom-0 left-0 w-full border-b border-zinc-800"></div>
          </div>
          <div className="text-center text-sm text-zinc-400 mt-4">Average Price Decline Pattern</div>
        </div>
      </div>

      {/* Featured Auctions - Dark theme */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Featured Shipping Requests</h2>
          <button className="px-4 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-sm font-medium border border-zinc-800">
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <div
              key={auction.id}
              className="group rounded-lg overflow-hidden flex flex-col bg-zinc-900 border border-zinc-800 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="h-[250px] bg-black flex items-center justify-center">
                <Image
                  src={auction.image}
                  alt={auction.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-5 flex-grow">
                <h3 className="text-white font-medium text-lg mb-2">
                  {auction.title}
                </h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-zinc-400 text-sm">
                    Current Bid: <span className="text-white font-medium">{auction.currentBid}</span>
                  </span>
                  <span className="text-zinc-400 text-sm font-medium">{auction.timeLeft} left</span>
                </div>
                <button className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded transition-colors mt-auto">
                  Place Bid
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section - Dark theme */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-6">Why Choose Bidzy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={`feature-${i}`}
              className="p-6 rounded-lg bg-zinc-900 border border-zinc-800 shadow-md hover:border-zinc-700 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center mb-4 border border-zinc-800">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-zinc-300 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials - Dark theme */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-6">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div
              key={`testimonial-${i}`}
              className="p-6 rounded-lg bg-zinc-900 border border-zinc-800 shadow-md relative"
            >
              <div className="text-zinc-700 text-4xl absolute top-4 right-4">"</div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-zinc-800">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-medium">{testimonial.name}</h3>
                  <p className="text-zinc-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-zinc-300 italic">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section - Dark theme */}
      <section className="rounded-lg bg-gradient-to-r from-black to-zinc-900 border border-zinc-800 p-8 text-center shadow-xl">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Ready to Join Our Logistics Bidding Platform?
        </h2>
        <p className="text-zinc-300 mb-6 max-w-2xl mx-auto">
          Transform your shipping experience with our secure, transparent, and efficient bidding system.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/create-bid" 
            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md font-medium transition-colors shadow-lg"
          >
            Get Started Now
          </Link>
          <Link 
            href="/about" 
            className="px-6 py-3 bg-transparent border border-zinc-700 text-white hover:bg-zinc-900 rounded-md font-medium transition-colors"
          >
            Learn More
          </Link>
        </div>
      </section>
    </div>
  );
};

export default SidebarDemo;