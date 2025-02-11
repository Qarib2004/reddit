import { io } from "socket.io-client";

const SOCKET_URL = 'http://localhost:5000';


const socket = io(SOCKET_URL, { 
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });
  
  // Add connection event handlers
  socket.on('connect', () => {
    console.log('✅ Socket connected');
  });
  
  socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error);
  });
  
  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });
  
  export default socket;
