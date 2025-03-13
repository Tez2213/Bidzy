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
      icon: <IconHome className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <IconUserBolt className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Your Bids",
      href: "/your-bid",
      icon: <IconChartBar className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Find Bids",
      href: "/findbid",
      icon: <IconMessages className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "History",
      href: "/history",
      icon: <IconSettings className="text-white h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Price Calculator",
      href: "/price-calculator",
      icon: (
        <IconCalculator className="text-neutral-300 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "/",
      icon: (
        <IconArrowLeft className="text-white h-5 w-5 flex-shrink-0" />
      ),
    },
     {
      label: "Livebid",
      href: "/livebid",
      icon: (
        <IconArrowLeft className="text-white h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div className="flex h-screen">
      <div className="flex w-full">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10 bg-zinc-900 h-full border-r border-zinc-800">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} />
                ))}
              </div>
            </div>
            <div className="border-t border-zinc-800 pt-4">
              <SidebarLink
                link={{
                  label: "John Doe",
                  href: "/profile",
                  icon: (
                    <div className="h-7 w-7 rounded-full bg-zinc-800 flex items-center justify-center">
                      <IconUser className="h-4 w-4 text-neutral-300" />
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
      icon: <IconBolt className="w-6 h-6" />,
    },
    {
      title: "Secure Payments",
      description:
        "Multiple payment options with encrypted transaction processing",
      icon: <IconShield className="w-6 h-6" />,
    },
    {
      title: "Verified Sellers",
      description:
        "All sellers are verified to ensure authentic items and reliable service",
      icon: <IconUserCheck className="w-6 h-6" />,
    },
    {
      title: "Smart Bidding",
      description:
        "Automated bidding system to help you win auctions at the best price",
      icon: <IconBrain className="w-6 h-6" />,
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Art Collector",
      content:
        "Bidzy has transformed how I participate in auctions. The platform is intuitive and reliable.",
      image: "/realistic-ai-female-face-in-brown-hair_2023-03-30-103218_pqpn.webp",
    },
    {
      name: "Michael Chen",
      role: "Antique Dealer",
      content:
        "The best bidding platform I've used. Secure, fast, and professional service.",
      image: "/original.webp",
    },
    {
      name: "John Wilson",
      role: "Vintage Enthusiast",
      content:
        "Love the real-time bidding feature. It makes the whole process exciting and transparent.",
      image: "/positive-pleased-male-with-curly-hair_176532-8136.webp",
    },
  ];

  const auctions = [
    {
      id: 1,
      title: "Classic Car Collection",
      currentBid: "$2,500",
      timeLeft: "8h 15m",
      image: "/61s2jZwZIQL._AC_SX679_.jpg" // Add your image path here
    },
    {
      id: 2,
      title: "Vintage Piece",
      currentBid: "$1,800",
      timeLeft: "24h 45m",
      image: "/61zYrox-H4L._AC_SX679_.jpg" // Add your image path here
    },
    {
      id: 3,
      title: "Owl Records",
      currentBid: "$950",
      timeLeft: "16h 20m",
      image: "/71eacOTRB-L.webp" // Add your image path here
    }
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-zinc-900 min-h-screen">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Welcome to Bidzy
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl">
          Your premier destination for online auctions. Discover unique items,
          participate in live bidding, and join our growing community of
          collectors.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {stats.map((stat, i) => (
          <div
            key={`stat-${i}`}
            className="p-6 rounded-lg bg-zinc-800/50 border border-zinc-700/50 hover:border-zinc-600 transition-colors"
          >
            <div className="text-sm font-medium text-zinc-400">
              {stat.label}
            </div>
            <div className="text-2xl font-bold text-white mt-2">
              {stat.value}
            </div>
            <div
              className={cn(
                "text-xs mt-1",
                stat.trend === "up" ? "text-green-400" : "text-red-400"
              )}
            >
              {stat.change} from last month
            </div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Why Choose Bidzy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={`feature-${i}`}
              className="p-6 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-zinc-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Featured Auctions</h2>
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
            View All →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <div
              key={auction.id}
              className="group relative rounded-lg overflow-hidden flex flex-col"
            >
              <div className="h-[300px] bg-zinc-800 rounded-t-lg"> {/* Fixed height container */}
                <Image
                  src={auction.image}
                  alt={auction.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-contain rounded-t-lg"
                  style={{
                    backgroundColor: '#27272a', // matching bg-zinc-800
                  }}
                />
              </div>
              <div className="p-4 bg-zinc-800 rounded-b-lg"> {/* Changed to normal div instead of absolute */}
                <h3 className="text-white font-medium mb-1">
                  {auction.title}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-sm">
                    Current Bid: {auction.currentBid}
                  </span>
                  <span className="text-blue-400 text-sm">{auction.timeLeft} left</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <div
              key={`testimonial-${i}`}
              className="p-6 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
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
              <p className="text-zinc-300">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-lg bg-gradient-to-r bg-zinc-800/50 border border-zinc-700/50 p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Ready to Place Items?
        </h2>
        <p className="text-white/80 mb-6 max-w-2xl mx-auto">
          Join thousands of collectors and Sellers in our growing community.
        </p>
        <Link href="/create-bid" className="bg-black text-white px-6 py-3 rounded-lg font-medium">
          Get Started Now
        </Link>
      </section>
    </div>
  );
};

// Keep existing Logo and LogoIcon components

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20"
    >
      <IconBrandTabler className="h-5 w-5 text-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-white whitespace-pre"
      >
        Bidzy
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-white py-1 relative z-20"
    >
      <IconBrandTabler className="h-5 w-5 text-white" />
    </Link>
  );
};
