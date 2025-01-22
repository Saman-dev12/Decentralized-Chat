"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.Server({ port: 8080 });
wss.on("connection", (ws) => {
    console.log("New connection");
    ws.on("message", (data) => {
        const message = JSON.parse(data);
        console.log("Message: ", JSON.parse(data.toString()));
        // console.log("Message: ", message);
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === ws_1.WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    });
});
console.log("Signaling server running on ws://localhost:8080");
