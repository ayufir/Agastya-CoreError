import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchNotifications } from "../redux/features/notification/notificationThunk";
import { io } from "socket.io-client";

const socketUrl = import.meta.env.VITE_API_URL || "https://agastya-coreerror-api.onrender.com";
const socket = io(socketUrl);

const useNotificationSocket = () => {
  const dispatch = useDispatch();


  useEffect(() => {
    // Create an audio object (make sure the path is correct)
    const notificationSound = new Audio("/notification.mp3");

    socket.on("connect", () => {
      console.log("Connected to socket");
    });

    // Handle new notifications
    socket.on("newNotification", () => {
      dispatch(fetchNotifications());

      // Play audio on notification
      notificationSound.play().catch((err) => {
        console.warn("Audio playback failed:", err);
      });
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [dispatch]);
};

export default useNotificationSocket;
