import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),

  // Store messages per conversation ID
  messages: {},
  setMessages: (conversationId, newMessages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: newMessages,
      },
    })),
}));

export default useConversation;
