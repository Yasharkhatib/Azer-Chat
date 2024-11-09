import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { selectedConversation, setMessages, messages } = useConversation();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      newMessage.shouldShake = true;
      const sound = new Audio(notificationSound);
      sound.play();

      // Check if the message is for the current selected conversation
      if (newMessage.conversationId === selectedConversation?._id) {
        const currentMessages = messages[selectedConversation._id] || [];
        setMessages(selectedConversation._id, [...currentMessages, newMessage]);
      }
    });

    return () => socket?.off("newMessage");
  }, [socket, setMessages, selectedConversation, messages]);
};

export default useListenMessages;
