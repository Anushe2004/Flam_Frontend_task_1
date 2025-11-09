## Real-Time Collaborative Canvas – Architecture Documentation

1️⃣ **Overview**
  This project implements a real-time collaborative canvas using Node.js, Express, Socket.IO, and HTML5 Canvas. Multiple users can draw together, see each other’s cursors, and perform undo/redo actions.

2️⃣ **Data Flow Diagram**

*Description:*

  * *User Action*: A user draws on the canvas (mousedown → mousemove → mouseup).

  * *Frontend*: canvas.js captures drawing events and emits a drawing message via WebSocket to the server.

  * *Server*: server.js stores the stroke in drawingHistory and broadcasts it to all connected clients.

  * *Other Users*: Clients receive the drawing event and render the stroke on their canvas.


 ## Data Flow Diagram

```bash
      ┌─────────────────┐
      │   User A        │
      │   Browser       │
      └─────────────────┘
               │
               │  Mouse events captured by canvas.js
               ▼
      ┌─────────────────┐
      │ canvas.js        │
      │  (Frontend)      │
      └─────────────────┘
               │
               │  socket.emit('drawing', strokeData)
               ▼
      ┌─────────────────────────────┐
      │      Server                 │
      │  Node.js + Socket.IO        │
      │  - Stores drawingHistory    │
      │  - Broadcasts strokeData    │
      └─────────────────────────────┘
               │
               │  Broadcast to all connected clients
               ▼
      ┌─────────────────┐        ┌─────────────────┐
      │ Other User B    │        │ Other User C    │
      │ Browser         │        │ Browser         │
      └─────────────────┘        └─────────────────┘
               │                        │
               │ canvas.js receives     │ canvas.js receives
               │ strokeData             │ strokeData
               ▼                        ▼
           Draws stroke on canvas     Draws stroke on canvas
```


3️⃣ **WebSocket Protocol**

| Event Name            | Direction        | Payload / Purpose                                        |
| --------------------- | ---------------- | -------------------------------------------------------- |
| `drawing`             | Client → Server  | `{ x0, y0, x1, y1, color, lineWidth }` → new stroke      |
| `history`             | Server → Client  | `drawingHistory[]` → full canvas state for new users     |
| `syncHistory`         | Both             | Updated history for undo/redo operations                 |
| `cursorMove`          | Both             | `{ x, y, userId }` → show cursor position of other users |
| `User disconnected !` | Server → Clients | `userId` → remove disconnected cursor from UI            |

 *Note*: All events are JSON objects. Events are broadcast to all clients except the sender when appropriate.


4️⃣ **Undo/Redo Strategy**

*Local History*: Each client maintains localHistory (strokes drawn locally) and redoStack.

*Undo*: Removes the last stroke from localHistory and pushes it to redoStack. Emits syncHistory to optionally update other clients.

*Redo*: Pops a stroke from redoStack back into localHistory and emits syncHistory.

*Server-Side Global State*: The server keeps drawingHistory and redoStack for global sync if needed.

*Key Decisions:*

  * Local undo/redo is instant for user experience.

  * Optional global sync ensures collaboration consistency without delaying drawing.

5️⃣ **Performance Decisions**

*Local Rendering First*: Draw stroke locally immediately, then emit to server → reduces lag perception.

*Minimal Payload*: Only the necessary stroke data (x0, y0, x1, y1, color, lineWidth) is sent → reduces network bandwidth.

*In-Memory Storage*: Server stores history in memory → fast access and low latency for small-scale testing.

*Cursor Update Throttling*: Only sends coordinates during mousemove events to reduce unnecessary traffic.

6️⃣ **Conflict Resolution**

*Simultaneous Drawing*: Each stroke is treated as an independent segment; strokes are rendered in the order received → no data loss.

*Undo/Redo Conflicts*: Optional syncHistory ensures all clients update consistently, but minor race conditions can occur if two users undo/redo at the same time.

*Cursor Overlap*: Handled visually with distinct random colors per user; overlapping cursors may occur but do not affect strokes.

7️⃣ **Optional Improvements for Scalability**

*  Use a database to persist drawingHistory for permanent storage.

*  Implement room/session management to allow multiple canvases simultaneously.

*  Add conflict resolution algorithms for global undo/redo in highly concurrent environments.

*  Optimize cursor updates with rate-limiting or delta compression for high user counts.
