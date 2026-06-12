require("dotenv").config();

const http = require("http");
const app = require("./index");
const { Server } = require("socket.io");
const setupSocket = require("./sockets/notificationSocket");

const connectDb = require("./db/db");

const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173", // Local frontend
  "https://bank-one-phi.vercel.app",
  "http://localhost:5174", // Production frontend
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

global.io = io;

setupSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  connectDb();

  console.log(`Server running on ${PORT}`);
});
