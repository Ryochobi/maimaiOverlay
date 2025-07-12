const { Server } = require("socket.io");

const io = new Server(8080, {
  cors: { origin: "*" } // optional, adjust if needed
});

let overlaySocket = null;

// Handle overlay connections
io.of("/overlay").on("connection", (socket) => {
  console.log("Overlay connected");
  overlaySocket = socket;

  socket.on("disconnect", () => {
    console.log("Overlay disconnected");
    overlaySocket = null;
  });
});

// Handle control panel connections
io.of("/control").on("connection", (socket) => {
  console.log("Control panel connected");

  socket.on("control-message", (data) => {
    console.log("Control sent:", data);
    if (overlaySocket) {
      overlaySocket.emit("overlay-update", data);
    }
  });
});

console.log("Socket.IO server running on ws://localhost:8080");
