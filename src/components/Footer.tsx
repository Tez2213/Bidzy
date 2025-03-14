"use client";

import React from "react";
import Link from "next/link";
import {
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="relative w-full bg-black text-white overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid-white bg-grid opacity-5 pointer-events-none"></div>

      {/* Gradient top border */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-8 h-8 rounded-full flex items-center justify-center">
                <span className="font-bold text-white">B</span>
              </div>
              <h3 className="text-xl font-bold">Bidzy</h3>
            </div>
            <p className="text-neutral-400 text-sm max-w-xs">
              Transforming the way you bid on products with our real-time smart
              bidding platform. Get the best deals every time.
            </p>
            <div className="flex space-x-4 pt-2">
              <SocialIcon
                icon={<Twitter size={18} />}
                href="https://twitter.com"
              />
              <SocialIcon
                icon={<Facebook size={18} />}
                href="https://facebook.com"
              />
              <SocialIcon
                icon={<Instagram size={18} />}
                href="https://instagram.com"
              />
              <SocialIcon
                icon={<Linkedin size={18} />}
                href="https://linkedin.com"
              />
              <SocialIcon
                icon={<Github size={18} />}
                href="https://github.com"
              />
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/how-it-works">How It Works</FooterLink>
              <FooterLink href="/pricing">Pricing</FooterLink>
              <FooterLink href="/testimonials">Testimonials</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2">
              <FooterLink href="/help">Help Center</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin
                  size={18}
                  className="text-neutral-400 mt-0.5 shrink-0"
                />
                <span className="text-neutral-400 text-sm">
                  123 Auction Street, Bidding City, BC 12345
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-neutral-400 shrink-0" />
                <span className="text-neutral-400 text-sm">
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-neutral-400 shrink-0" />
                <span className="text-neutral-400 text-sm">
                  contact@bidzy.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-neutral-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">
                Subscribe to our newsletter
              </h3>
              <p className="text-neutral-400 text-sm">
                Stay updated with our latest features and releases.
              </p>
            </div>
            <div>
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-md transition-colors duration-200 text-sm font-medium"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm">
            © {new Date().getFullYear()} Bidzy. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/terms"
              className="text-neutral-400 hover:text-white text-sm transition-colors duration-200"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-neutral-400 hover:text-white text-sm transition-colors duration-200"
            >
              Privacy
            </Link>
            <Link
              href="/cookies"
              className="text-neutral-400 hover:text-white text-sm transition-colors duration-200"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>

      {/* Gradient glow effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-1 rounded-full bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-sm"></div>
    </footer>
  );
}

// Helper component for social icons
function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 rounded-full flex items-center justify-center bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors duration-200"
    >
      {icon}
    </a>
  );
}

// Helper component for footer links
function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-neutral-400 hover:text-white transition-colors duration-200 text-sm inline-block"
      >
        {children}
      </Link>
    </li>
  );
}
