import { io, Socket } from "socket.io-client";
import { Bid } from "@/components/sections/EnhancedLiveBidComponent";

interface BidEvent {
  auctionId: string;
  bid: Bid;
}

interface AuctionUpdateEvent {
  auctionId: string;
  timeRemaining: number;
  currentBid: number;
  leaderboard: Bid[];
}

interface CooldownEvent {
  auctionId: string;
  cooldownRemaining: number;
}

interface UserCountEvent {
  auctionId: string;
  activeUsers: number;
}

let socket: Socket | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// Initialize socket connection
export const initializeSocket = (userId: string, username?: string) => {
  if (socket) return socket;
  
  try {
    // Use HTTP connection first - not websocket directly
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      reconnectionDelay: 2000,
      query: { 
        userId,
        username: username || `User-${userId.slice(0, 5)}`
      },
      // Important - try polling first, then websocket
      transports: ['polling', 'websocket']
    });
    
    console.log("Initializing socket connection for user:", userId);

    socket.on("connect", () => {
      console.log("Socket connected with ID:", socket?.id);
      reconnectAttempts = 0;
    });

    socket.on("connect_error", (error) => {
      console.warn("Socket connection error:", error.message);
      
      if (!process.env.NEXT_PUBLIC_SOCKET_URL) {
        console.info("No SOCKET_URL provided in env variables. Using default localhost:3001");
      }
      
      // If we have a mock/fallback implementation, use it
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.warn("Max reconnect attempts reached. Using fallback mock implementation");
        enableMockSocket(); 
      }
      reconnectAttempts++;
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    return socket;
  } catch (error) {
    console.error("Socket initialization error:", error);
    enableMockSocket();
    return socket;
  }
};

// Mock socket implementation for development/testing when server isn't available
const enableMockSocket = () => {
  // Implement mock behavior here
  console.log("Using mock socket implementation");
  
  // Create a mock socket with event emitters
  const events: Record<string, any[]> = {};
  
  socket = {
    id: `mock-${Date.now()}`,
    connected: true,
    
    emit: (event: string, ...args: any[]) => {
      console.log(`[MOCK] Emitting ${event}:`, args);
      
      // Simulate server responses
      if (event === 'join_auction') {
        const { auctionId } = args[0];
        setTimeout(() => {
          if (events['auction_update']) {
            events['auction_update'].forEach(callback => {
              callback({
                auctionId,
                currentBid: 1000,
                leaderboard: [],
                timeRemaining: 3600
              });
            });
          }
        }, 200);
      }
      
      if (event === 'place_bid') {
        const { auctionId, bid } = args[0];
        setTimeout(() => {
          if (events['new_bid']) {
            events['new_bid'].forEach(callback => {
              callback({ auctionId, bid });
            });
          }
          
          if (events['auction_update']) {
            events['auction_update'].forEach(callback => {
              callback({
                auctionId,
                currentBid: bid.amount,
                leaderboard: [bid],
                timeRemaining: 3500
              });
            });
          }
        }, 200);
      }
      
      return true;
    },
    
    on: (event: string, callback: any) => {
      if (!events[event]) {
        events[event] = [];
      }
      events[event].push(callback);
      return socket as Socket;
    },
    
    off: (event: string, callback: any) => {
      if (events[event]) {
        events[event] = events[event].filter(cb => cb !== callback);
      }
      return socket as Socket;
    },
    
    disconnect: () => {
      return socket as Socket;
    }
  } as unknown as Socket;
};

// Helper functions to interact with socket
export const joinAuction = (auctionId: string) => {
  if (!socket) return false;
  socket.emit("join_auction", { auctionId });
  return true;
};

export const leaveAuction = (auctionId: string) => {
  if (!socket) return false;
  socket.emit("leave_auction", { auctionId });
  return true;
};

export const placeBid = (auctionId: string, bid: Bid) => {
  if (!socket) return false;
  socket.emit("place_bid", { auctionId, bid });
  return true;
};

// Event handlers
export const onNewBid = (callback: (data: BidEvent) => void) => {
  if (!socket) return () => {};
  socket.on("new_bid", callback);
  return () => socket?.off("new_bid", callback);
};

export const onAuctionUpdate = (callback: (data: AuctionUpdateEvent) => void) => {
  if (!socket) return () => {};
  socket.on("auction_update", callback);
  return () => socket?.off("auction_update", callback);
};

export const onAuctionEnded = (callback: (data: { auctionId: string, winner: Bid }) => void) => {
  if (!socket) return () => {};
  socket.on("auction_ended", callback);
  return () => socket?.off("auction_ended", callback);
};

export const onUserJoined = (callback: (data: { auctionId: string, userId: string, activeUsers: number }) => void) => {
  if (!socket) return () => {};
  socket.on("user_joined", callback);
  return () => socket?.off("user_joined", callback);
};

export const onUserLeft = (callback: (data: { auctionId: string, userId: string, activeUsers: number }) => void) => {
  if (!socket) return () => {};
  socket.on("user_left", callback);
  return () => socket?.off("user_left", callback);
};

export const onCooldownUpdate = (callback: (data: CooldownEvent) => void) => {
  if (!socket) return () => {};
  socket.on("cooldown_update", callback);
  return () => socket?.off("cooldown_update", callback);
};

export const onUserCountUpdate = (callback: (data: UserCountEvent) => void) => {
  if (!socket) return () => {};
  socket.on("user_count_update", callback);
  return () => socket?.off("user_count_update", callback);
};

// Function to get current connection status
export const getSocketConnectionStatus = () => {
  if (!socket) return 'disconnected';
  return socket.connected ? 'connected' : 'disconnected';
};

// Then update your component to call it with both values
// Example usage - uncomment and customize when implementing in a component
// socket = initializeSocket(currentUserId, currentUsername);