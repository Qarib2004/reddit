import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "./config/passport.js";


import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import feedRoutes from "./routes/feedRoutes.js";
import interestsRoutes from "./routes/interestsRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import voteRoutes from "./routes/voteRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js"

import Message from "./models/Message.js";
import User from "./models/User.js";


dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, methods: ["GET", "POST"] },
});


app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log(` User connected: ${socket.id}`);

  socket.on("user-online", (userId) => {
    if (userId) {
      activeUsers.set(userId, socket.id);
      console.log(` ${userId} is online (socket: ${socket.id})`);
      io.emit("update-users", Array.from(activeUsers.keys()));
    }
  });

  socket.on("requestChatHistory", async ({ userId, recipientId }) => {
    try {
      const chatHistory = await Message.find({
        $or: [
          { senderId: userId, recipientId },
          { senderId: recipientId, recipientId: userId },
        ],
      }).sort({ createdAt: 1 });

      socket.emit("chatHistory", chatHistory);
    } catch (error) {
      console.error(" Error fetching chat history:", error);
    }
  });

  socket.on("sendMessage", async ({ senderId, recipientId, message }) => {
    

    try {
      
      const senderExists = await User.findById(senderId);
      const recipientExists = await User.findById(recipientId);
      
      if (!senderExists || !recipientExists) {
        
        return;
      }

      
      const newMessage = new Message({ senderId, recipientId, message });
      await newMessage.save();

    

      
      const receiverSocket = activeUsers.get(recipientId);
      if (receiverSocket) {
        
        io.to(receiverSocket).emit("receiveMessage", newMessage);
      } else {
        console.log(`User ${recipientId} is not on the network, the message is saved`);
      }

      
      io.to(socket.id).emit("chatHistory", await Message.find({
        $or: [
          { senderId, recipientId },
          { senderId: recipientId, recipientId: senderId },
        ],
      }).sort({ createdAt: 1 }));

    } catch (error) {
      console.error("Error while maintaining a message:", error);
    }
  });

  socket.on("joinChat", ({ userId }) => {
    if (userId) {
      activeUsers.set(userId, socket.id);
      console.log(` ${userId} joined chat (socket: ${socket.id})`);
      io.emit("update-users", Array.from(activeUsers.keys()));
    }
  });
  
  

  
  socket.on("disconnect", () => {
    let disconnectedUserId = null;
    activeUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        activeUsers.delete(userId);
      }
    });

    console.log(` ${disconnectedUserId ? `User ${disconnectedUserId}` : "Unknown user"} disconnected`);
    io.emit("update-users", Array.from(activeUsers.keys())); 
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/dashboards", dashboardRoutes);
app.use("/api/feeds", feedRoutes);
app.use("/api/interests", interestsRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
