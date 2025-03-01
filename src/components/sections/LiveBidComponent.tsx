import React, { useState, useEffect } from 'react';

interface Bid {
  userId: string;
  username: string;
  amount: number;
  timestamp: Date;
}

interface LiveBidProps {
  auctionId: string;
  initialTimeRemaining: number; // in seconds
  startingBid: number;
  minimumIncrement: number;
}

const LiveBidComponent: React.FC<LiveBidProps> = ({
  auctionId,
  initialTimeRemaining = 3600, // 1 hour default
  startingBid = 100,
  minimumIncrement = 10
}) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(initialTimeRemaining);
  const [currentBid, setCurrentBid] = useState<number>(startingBid);
  const [bidAmount, setBidAmount] = useState<number>(startingBid + minimumIncrement);
  const [leaderboard, setLeaderboard] = useState<Bid[]>([
    { userId: "user1", username: "John Doe", amount: 120, timestamp: new Date() },
    { userId: "user2", username: "Jane Smith", amount: 110, timestamp: new Date(Date.now() - 60000) },
    { userId: "user3", username: "Bob Johnson", amount: 100, timestamp: new Date(Date.now() - 120000) }
  ]);

  // Format time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle bid submission
  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (bidAmount <= currentBid) {
      alert(`Your bid must be greater than the current bid of $${currentBid}`);
      return;
    }

    if (bidAmount < currentBid + minimumIncrement) {
      alert(`Minimum bid increment is $${minimumIncrement}`);
      return;
    }

    // In a real app, you would send the bid to your backend
    const newBid: Bid = {
      userId: "currentUser", // would be from auth context
      username: "You", // would be from auth context
      amount: bidAmount,
      timestamp: new Date()
    };

    // Update the leaderboard
    setLeaderboard([newBid, ...leaderboard].sort((a, b) => b.amount - a.amount));
    setCurrentBid(bidAmount);
    setBidAmount(bidAmount + minimumIncrement);
  };

  return (
    <div className="live-bid-container p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Live Auction</h2>
      
      {/* Timer and Countdown Section */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="text-sm text-gray-500">Current Time</div>
            <div className="text-xl font-semibold">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Time Remaining</div>
            <div className="text-xl font-semibold text-red-600">
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
      </div>

      {/* Current Bid Display */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6 text-center">
        <div className="text-sm text-gray-500">Current Bid</div>
        <div className="text-3xl font-bold text-blue-800">${currentBid.toLocaleString()}</div>
      </div>

      {/* Bid Input Section */}
      <form onSubmit={handleBidSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow">
            <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Your Bid Amount ($)
            </label>
            <input
              type="number"
              id="bidAmount"
              min={currentBid + minimumIncrement}
              step={minimumIncrement}
              value={bidAmount}
              onChange={(e) => setBidAmount(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-md hover:bg-blue-700 transition-colors self-end"
            disabled={timeRemaining === 0}
          >
            Place Bid
          </button>
        </div>
        <div className="text-sm text-gray-500 mt-2">
          Minimum bid increment: ${minimumIncrement}
        </div>
      </form>

      {/* Leaderboard Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <h3 className="font-semibold">Bid Leaderboard</h3>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bidder
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboard.map((bid, index) => (
              <tr key={index} className={bid.userId === "currentUser" ? "bg-blue-50" : ""}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bid.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                  ${bid.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bid.timestamp.toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Auction ended message */}
      {timeRemaining === 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-100 rounded-md text-center">
          <h3 className="text-lg font-semibold text-yellow-800">Auction has ended!</h3>
          <p className="text-yellow-700">
            Winning bid: ${currentBid.toLocaleString()} by {leaderboard[0].username}
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveBidComponent;