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

  // Add a single message to the conversation
  addMessage: (conversationId, message) =>
    set((state) => {
      const existingMessages = state.messages[conversationId] || [];
      return {
        messages: {
          ...state.messages,
          [conversationId]: [...existingMessages, message],
        },
      };
    }),
}));

export default useConversation;
