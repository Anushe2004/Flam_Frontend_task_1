## Real-Time Collaborative Canvas – Architecture Documentation

1️⃣ **Overview**
  This project implements a real-time collaborative canvas using Node.js, Express, Socket.IO, and HTML5 Canvas. Multiple users can draw together, see each other’s cursors, and perform undo/redo actions.

2️⃣ **Data Flow Diagram**

*Description:*

  * *User Action*: A user draws on the canvas (mousedown → mousemove → mouseup).

  * *Frontend*: canvas.js captures drawing events and emits a drawing message via WebSocket to the server.

  * *Server*: server.js stores the stroke in drawingHistory and broadcasts it to all connected clients.

  * *Other Users*: Clients receive the drawing event and render the stroke on their canvas.

*Data Flow Diagram*

User A Browser
   │
   │ mouse events → canvas.js
   │
socket.emit('drawing', strokeData)
   │
   ▼
Server (Node.js + Socket.IO)
   ├── Stores drawingHistory
   └── Broadcasts drawing event to all clients
   │
   ▼
Other Users' Browsers
   │
   └─ canvas.js receives strokeData → renders on canvas
