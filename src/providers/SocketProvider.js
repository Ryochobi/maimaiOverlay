// SocketProvider.js
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import config from "../config";


const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socketInstance, setSocketInstance] = useState(null);

  const connect = () => {
    if (
      socketRef.current &&
      socketRef.current.readyState !== WebSocket.CLOSED &&
      socketRef.current.readyState !== WebSocket.CLOSING
    ) {
      return; // Already connected or connecting
    }

    const socket = new WebSocket(config.websocketUrl);

    socket.onopen = () => {
      console.log("[WebSocket] Connected");
      setSocketInstance(socket);
    };

    socket.onclose = (event) => {
      console.warn(`[WebSocket] Closed (${event.code}), reconnecting...`);
      setTimeout(connect, 1000);
    };

    socket.onerror = (err) => {
      console.error("[WebSocket] Error:", err);
      socket.close(); // Triggers onclose
    };

    socketRef.current = socket;
  };

  useEffect(() => {
    connect();
  }, []);

  return (
    <SocketContext.Provider value={socketInstance}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
