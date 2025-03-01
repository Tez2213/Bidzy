// src/components/ClientLiveBid.tsx
"use client";

import dynamic from 'next/dynamic';

const LiveBidComponent = dynamic(
  () => import('@/components/sections/LiveBidComponent'),
  { ssr: false }
);

export default function ClientLiveBid({ bidData }: { bidData: any }) {
  return <LiveBidComponent bidData={bidData} />;
}