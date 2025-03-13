import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface BidStats {
  totalBids: number;
  activeBids: number;
  wonBids: number;
  lastActive: string;
}

export function useUserBids() {
  const { data: session } = useSession();
  const [bidStats, setBidStats] = useState<BidStats>({
    totalBids: 0,
    activeBids: 0,
    wonBids: 0,
    lastActive: ''
  });

  useEffect(() => {
    const fetchBidStats = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/bids/stats');
          const data = await response.json();
          setBidStats(data);
        } catch (error) {
          console.error('Failed to fetch bid stats:', error);
        }
      }
    };

    fetchBidStats();
  }, [session]);

  return bidStats;
}