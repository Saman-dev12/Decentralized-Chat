import { Server, WebSocket } from 'ws';

const wss: Server = new Server({ port: 8080 });

wss.on("connection", (ws: WebSocket) => {
    console.log("New connection");
    ws.on("message", (data: any) => {
        const message = JSON.parse(data);
        console.log("Message: ", JSON.parse(data.toString()));
        // console.log("Message: ", message);
        wss.clients.forEach((client: WebSocket) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(message));
            }
        });
    });
});

console.log("Signaling server running on ws://localhost:8080");
