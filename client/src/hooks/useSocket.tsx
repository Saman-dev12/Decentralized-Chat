import { useEffect, useState } from "react";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const connect = () => {
      const newSocket = new WebSocket("ws://localhost:8080");

      newSocket.onopen = () => {
        console.log("WebSocket connected.");
      };

      newSocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      newSocket.onclose = (event) => {
        console.log(`WebSocket closed: ${event.reason}`);
  
        if (!event.wasClean) {
          console.log("Reconnecting WebSocket...");
          setTimeout(connect, 1000);
        }
      };

      setSocket(newSocket);
    };

    connect();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  return socket;
};
