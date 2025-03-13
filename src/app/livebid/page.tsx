"use client";

import { useEffect, useState } from 'react';
import { EnhancedLiveBidComponent } from "@/components/sections/EnhancedLiveBidComponent";
import { getSocketConnectionStatus } from "@/lib/socket/socketClient";
import Link from 'next/link';
import Head from 'next/head';

export default function LiveBidPage() {
  const [connectionStatus, setConnectionStatus] = useState<string>('checking');
  // Use a fixed auctionId for testing
  const auctionId = "bidzy-demo-auction";
  
  // Check connection status on the client side only
  useEffect(() => {
    const checkConnection = () => {
      setConnectionStatus(getSocketConnectionStatus());
    };
    
    checkConnection();
    const interval = setInterval(checkConnection, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen bg-zinc-900">
      <Head>
        <title>Live Bidding | Bidzy</title>
        <meta name="description" content="Join live auctions and place real-time bids with Bidzy" />
        <meta property="og:title" content="Live Bidding | Bidzy" />
        <meta property="og:description" content="Join live auctions and place real-time bids" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bidzyy.vercel.app/livebid" />
      </Head>
      {/* Connection status indicator */}
      <div className={`fixed top-4 right-4 px-3 py-1 rounded-full text-xs flex items-center gap-1.5 z-50 ${
        connectionStatus === 'connected' ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/50' :
        connectionStatus === 'checking' ? 'bg-amber-900/80 text-amber-300 border border-amber-700/50' :
        'bg-red-900/80 text-red-300 border border-red-700/50'
      }`}>
        <div className={`w-2 h-2 rounded-full ${
          connectionStatus === 'connected' ? 'bg-emerald-400' :
          connectionStatus === 'checking' ? 'bg-amber-400' :
          'bg-red-400'
        }`}></div>
        {connectionStatus === 'connected' ? 'Socket Connected' :
         connectionStatus === 'checking' ? 'Connecting...' :
         'Socket Disconnected'}
      </div>
      
      <EnhancedLiveBidComponent 
        auctionId={auctionId}
        initialTimeRemaining={1800}
        startingBid={1000}
        minimumDecrement={10}
        currentUserId="demo-user-123"
        currentUsername="Demo User"
      />
      
      {/* Back to home link */}
      <div className="fixed bottom-4 left-4">
        <Link href="/" className="text-zinc-400 hover:text-zinc-200 text-sm flex items-center gap-1">
          ← Back to Home
        </Link>
      </div>

      <SocketDebugger />
    </div>
  );
}

function SocketDebugger() {
  const [showDetails, setShowDetails] = useState(false);
  const [serverUrl, setServerUrl] = useState('');
  
  useEffect(() => {
    setServerUrl(process.env.NEXT_PUBLIC_SOCKET_URL || 'Not set');
  }, []);

  if (process.env.NODE_ENV === 'production') return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-zinc-800/90 p-3 rounded-lg border border-zinc-700 text-xs z-50">
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-semibold">Socket Debug</h4>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="text-zinc-400 hover:text-zinc-200"
        >
          {showDetails ? '▲' : '▼'}
        </button>
      </div>
      
      {showDetails && (
        <>
          <div className="mb-1">
            <span className="text-zinc-400">Socket URL:</span> 
            <span className="ml-1 text-emerald-400 break-all">{serverUrl}</span>
          </div>
          <div className="flex gap-2 mt-2">
            <button 
              onClick={() => window.location.reload()}
              className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-200 text-xs"
            >
              Refresh
            </button>
          </div>
        </>
      )}
    </div>
  );
}