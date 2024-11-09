import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { selectedConversation, addMessage } = useConversation();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      newMessage.shouldShake = true;
      const sound = new Audio(notificationSound);
      sound.play();

      // Add the new message to the specific conversation's messages
      addMessage(newMessage.conversationId, newMessage);
    });

    return () => socket?.off("newMessage");
  }, [socket, addMessage, selectedConversation]);
};

export default useListenMessages;
