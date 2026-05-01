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

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const token = useAppSelector(useCurrentToken);

  useEffect(() => {
    if (token) {
      const newSocket = io(config.apiBaseUrl.replace("/api/v1", ""), {
        auth: {
          token: `Bearer ${token}`,
        },
        transports: ["websocket"],
      });

      newSocket.on("connect", () => {
        setIsConnected(true);
        console.log("📡 [Socket] Connected to server");
      });

      newSocket.on("disconnect", () => {
        setIsConnected(false);
        console.log("📡 [Socket] Disconnected from server");
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
