"use client";

import { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { addToast } from "@heroui/toast";
import { Copy, Trash2, MessageSquare, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

import { listMessages, deleteMessage } from "@/lib/storage";
import { MessageItem } from "@/lib/types";

export default function HistoryPage() {
    const [messages, setMessages] = useState<MessageItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            const msgs = await listMessages();

            setMessages(msgs);
        } catch (error) {
            console.error("Error loading messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async (content: string) => {
        try {
            await navigator.clipboard.writeText(content);
            addToast({
                title: "Copiado!",
                description: "Mensagem copiada para a área de transferência",
                color: "success",
            });
        } catch (error) {
            console.error("Error copying:", error);
            addToast({
                title: "Erro",
                description: "Não foi possível copiar a mensagem",
                color: "danger",
            });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteMessage(id);
            setMessages(messages.filter((m) => m.id !== id));
            addToast({
                title: "Excluído",
                description: "Mensagem removida do histórico",
                color: "success",
            });
        } catch (error) {
            console.error("Error deleting:", error);
            addToast({
                title: "Erro",
                description: "Não foi possível excluir a mensagem",
                color: "danger",
            });
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="flex flex-col p-4">
            {/* Back button */}
            <Link className="mb-4 flex items-center gap-2 text-[#1f7e7b]" href="/home">
                <ArrowLeft className="h-5 w-5" />
                <span>Voltar</span>
            </Link>

            <h1 className="mb-4 text-xl font-bold text-zinc-800 dark:text-zinc-100">Histórico de Mensagens</h1>

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#156362] border-t-transparent" />
                </div>
            ) : messages.length === 0 ? (
                <Card className="bg-zinc-100 dark:bg-zinc-800">
                    <CardBody className="flex flex-col items-center gap-4 py-8">
                        <MessageSquare className="h-12 w-12 text-zinc-400" />
                        <p className="text-center text-zinc-500">
                            Nenhuma mensagem no histórico.
                            <br />
                            <Link className="text-[#1f7e7b] underline" href="/report">
                                Reportar um problema
                            </Link>
                        </p>
                    </CardBody>
                </Card>
            ) : (
                <div className="flex flex-col gap-3">
                    {messages.map((message) => (
                        <Card key={message.id} className="shadow-md">
                            <CardBody className="gap-3 p-4">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-zinc-400" />
                                            <span className="text-sm text-zinc-500">{formatDate(message.timestamp)}</span>
                                        </div>
                                        <Chip color="success" size="sm" variant="flat">
                                            {message.motivo}
                                        </Chip>
                                    </div>
                                </div>

                                {/* Preview */}
                                <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-800">
                                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{message.nome}</p>
                                    <p className="mt-1 line-clamp-2 text-sm text-zinc-500">{message.mensagem}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Button
                                        className="flex-1"
                                        color="primary"
                                        size="sm"
                                        startContent={<Copy className="h-4 w-4" />}
                                        variant="flat"
                                        onPress={() => handleCopy(message.content)}
                                    >
                                        Copiar
                                    </Button>
                                    <Button
                                        className="flex-1"
                                        color="danger"
                                        size="sm"
                                        startContent={<Trash2 className="h-4 w-4" />}
                                        variant="flat"
                                        onPress={() => handleDelete(message.id)}
                                    >
                                        Excluir
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
