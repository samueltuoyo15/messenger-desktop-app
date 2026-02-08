import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat } from '../types';

interface ChatsState {
  chats: Chat[];
  selectedChatId: number | null;
  loading: boolean;
  hasMore: boolean;
  offset: number;
}

const initialState: ChatsState = {
  chats: [],
  selectedChatId: null,
  loading: false,
  hasMore: true,
  offset: 0
};

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    appendChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = [...state.chats, ...action.payload];
      state.offset += action.payload.length;
      state.hasMore = action.payload.length > 0;
    },
    selectChat: (state, action: PayloadAction<number>) => {
      state.selectedChatId = action.payload;
      // Mark chat as read
      const chat = state.chats.find(c => c.id === action.payload);
      if (chat) {
        chat.unreadCount = 0;
      }
    },
    updateChatLastMessage: (state, action: PayloadAction<{ chatId: number; timestamp: number }>) => {
      const chat = state.chats.find(c => c.id === action.payload.chatId);
      if (chat) {
        chat.lastMessageAt = action.payload.timestamp;
        chat.unreadCount += 1;
        
        // Move chat to top
        state.chats = [
          chat,
          ...state.chats.filter(c => c.id !== action.payload.chatId)
        ];
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
});

export const { setChats, appendChats, selectChat, updateChatLastMessage, setLoading } = chatsSlice.actions;
export default chatsSlice.reducer;
