import { openDB, DBSchema, IDBPDatabase } from "idb";

import { MessageItem, UserSession } from "./types";

const DB_NAME = "alcance-sol-db";
const DB_VERSION = 1;

interface AlcanceSolDB extends DBSchema {
    messages: {
        key: string;
        value: MessageItem;
        indexes: { "by-timestamp": number };
    };
    session: {
        key: string;
        value: UserSession;
    };
}

let dbInstance: IDBPDatabase<AlcanceSolDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<AlcanceSolDB>> {
    if (dbInstance) return dbInstance;

    dbInstance = await openDB<AlcanceSolDB>(DB_NAME, DB_VERSION, {
        upgrade(db) {
            // Messages store
            if (!db.objectStoreNames.contains("messages")) {
                const messageStore = db.createObjectStore("messages", { keyPath: "id" });

                messageStore.createIndex("by-timestamp", "timestamp");
            }

            // Session store
            if (!db.objectStoreNames.contains("session")) {
                db.createObjectStore("session", { keyPath: "email" });
            }
        },
    });

    return dbInstance;
}

// ============ MESSAGE FUNCTIONS ============

export async function addMessage(message: MessageItem): Promise<void> {
    const db = await getDB();

    await db.put("messages", message);
}

export async function listMessages(): Promise<MessageItem[]> {
    const db = await getDB();
    const messages = await db.getAllFromIndex("messages", "by-timestamp");

    return messages.reverse(); // Most recent first
}

export async function getMessage(id: string): Promise<MessageItem | undefined> {
    const db = await getDB();

    return db.get("messages", id);
}

export async function updateMessage(message: MessageItem): Promise<void> {
    const db = await getDB();

    await db.put("messages", message);
}

export async function deleteMessage(id: string): Promise<void> {
    const db = await getDB();

    await db.delete("messages", id);
}

// ============ SESSION FUNCTIONS ============

const SESSION_KEY = "current_session";

export async function getSession(): Promise<UserSession | null> {
    try {
        const db = await getDB();
        const session = await db.get("session", SESSION_KEY);

        return session || null;
    } catch {
        return null;
    }
}

export async function setSession(session: UserSession): Promise<void> {
    const db = await getDB();

    await db.put("session", { ...session, email: SESSION_KEY });
}

export async function clearSession(): Promise<void> {
    const db = await getDB();

    await db.delete("session", SESSION_KEY);
}

// ============ UTILITY FUNCTIONS ============

export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatMessageContent(data: { nome: string; motivo: string; contatoAlternativo: string; mensagem: string }): string {
    return `*ALCANCE SOL - REPORT*

*Nome:* ${data.nome}
*Motivo:* ${data.motivo}
*Contato alternativo:* ${data.contatoAlternativo || "Não informado"}
*Mensagem:* ${data.mensagem}

_Enviado via Sol Conectividade App_`;
}

export function createWhatsAppLink(message: string, phoneNumber: string): string {
    const encodedMessage = encodeURIComponent(message);
    // Remove any non-numeric characters from phone number
    const cleanPhone = phoneNumber.replace(/\D/g, "");

    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
