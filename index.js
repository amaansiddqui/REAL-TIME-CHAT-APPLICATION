const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 4000 });

console.log("✅ WebSocket server is running on ws://localhost:4000");

// Store message history in memory
const messageHistory = [];

server.on("connection", (ws) => {
  console.log("🔗 New client connected");

  // Send the full history to the new client
  messageHistory.forEach((msg) => {
    ws.send(JSON.stringify(msg)); // Send as JSON object
  });

  ws.on("message", (message) => {
    let msgText;

    if (message instanceof Buffer) {
      msgText = message.toString();
    } else if (typeof message === "string") {
      msgText = message;
    } else {
      return;
    }

    console.log("📩 Received:", msgText);

    const time = new Date().toLocaleTimeString();
    const newMsg = { text: msgText, sender: "You", time };

    // Save to history
    messageHistory.push(newMsg);

    // Generate server reply
    let replyText = "";

    if (msgText.toLowerCase().includes("hello")) {
      replyText = "Hi there! 👋 How can I assist you?";
    } else if (msgText.toLowerCase().includes("help")) {
      replyText = "Here are some things I can help with: chat, info, tips!";
    } else {
      replyText = "You said: " + msgText;
    }

    const serverReply = { text: replyText, sender: "Server", time };

    // Save reply to history
    messageHistory.push(serverReply);

    // Send reply
    ws.send(JSON.stringify(serverReply));
  });

  ws.on("close", () => {
    console.log("❌ Client disconnected");
  });
});
