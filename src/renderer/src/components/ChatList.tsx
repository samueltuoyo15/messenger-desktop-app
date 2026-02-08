import React, { memo } from 'react';
import { Chat } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectChat } from '../store/chatsSlice';
import './ChatList.css';

interface ChatListProps {
    chats: Chat[];
    onLoadMore: () => void;
}

const ChatListItem = memo(({ chat, isSelected, onClick }: {
    chat: Chat;
    isSelected: boolean;
    onClick: () => void;
}) => {
    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));

        if (hours < 24) {
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (hours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    return (
        <div
            className={`chat-item ${isSelected ? 'selected' : ''}`}
            onClick={onClick}
        >
            <div className="chat-avatar">
                {chat.title.charAt(0).toUpperCase()}
            </div>
            <div className="chat-content">
                <div className="chat-header">
                    <span className="chat-title">{chat.title}</span>
                    <span className="chat-time">{formatTime(chat.lastMessageAt)}</span>
                </div>
                <div className="chat-footer">
                    <span className="chat-preview">Last message...</span>
                    {chat.unreadCount > 0 && (
                        <span className="chat-badge">{chat.unreadCount}</span>
                    )}
                </div>
            </div>
        </div>
    );
});

ChatListItem.displayName = 'ChatListItem';

export const ChatList: React.FC<ChatListProps> = ({ chats, onLoadMore }) => {
    const dispatch = useAppDispatch();
    const selectedChatId = useAppSelector(state => state.chats.selectedChatId);

    const handleChatClick = async (chatId: number) => {
        dispatch(selectChat(chatId));
        await window.api.markChatAsRead(chatId);
    };

    return (
        <div className="chat-list-container">
            <div className="chat-list-header">
                <h2>Messages</h2>
            </div>
            <div className="chat-list-scroll">
                {chats.map((chat) => (
                    <ChatListItem
                        key={chat.id}
                        chat={chat}
                        isSelected={selectedChatId === chat.id}
                        onClick={() => handleChatClick(chat.id)}
                    />
                ))}
            </div>
        </div>
    );
};
