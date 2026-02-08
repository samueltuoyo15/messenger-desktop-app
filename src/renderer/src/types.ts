
export interface Chat {
  id: number;
  title: string;
  lastMessageAt: number;
  unreadCount: number;
}

export interface Message {
  id: number;
  chatId: number;
  ts: number;
  sender: string;
  body: string;
}
