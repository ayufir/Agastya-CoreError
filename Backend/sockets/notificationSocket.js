module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 New client connected:", socket.id);

    // Each user joins a room named after their userId
    // Frontend emits "joinRoom" with their userId after login
    socket.on("joinRoom", (userId) => {
      if (userId) {
        socket.join(userId.toString());
        console.log(`👤 User ${userId} joined their notification room`);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
};

