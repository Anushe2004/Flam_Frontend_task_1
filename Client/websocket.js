
window.socket = io();

// Receive initial history on connect
socket.on("history", (history) => {
  if (window.renderDrawing) {
    window.renderDrawing(history);
  }
});

// Receive updated history after undo/redo
socket.on("syncHistory", (updatedHistory) => {
  if (window.renderDrawing) {
    window.renderDrawing(updatedHistory);
  }
});

