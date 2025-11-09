// ✅ Use the global socket instance created in websocket.js
const socket = window.socket;

// 🎨 Canvas setup
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let drawing = false;
let color = document.getElementById("colorpicker").value;
let lineWidth = document.getElementById("strokewidth").value;
let isEraser = false;
let lastX = 0;
let lastY = 0;

// Local history management
let localHistory = [];
let redoStack = [];

// ================= DRAWING EVENTS =================
canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  lastX = e.offsetX;
  lastY = e.offsetY;
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
  redoStack = []; // clear redo after new draw
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;

  color = document.getElementById("colorpicker").value;
  lineWidth = document.getElementById("strokewidth").value;

  const data = {
    x0: lastX,
    y0: lastY,
    x1: e.offsetX,
    y1: e.offsetY,
    color: isEraser ? "eraser" : color,
    lineWidth,
  };

  drawLine(data); // local
  localHistory.push(data);
  socket.emit("drawing", data);

  [lastX, lastY] = [e.offsetX, e.offsetY];
});

// ================= DRAW FUNCTION =================
function drawLine(data) {
  context.lineWidth = data.lineWidth;
  context.lineCap = "round";

  if (data.color === "eraser") {
    context.globalCompositeOperation = "destination-out";
    context.strokeStyle = "rgba(0,0,0,1)";
  } else {
    context.globalCompositeOperation = "source-over";
    context.strokeStyle = data.color;
  }

  context.beginPath();
  context.moveTo(data.x0, data.y0);
  context.lineTo(data.x1, data.y1);
  context.stroke();
  context.closePath();
}

function renderDrawing(history) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (const segment of history) drawLine(segment);
}

// ================= ERASE TOGGLE =================
document.getElementById("eraserbtn").addEventListener("click", () => {
  isEraser = !isEraser;
  document.getElementById("eraserbtn").textContent = isEraser ? "Eraser: ON" : "Eraser: OFF";
});

// ================= UNDO / REDO =================
document.getElementById("undobtn").addEventListener("click", () => {
  if (localHistory.length === 0) return;

  const last = localHistory.pop();
  redoStack.push(last);
  renderDrawing(localHistory);

  // Notify others (optional global sync)
  socket.emit("syncHistory", localHistory);
});

document.getElementById("redobtn").addEventListener("click", () => {
  if (redoStack.length === 0) return;

  const restored = redoStack.pop();
  localHistory.push(restored);
  renderDrawing(localHistory);

  // Notify others (optional global sync)
  socket.emit("syncHistory", localHistory);
});

// ================= SOCKET HANDLERS =================
socket.on("drawing", (data) => {
  localHistory.push(data);
  drawLine(data);
});

socket.on("history", (history) => {
  localHistory = history;
  renderDrawing(localHistory);
});

socket.on("syncHistory", (updatedHistory) => {
  localHistory = updatedHistory;
  renderDrawing(localHistory);
});

// ================= CURSOR SYNC (optional) =================
const userColors = {};
const cursorContainer = document.createElement("div");
cursorContainer.id = "cursor-container";
document.body.appendChild(cursorContainer);

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  socket.emit("cursorMove", { x, y });
});

socket.on("cursorMove", (data) => {
  const { x, y, userId } = data;

  if (!userColors[userId]) {
    userColors[userId] = getRandomColor();
  }

  let cursorEl = document.getElementById(`cursor-${userId}`);
  if (!cursorEl) {
    cursorEl = document.createElement("div");
    cursorEl.id = `cursor-${userId}`;
    cursorEl.style.position = "absolute";
    cursorEl.style.width = "10px";
    cursorEl.style.height = "10px";
    cursorEl.style.borderRadius = "50%";
    cursorEl.style.pointerEvents = "none";
    cursorEl.style.zIndex = "1000";
    cursorEl.style.backgroundColor = userColors[userId];
    cursorContainer.appendChild(cursorEl);
  }

  const rect = canvas.getBoundingClientRect();
  cursorEl.style.left = rect.left + x + "px";
  cursorEl.style.top = rect.top + y + "px";
});

socket.on("User disconnected !", (userId) => {
  const cursorEl = document.getElementById(`cursor-${userId}`);
  if (cursorEl) cursorEl.remove();
});

function getRandomColor() {
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33AB", "#33FFF6", "#FFA533"];
  return colors[Math.floor(Math.random() * colors.length)];
}
