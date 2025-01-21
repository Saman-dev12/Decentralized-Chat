"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const server = new ws_1.Server({ port: 8080 });
server.on("connection", (socket) => {
    console.log("New connection");
    socket.on("message", (message) => {
        const messageString = message.toString();
        server.clients.forEach((client) => {
            if (client !== socket && client.readyState === ws_1.WebSocket.OPEN) {
                client.send(messageString);
            }
        });
    });
});
console.log("Signaling server running on ws://localhost:8080");
