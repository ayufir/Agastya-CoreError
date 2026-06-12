// socket.js
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("📡 A user connected:", socket.id);

    // Optional: You can set up rooms/user auth here

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });

  // Make io globally available if needed
  global._io = io;
};
