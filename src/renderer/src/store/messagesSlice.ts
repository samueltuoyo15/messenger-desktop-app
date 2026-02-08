import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message } from '../types';

interface MessagesState {
  messagesByChatId: Record<number, Message[]>;
  loading: boolean;
  hasMore: Record<number, boolean>;
  offset: Record<number, number>;
  searchResults: Message[];
  searchQuery: string;
}

const initialState: MessagesState = {
  messagesByChatId: {},
  loading: false,
  hasMore: {},
  offset: {},
  searchResults: [],
  searchQuery: ''
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<{ chatId: number; messages: Message[] }>) => {
      state.messagesByChatId[action.payload.chatId] = action.payload.messages;
      state.offset[action.payload.chatId] = action.payload.messages.length;
      state.hasMore[action.payload.chatId] = action.payload.messages.length >= 50;
    },
    appendMessages: (state, action: PayloadAction<{ chatId: number; messages: Message[] }>) => {
      const existing = state.messagesByChatId[action.payload.chatId] || [];
      state.messagesByChatId[action.payload.chatId] = [...existing, ...action.payload.messages];
      state.offset[action.payload.chatId] = (state.offset[action.payload.chatId] || 0) + action.payload.messages.length;
      state.hasMore[action.payload.chatId] = action.payload.messages.length > 0;
    },
    addNewMessage: (state, action: PayloadAction<Message>) => {
      const chatId = action.payload.chatId;
      const existing = state.messagesByChatId[chatId] || [];
      state.messagesByChatId[chatId] = [action.payload, ...existing];
    },
    setSearchResults: (state, action: PayloadAction<Message[]>) => {
      state.searchResults = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
});

export const { setMessages, appendMessages, addNewMessage, setSearchResults, setSearchQuery, setLoading } = messagesSlice.actions;
export default messagesSlice.reducer;
