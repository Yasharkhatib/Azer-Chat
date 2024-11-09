import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) =>
    set({ selectedConversation }),

  // Store messages by conversation ID
  messages: {},
  setMessages: (conversationId, newMessages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...newMessages], // Explicitly spread new messages for reactivity
      },
    })),

  // Append a single new message to an existing conversation's messages
  addMessage: (conversationId, newMessage) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [
          ...(state.messages[conversationId] || []),
          newMessage,
        ],
      },
    })),
}));

export default useConversation;
