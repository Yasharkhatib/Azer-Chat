import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { selectedConversation, addMessage } = useConversation();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      const sound = new Audio(notificationSound);
      sound.play();

      // Check if the message is for the current selected conversation
      if (newMessage.conversationId === selectedConversation?._id) {
        addMessage(selectedConversation._id, newMessage); // Append new message
      }
    });

    return () => socket?.off("newMessage");
  }, [socket, selectedConversation?._id, addMessage]);
};

export default useListenMessages;
