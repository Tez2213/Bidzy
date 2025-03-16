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
  activeUsers?: number;
  cooldownRemaining?: number;
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
let currentAuctionId: string | null = null;

// Add this near the top with your other variables
const SOCKET_URLS = [
  process.env.NEXT_PUBLIC_SOCKET_URL,
  'https://socket-production-de8b.up.railway.app',
  'http://localhost:3001'
].filter(Boolean) as string[]; // Remove any undefined/empty values

let currentUrlIndex = 0;

// Initialize heartbeat
let heartbeatInterval: NodeJS.Timeout | null = null;

export const startHeartbeat = () => {
  if (heartbeatInterval) clearInterval(heartbeatInterval);
  
  heartbeatInterval = setInterval(() => {
    if (socket && socket.connected) {
      socket.emit('heartbeat');
    }
  }, 30000); // Every 30 seconds
};

export const stopHeartbeat = () => {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
};

// Replace the initializeSocket function with this updated version:
export const initializeSocket = (userId: string, username?: string) => {
  if (socket) return socket;
  
  try {
    // Get URL with fallback strategy
    const socketUrl = SOCKET_URLS[currentUrlIndex];
    
    console.log(`Attempting to connect to socket server at: ${socketUrl} (attempt ${currentUrlIndex + 1}/${SOCKET_URLS.length})`);
    
    if (!socketUrl) {
      console.warn("⚠️ No SOCKET_URL provided in env variables or fallbacks. Check your .env.local file.");
      console.warn("⚠️ Falling back to mock mode for development");
      enableMockSocket();
      return socket;
    }
    
    if (socketUrl.includes('localhost') && process.env.NODE_ENV === 'development') {
      console.warn(`⚠️ Using localhost (${socketUrl}) - make sure your local socket server is running`);
      console.warn(`⚠️ Run 'npm run socket' in another terminal or use your Railway URL instead`);
    }
    
    socket = io(socketUrl, {
      reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
      reconnectionDelay: 2000,
      query: { 
        userId,
        username: username || `User-${userId.slice(0, 5)}`
      },
      transports: ['polling', 'websocket']
    });
    
    socket.on("connect", () => {
      console.log(`✅ Socket connected successfully to ${socketUrl}`);
      console.log(`✅ Socket ID: ${socket?.id}`);
      reconnectAttempts = 0;
      
      // Start heartbeat when connected
      startHeartbeat();
    });

    socket.on("connect_error", (error) => {
      console.warn(`❌ Socket.IO connection error to ${socketUrl}:`, error.message);
      
      reconnectAttempts++;
      
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.warn(`🔄 Max reconnect attempts reached for ${socketUrl}.`);
        
        // Try next URL if available
        if (currentUrlIndex < SOCKET_URLS.length - 1) {
          currentUrlIndex++;
          reconnectAttempts = 0;
          console.log(`🔄 Trying next socket URL: ${SOCKET_URLS[currentUrlIndex]}`);
          
          // Clean up current socket
          if (socket) {
            socket.disconnect();
            socket = null;
          }
          
          // Try with next URL
          setTimeout(() => {
            initializeSocket(userId, username);
          }, 1000);
        } else {
          console.warn("🔄 All URLs tried. Using fallback mock implementation");
          enableMockSocket();
        }
      }
    });

    // The rest of your event handlers remain unchanged
    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      stopHeartbeat();
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    socket.io.on("reconnect_attempt", (attempt) => {
      console.log(`Socket reconnection attempt ${attempt}`);
    });

    socket.io.on("reconnect", (attempt) => {
      console.log(`Socket reconnected after ${attempt} attempts`);
      
      // Re-join auction rooms after reconnection
      if (currentAuctionId && socket) {
        console.log(`Re-joining auction room: ${currentAuctionId}`);
        socket.emit('join_auction', { auctionId: currentAuctionId });
      }
      
      // Restart heartbeat when reconnected
      startHeartbeat();
    });

    return socket;
  } catch (error) {
    console.error("Socket initialization error:", error);
    enableMockSocket();
    return socket;
  }
};

// Add a resetConnection function to manually try again
export const resetSocketConnection = (userId: string, username?: string) => {
  // Reset URL index to start with first URL again
  currentUrlIndex = 0;
  reconnectAttempts = 0;
  
  // Clean up existing socket
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  
  // Initialize new connection
  return initializeSocket(userId, username);
};

// Mock socket implementation for development/testing when server isn't available
const enableMockSocket = () => {
  if (socket) return;
  
  console.log("[MOCK] Enabling mock socket for development");
  
  // Mock data structure
  const mockAuctions: Record<string, {
    currentBid: number;
    leaderboard: Bid[];
    timeRemaining: number;
    isActive: boolean;
    cooldownRemaining: number;
    activeUsers: number;
  }> = {};
  
  // Event handlers
  const events: Record<string, Function[]> = {};
  
  // Create mock socket object
  socket = {
    id: `mock-${Date.now()}`,
    connected: true,
    
    emit: (event: string, ...args: any[]) => {
      console.log(`[MOCK] Emitting ${event}:`, args);
      
      // Handle join_auction
      if (event === 'join_auction') {
        const { auctionId } = args[0];
        
        // Initialize auction if needed
        if (!mockAuctions[auctionId]) {
          mockAuctions[auctionId] = {
            currentBid: 1000,
            leaderboard: [
              { userId: 'user1', username: 'John Doe', amount: 990, timestamp: new Date(Date.now() - 50000) },
              { userId: 'user2', username: 'Jane Smith', amount: 1000, timestamp: new Date(Date.now() - 120000) }
            ],
            timeRemaining: 1800,
            isActive: true,
            cooldownRemaining: 0,
            activeUsers: 1
          };
        }
        
        // Send auction update
        setTimeout(() => {
          if (events['auction_update']) {
            events['auction_update'].forEach(callback => {
              callback({
                auctionId,
                currentBid: mockAuctions[auctionId].currentBid,
                leaderboard: mockAuctions[auctionId].leaderboard,
                timeRemaining: mockAuctions[auctionId].timeRemaining,
                activeUsers: mockAuctions[auctionId].activeUsers,
                cooldownRemaining: mockAuctions[auctionId].cooldownRemaining
              });
            });
          }
        }, 500);
      }
      
      // Handle place_bid
      if (event === 'place_bid') {
        const { auctionId, bid } = args[0];
        
        if (mockAuctions[auctionId]) {
          mockAuctions[auctionId].leaderboard.push(bid);
          mockAuctions[auctionId].leaderboard.sort((a, b) => a.amount - b.amount);
          mockAuctions[auctionId].currentBid = mockAuctions[auctionId].leaderboard[0].amount;
          mockAuctions[auctionId].cooldownRemaining = 30;
          mockAuctions[auctionId].activeUsers = Math.min(5, mockAuctions[auctionId].activeUsers + 1);
          
          setTimeout(() => {
            if (events['new_bid']) {
              events['new_bid'].forEach(callback => {
                callback({ auctionId, bid, cooldownRemaining: 30 });
              });
            }
            
            if (events['auction_update']) {
              events['auction_update'].forEach(callback => {
                callback({
                  auctionId,
                  currentBid: mockAuctions[auctionId].currentBid,
                  leaderboard: mockAuctions[auctionId].leaderboard,
                  timeRemaining: mockAuctions[auctionId].timeRemaining,
                  cooldownRemaining: 30,
                  activeUsers: mockAuctions[auctionId].activeUsers
                });
              });
            }
            
            // Simulate cooldown timer
            let remainingCooldown = 30;
            const cooldownInterval = setInterval(() => {
              remainingCooldown--;
              
              if (events['cooldown_update']) {
                events['cooldown_update'].forEach(callback => {
                  callback({ auctionId, cooldownRemaining: remainingCooldown });
                });
              }
              
              if (remainingCooldown <= 0) {
                clearInterval(cooldownInterval);
                
                // End auction if cooldown reaches zero
                if (mockAuctions[auctionId].isActive) {
                  mockAuctions[auctionId].isActive = false;
                  
                  if (events['auction_ended']) {
                    events['auction_ended'].forEach(callback => {
                      callback({
                        auctionId,
                        winner: mockAuctions[auctionId].leaderboard[0],
                        reason: 'cooldown'
                      });
                    });
                  }
                }
              }
            }, 1000);
          }, 300);
        }
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
    
    disconnect: () => socket as Socket,
    disconnected: false,
    io: { opts: {} } as any,
    nsp: '/',
    auth: {},
    recovered: false
  } as unknown as Socket;
  
  // Start timer for mock auctions
  setInterval(() => {
    Object.keys(mockAuctions).forEach(auctionId => {
      const auction = mockAuctions[auctionId];
      
      if (auction.isActive && auction.timeRemaining > 0) {
        auction.timeRemaining--;
        
        // Update time every 5 seconds
        if (auction.timeRemaining % 5 === 0 && events['auction_update']) {
          events['auction_update'].forEach(callback => {
            callback({
              auctionId,
              currentBid: auction.currentBid,
              leaderboard: auction.leaderboard,
              timeRemaining: auction.timeRemaining,
              activeUsers: auction.activeUsers,
              cooldownRemaining: auction.cooldownRemaining
            });
          });
        }
        
        // End auction
        if (auction.timeRemaining <= 0 && events['auction_ended']) {
          auction.isActive = false;
          
          const winner = auction.leaderboard[0];
          events['auction_ended'].forEach(callback => {
            callback({ auctionId, winner, reason: 'timeout' });
          });
        }
      }
    });
  }, 1000);
  
  // Trigger connect event
  setTimeout(() => {
    if (events['connect']) {
      events['connect'].forEach(callback => callback());
    }
  }, 100);
};

// Helper functions to interact with socket
export const joinAuction = (auctionId: string) => {
  if (!socket) return false;
  currentAuctionId = auctionId;
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

export const onAuctionEnded = (callback: (data: { auctionId: string, winner: Bid, reason?: 'timeout' | 'cooldown' }) => void) => {
  if (!socket) return () => {};
  socket.on("auction_ended", callback);
  return () => socket?.off("auction_ended", callback);
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