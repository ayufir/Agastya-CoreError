import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchNotifications } from "../redux/features/notification/notificationThunk";
import socket from "../config/socket";

const useNotificationSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Create an audio object (make sure the path is correct)
    const notificationSound = new Audio("/notification.mp3");

    // Handle new notifications
    const handleNewNotification = () => {
      dispatch(fetchNotifications());

      // Play audio on notification
      notificationSound.play().catch((err) => {
        console.warn("Audio playback failed:", err);
      });
    };

    socket.on("newNotification", handleNewNotification);

    // Cleanup on unmount
    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [dispatch]);
};

export default useNotificationSocket;
