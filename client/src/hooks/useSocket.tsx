import { useEffect, useState } from "react";

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    
    useEffect(() => {
        const newSocket = new WebSocket("ws://localhost:8080");
        setSocket(newSocket);
    
        return () => newSocket.close();
    }, []);
    
    return socket;
}