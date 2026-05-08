import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "../redux/hooks";
import { useCurrentToken } from "../redux/features/auth/authSlice";
import { config } from "../config";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const token = useAppSelector(useCurrentToken);

  useEffect(() => {
    if (token) {
      console.log("📡 [Socket] Attempting to connect...");
      const socketUrl = config.apiBaseUrl.replace(/\/api(\/v1)?\/?$/, "");
      console.log(`📡 [Socket] Connecting to: ${socketUrl}`);
      const newSocket = io(socketUrl, {
        auth: {
          token: `Bearer ${token}`,
        },
        // Remove transports: ["websocket"] to allow polling fallback if needed
        // transports: ["websocket"], 
      });

      newSocket.on("connect", () => {
        setIsConnected(true);
        console.log("📡 [Socket] Connected to server. ID:", newSocket.id);
      });

      newSocket.on("connect_error", (error) => {
        setIsConnected(false);
        console.error("📡 [Socket] Connection error:", error.message);
      });

      newSocket.on("disconnect", (reason) => {
        setIsConnected(false);
        console.log("📡 [Socket] Disconnected from server. Reason:", reason);
      });

      setSocket(newSocket);

      return () => {
        console.log("📡 [Socket] Closing socket connection...");
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
