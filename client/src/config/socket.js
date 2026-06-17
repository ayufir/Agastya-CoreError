import { io } from "socket.io-client";

const socketUrl = import.meta.env.VITE_API_URL || "https://agastya-coreerror-api.onrender.com";
const socket = io(socketUrl);

export default socket;
