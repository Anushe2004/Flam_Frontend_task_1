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
```bash
collaborative-canvas/
  ├── Server/
  │ └── server.js # Node.js + Socket.IO backend
  ├── Client/
  │ ├── index.html # Frontend HTML
  │ ├── canvas.js # Canvas and real-time logic
  │ ├── style.css # Styling
  │ └── websocket.js # Socket.IO client connection
  └── package.json # Node.js dependencies
```

## Setup & Run

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/collaborative-canvas.git
cd collaborative-canvas
```

2. **Install Dependencies**
```bash
cd server
npm install
```

3. **Start the server**
```bash
node server.js
```

  Server will run at http://localhost:3000

4. **Open the application in the browser**
    * Go to http://localhost:3000/public/index.html.
    * Open the same URL in multiple browser windows to test real-time collaboration.


## Testing with multiple users

1️⃣ **Start the Server**

   Ensure the server is running:
   
```bash
cd server
node server.js
```
   The server will start at http://localhost:3000.

2️⃣ **Open Multiple Browser Windows/Tabs**

   * Open http://localhost:3000/public/index.html in one browser window.

   *  Open the same URL in another browser window, tab, or even a different device on the same network.

 *Note*: Each window/tab represents a separate user in the collaborative session.

3️⃣ **Test Drawing**

   * Draw in one window — you should see the strokes appear instantly in all other windows.

   * Experiment with:

      a) Different colors and stroke widths

      b) Eraser tool

      c) Undo/Redo functionality

4️⃣ **Test Cursor Tracking**

   * Move the mouse in one window — other users will see colored cursors representing each participant.

   * Each cursor has a random color assigned automatically.

5️⃣ **Test Undo/Redo & Clear Canvas**

   * Click Undo or Redo in any window — all other windows will sync automatically.

   * If you have a clear canvas button, test that it resets the canvas for all users.

6️⃣ **Optional: Test on Multiple Devices**

   * Access the same URL from another device (e.g., phone, tablet, laptop) connected to the same network.

   * All actions will sync in real-time across devices.


## Limitations / Known Bugs

While this real-time collaborative canvas works well for small-scale testing, there are a few limitations and known issues:

a) *No Persistent Storage*

   * The drawing history is stored in memory on the server.

   * Restarting the server will clear the entire canvas, and all progress is lost.

b) *Undo/Redo Behavior*

   * Undo/Redo is currently local to each client, with optional global sync.

   * Full global undo/redo consistency across all clients may not always be perfect.

c) *Limited Scalability*

   * Designed for a small number of simultaneous users.

   * Performance may degrade with many users or very large drawings.

d) *Cursor Overlap*

   * Multiple users’ cursors may overlap if they are close together, making it hard to distinguish.

e) *No Authentication or Access Control*

   * Any user with the URL can access the canvas.

   * No room or session management is implemented.

f) *Browser Compatibility*

   * Tested primarily on Chrome and Edge.

   * Minor rendering differences may occur on other browsers.

g) *Mobile / Touch Support*

   * Touch and mobile gestures are not fully optimized.

   * Drawing with a touch screen may behave differently than a mouse.

h) *No Save / Export Functionality*

   Users cannot save or export the canvas to an image file yet.


**Time Spent**

The development of the Real-Time Collaborative Canvas took approximately 12–15 hours in total, distributed as follows:

| Task                                                              | Estimated Time |
| ----------------------------------------------------------------- | -------------- |
| Initial setup (Node.js server, project structure)                 | 2–3 hours      |
| Frontend Canvas Implementation (drawing, color/width, eraser)     | 4–5 hours      |
| Real-time features with Socket.IO (drawing sync, cursor tracking) | 3–4 hours      |
| Undo/Redo logic and state management                              | 1–2 hours      |
| Testing, debugging, and final refinements                         | 2 hours        |

*Note*: Actual time may vary depending on familiarity with Node.js, Socket.IO, and HTML5 Canvas.
