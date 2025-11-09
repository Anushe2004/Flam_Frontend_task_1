// This is the main server file for the collaborative drawing application.
// It sets up an Express server and integrates Socket.IO for real-time communication.
// The server maintains a global drawing history and handles events 
// like drawing, undo, redo, and cursor movements.
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files from /Client
app.use(express.static(path.join(__dirname, "../Client")));

// ======= GLOBAL STATE =======
let drawingHistory = []; // each element = a stroke (segment)
let redoStack = [];

// ======= SOCKET EVENTS =======
io.on("connection", (socket) => {
  console.log("New client:", socket.id);  //establish client connection

  // Send full canvas state to new user
  socket.emit("history", drawingHistory);

  // 🎨 DRAWING
  socket.on("drawing", (data) => {
    drawingHistory.push(data);
    redoStack = []; // once you draw, redo history is invalid
    socket.broadcast.emit("drawing", data);
  });

  // 🔄 UNDO (global)
  socket.on("undo", () => {
    if (drawingHistory.length === 0) return;

    const lastStroke = drawingHistory.pop();
    redoStack.push(lastStroke);

    // Broadcast the new state to everyone. In a real app, consider more efficient diffing.
    io.emit("syncHistory", drawingHistory);
    console.log(`↩️ Undo by ${socket.id}, remaining strokes: ${drawingHistory.length}`);
  });

  // 🔁 REDO (global)
  socket.on("redo", () => {
    if (redoStack.length === 0) return;

    const restored = redoStack.pop();
    drawingHistory.push(restored);

    io.emit("syncHistory", drawingHistory);
    console.log(`↪️ Redo by ${socket.id}, total strokes: ${drawingHistory.length}`);
  });

  // CLEAR CANVAS
  socket.on("clearCanvas", () => {
    drawingHistory = [];
    redoStack = [];
    io.emit("syncHistory", drawingHistory);
    console.log(`Canvas cleared by ${socket.id}`);
  });

  // Cursor tracking
  socket.on("cursorMove", (data) => {
    io.emit("cursorMove", { ...data, userId: socket.id });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    io.emit("User disconnected !", socket.id);
  });
});

// ======= START SERVER =======
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);  //start the server with the assigned port.
});
