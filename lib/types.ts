// Message status types
export type MessageStatus = "queued" | "sent" | "failed";

// Message item stored in IndexedDB
export interface MessageItem {
    id: string;
    timestamp: number;
    nome: string;
    motivo: string;
    contatoAlternativo: string;
    mensagem: string;
    content: string; // Full formatted message
    status: MessageStatus;
}

// Antenna data for map display
export interface Antenna {
    id: string;
    name: string;
    lat: number;
    lng: number;
    radiusMeters: number;
}

// User session stored locally
export interface UserSession {
    email: string;
    loggedIn: boolean;
    timestamp: number;
}

// Report form data
export interface ReportFormData {
    nome: string;
    motivo: string;
    contatoAlternativo: string;
    mensagem: string;
}

// Motivo options for the select
export const MOTIVO_OPTIONS = [
    { value: "sem_sinal", label: "Sem sinal" },
    { value: "sinal_fraco", label: "Sinal fraco" },
    { value: "queda_conexao", label: "Queda de conexão" },
    { value: "lentidao", label: "Lentidão" },
    { value: "outro", label: "Outro" },
] as const;

// Mock antennas data
export const MOCK_ANTENNAS: Antenna[] = [
    {
        id: "1",
        name: "Antena Central",
        lat: -16.6869,
        lng: -49.2648,
        radiusMeters: 2000,
    },
    {
        id: "2",
        name: "Antena Norte",
        lat: -16.6569,
        lng: -49.2548,
        radiusMeters: 1500,
    },
    {
        id: "3",
        name: "Antena Sul",
        lat: -16.7169,
        lng: -49.2748,
        radiusMeters: 1800,
    },
];
