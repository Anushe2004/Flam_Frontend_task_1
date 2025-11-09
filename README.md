# Real-Time Collaborative Canvas

A real-time collaborative drawing application built with **Node.js**, **Express**, **Socket.IO**, and **HTML5 Canvas**. Multiple users can draw together in real-time, use an eraser, undo/redo actions, and see each other’s cursors.

---

## Features

- Real-time drawing synchronization across multiple users
- Undo/Redo support
- Eraser tool
- Adjustable stroke color and width
- Cursor tracking for each connected user
- Clear canvas functionality

---

## Folder Structure

collaborative-canvas/
  ├── Server/
  │ └── server.js # Node.js + Socket.IO backend
  ├── Client/
  │ ├── index.html # Frontend HTML
  │ ├── canvas.js # Canvas and real-time logic
  │ ├── style.css # Styling
  │ └── websocket.js # Socket.IO client connection
  └── package.json # Node.js dependencies
