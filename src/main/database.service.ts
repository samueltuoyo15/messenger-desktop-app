import DatabaseConstructor from 'better-sqlite3';
import type { Database as DatabaseType } from 'better-sqlite3';
import { Chat, Message } from '../shared/types';
import { Faker } from '@faker-js/faker';

export const database: DatabaseType = new DatabaseConstructor("messenger.db")


function isDatabaseSeeded(): boolean {
    const row = database.prepare(`
        SELECT COUNT(*) as count FROM chats
        `).get() as { count: number }

    return row.count > 0
}

database.prepare(`w
    CREATE TABLE IF NOT EXISTS chats(
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        lastMessageAt INTEGER NOT NULL,
        unreadCount INTEGER NOT NULL DEFAULT 0
    )`).run();

database.prepare(`
        CREATE TABLE IF NOT EXISTS messages(
        id INTEGER PRIMARY KEY,
        chatId INTEGER NOT NULL,
        ts INTEGER NOT NULL,
        sender TEXT NOT NULL,
        body TEXT NOT NULL,
        FOREIGN KEY(chatId) REFERENCES chats(id)
    )`).run();

database.prepare(`CREATE INDEX IF NOT EXISTS idx_chats_lastMessageAt ON chats(lastMessageAt DESC)`).run()
database.prepare(`CREATE INDEX IF NOT EXISTS idx_messages_chatId_ts ON messages(chatId, ts DESC)`).run()


export function seedDatabase() {
    if(isDatabaseSeeded()) {
        return;
    }

    const insertChatstmt = database.prepare(`
            INSERT INTO chats (id, title, lastMessageAt, unreadCount)
            VALUES(?, ?, ?, ?)
     `)

    const insertMessagestmt = database.prepare(`
            INSERT INTO messages (id, chatId, ts, sender, body)
            VALUES(?, ?, ?, ?, ?)
     `)

     const now = Date.now()
     let messageId = 1;

     database.transaction(() => {
        for(let chatId = 1; chatId <= 200; chatId++) {
            const messagesPerChat = 100;
            let lastMessaegAt = 0;

            for
        }
     })
}

export function insertChat(chat: Chat) {
    const stmt = database.prepare(
        `INSERT OR IGNORE INTO chats (id, title, lastMessageAt, unreadCount)
        VALUES (@id, @title, @lastMessageAt, @unreadCount)
        `
    );
    stmt.run(chat)
}

export function insertMessage(message: Message) {
    const stmt = database.prepare(
        `
        INSERT OR IGNORE INTO messages (id, chatId, ts, sender, body)
        VALUES (@id, @chatId, @ts, @sender, @body)
        `
    )

    stmt.run(message)
}

export function getChats(offset = 0, limit = 50): Chat[] {
    const stmt = database.prepare(
        `
        SELECT * FROM chats ORDER BY lastMessageAt DESC LIMIT ? OFFSET ?
        `
    );
    
    return stmt.all(limit, offset) as Chat[];
}

export function getMessages(chatId: number, offset = 0, limit = 50): Message[] {
    const stmt = database.prepare(
        `
        SELECT * FROM messages WHERE chatId = ? ORDER BY ts DESC LIMIT ? OFFSET ?
        `
    )
    return stmt.all(chatId, limit, offset) as Message[];
}


export function searchMessages(chatId: number, query: string): Message[] {
    const stmt = database.prepare(
        `
        SELECT * FROM messages WHERE chatId = ? AND body LIKE '%' || ? || '%' ORDER BY ts DESC LIMIT 50
        `
    );
    return stmt.all(chatId, query) as Message[];
}