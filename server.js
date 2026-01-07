import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// In-memory storage (replace with DB later if you want)
const users = {};        // userId → { username, socketId, profile, lat, lng }
const friends = {};      // userId → [friendUserIds]
const pendingRequests = {}; // userId → [incoming friend requests]

// Broadcast presence to all users
function broadcastPresence() {
  const online = Object.values(users).map(u => ({
    id: u.userId,
    username: u.username,
    name: u.profile?.name,
    lat: u.lat,
    lng: u.lng
  }));
  io.emit("presence:update", online);
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User identifies themselves
  socket.on("auth:hello", ({ userId, username, profile }) => {
    users[userId] = {
      userId,
      username,
      profile,
      socketId: socket.id,
      lat: null,
      lng: null
    };

    if (!friends[userId]) friends[userId] = [];
    if (!pendingRequests[userId]) pendingRequests[userId] = [];

    broadcastPresence();

    // Send friend list to user
    const friendList = friends[userId].map(fid => {
      const u = users[fid];
      return {
        id: fid,
        username: u?.username,
        name: u?.profile?.name,
        online: !!u
      };
    });
    io.to(socket.id).emit("friends:update", friendList);
  });

  // Update profile
  socket.on("profile:update", ({ userId, profile }) => {
    if (users[userId]) {
      users[userId].profile = profile;
      broadcastPresence();
    }
  });

  // Friend request
  socket.on("friend:request", ({ fromUserId, targetUsername }) => {
    const target = Object.values(users).find(u => u.username === targetUsername);
    if (!target) {
      io.to(users[fromUserId].socketId).emit("friend:request:result", {
        ok: false,
        error: "User not found"
      });
      return;
    }

    pendingRequests[target.userId].push(fromUserId);

    io.to(users[fromUserId].socketId).emit("friend:request:result", {
      ok: true
    });
  });

  // Accept friend
  socket.on("friend:accept", ({ userId, fromUserId }) => {
    if (!friends[userId].includes(fromUserId)) friends[userId].push(fromUserId);
    if (!friends[fromUserId].includes(userId)) friends[fromUserId].push(userId);

    pendingRequests[userId] = pendingRequests[userId].filter(id => id !== fromUserId);

    const update = (uid) => {
      const list = friends[uid].map(fid => {
        const u = users[fid];
        return {
          id: fid,
          username: u?.username,
          name: u?.profile?.name,
          online: !!u
        };
      });
      if (users[uid]) io.to(users[uid].socketId).emit("friends:update", list);
    };

    update(userId);
    update(fromUserId);
  });

  // Remove friend
  socket.on("friend:remove", ({ userId, friendId }) => {
    friends[userId] = friends[userId].filter(id => id !== friendId);
    friends[friendId] = friends[friendId].filter(id => id !== userId);

    const update = (uid) => {
      const list = friends[uid].map(fid => {
        const u = users[fid];
        return {
          id: fid,
          username: u?.username,
          name: u?.profile?.name,
          online: !!u
        };
      });
      if (users[uid]) io.to(users[uid].socketId).emit("friends:update", list);
    };

    update(userId);
    update(friendId);
  });

  // Chat
  socket.on("chat:message", (msg) => {
    const { to } = msg;
    const target = users[to];
    if (target) {
      io.to(target.socketId).emit("chat:message", msg);
    }
  });

  // Location updates
  socket.on("presence:location", ({ userId, lat, lng }) => {
    if (users[userId]) {
      users[userId].lat = lat;
      users[userId].lng = lng;
      broadcastPresence();
    }
  });

  socket.on("disconnect", () => {
    const userId = Object.keys(users).find(id => users[id].socketId === socket.id);
    if (userId) {
      delete users[userId];
      broadcastPresence();
    }
  });
});

server.listen(3000, () => {
  console.log("Socket.IO server running on port 3000");
});
