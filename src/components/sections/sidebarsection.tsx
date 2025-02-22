"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { ProfileContent } from "./ProfileContent";
import { YourBidsContent } from "./YourBidsContent"; // Add this import
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconUser,
  IconHome,
  IconChartBar,
  IconMessages,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SidebarDemo({ activeLink = "Home" }: { activeLink?: string }) {
  const [open, setOpen] = useState(false);
  const links = [
    {
      label: "Home",
      href: "/home",
      icon: <IconHome className="text-neutral-300 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <IconUserBolt className="text-neutral-300 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Your Bids",
      href: "/your-bid",
      icon: <IconChartBar className="text-neutral-300 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Find Bids",
      href: "/find-bids",
      icon: <IconMessages className="text-neutral-300 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "History",
      href: "/history",
      icon: <IconSettings className="text-neutral-300 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Logout",
      href: "/logout",
      icon: (
        <IconArrowLeft className="text-neutral-300 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div className="fixed inset-0 flex bg-black">
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
  return (
    <div className="p-4 md:p-6 lg:p-8 bg-zinc-900 min-h-screen">
      <h1 className="text-xl md:text-2xl font-bold text-white mb-6">Home</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...new Array(4)].map((_, i) => (
          <div
            key={`card-${i}`}
            className="p-4 md:p-6 rounded-lg bg-zinc-800 border border-zinc-700"
          >
            <div className="text-sm font-medium text-zinc-400">
              Card {i + 1}
            </div>
            <div className="text-lg md:text-2xl font-bold text-white mt-2">
              $1,234
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              +12.3% from last month
            </div>
          </div>
        ))}
      </div>
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
      <div className="h-5 w-6 bg-zinc-800 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
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
      <div className="h-5 w-6 bg-zinc-800 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
