import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

// Allow all origins (you can restrict later)
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store connected users (optional)
const connectedUsers = new Map();

io.on("connection", (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  // When frontend announces itself
  socket.on("auth:hello", (data) => {
    console.log("👤 User connected:", data);

    connectedUsers.set(socket.id, {
      userId: data.userId,
      username: data.username,
      profile: data.profile,
      numbers: data.numbers
    });

    // Optional: broadcast presence
    // io.emit("presence:update", Array.from(connectedUsers.values()));
  });

  // Profile updates
  socket.on("profile:update", (payload) => {
    console.log("📄 Profile update received:", payload);

    // Save/update in memory
    connectedUsers.set(socket.id, {
      ...connectedUsers.get(socket.id),
      profile: payload.profile,
      numbers: payload.numbers
    });

    // Echo back to the same user (or broadcast if you want)
    socket.emit("profile:update", payload);
  });

  // Spirit Guide question
  socket.on("spirit:question", (payload) => {
    console.log("🔮 Spirit question:", payload);

    // Basic server-side Spirit response
    const reply = {
      text: `Spirit received your question: "${payload.question || "no question"}". 
      Your numbers show movement is possible. Trust the next small step.`
    };

    // Send back to the same user
    socket.emit("spirit:message", reply);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
    connectedUsers.delete(socket.id);
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("Destined-to-Be Socket.IO server is running.");
});

// Use PORT from environment or fallback
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
});
