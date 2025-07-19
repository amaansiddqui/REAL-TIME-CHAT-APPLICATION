// chat-app-backend/server.js

const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 4000 }, () => {
  console.log("✅ WebSocket server started on ws://localhost:4000");
});

wss.on("connection", (ws) => {
  console.log("🟢 New client connected");

  ws.on("message", (message) => {
    const text = message.toString(); // Convert Buffer to string
    console.log("📩 Received:", text);

    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(`User: ${text}`);
      }
    });
  });

  ws.on("close", () => {
    console.log("🔴 Client disconnected");
  });
});
