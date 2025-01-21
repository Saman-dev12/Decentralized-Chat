import { Server, WebSocket } from 'ws';

const server = new Server({ port: 8080 });

server.on("connection", (socket) => {
    console.log("New connection");
    socket.on("message", (message) => {
        const messageString = message.toString();
        server.clients.forEach((client) => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(messageString);
            }
        });
    });
})

console.log("Signaling server running on ws://localhost:8080");
