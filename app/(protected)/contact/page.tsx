"use client";

import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Phone, MessageCircle, ArrowLeft, Sun } from "lucide-react";
import Link from "next/link";

import { createWhatsAppLink } from "@/lib/storage";

export default function ContactPage() {
    const phoneNumber = process.env.NEXT_PUBLIC_SUPPORT_WA_NUMBER || "5562999991234";
    const formattedPhone = phoneNumber.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, "+$1 ($2) $3-$4");

    const handleWhatsApp = () => {
        const waLink = createWhatsAppLink("Olá! Gostaria de mais informações.", phoneNumber);

        window.open(waLink, "_blank");
    };

    return (
        <div className="flex flex-col p-4">
            {/* Back button */}
            <Link className="mb-4 flex items-center gap-2 text-[#1f7e7b]" href="/home">
                <ArrowLeft className="h-5 w-5" />
                <span>Voltar</span>
            </Link>

            <Card className="shadow-lg">
                <CardBody className="flex flex-col items-center gap-6 p-6">
                    {/* Logo */}
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#1f7e7b] to-[#156362] shadow-lg">
                        <Sun className="h-14 w-14 text-white" />
                    </div>

                    {/* Title */}
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-[#012d2e] dark:text-emerald-100">Sol RZK</h1>
                        <p className="mt-1 text-sm text-zinc-500">Conectividade e Soluções</p>
                    </div>

                    <Divider />

                    {/* Phone */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 text-zinc-500">
                            <Phone className="h-5 w-5" />
                            <span className="text-sm">Telefone de contato</span>
                        </div>
                        <p className="text-xl font-semibold text-zinc-700 dark:text-zinc-300">{formattedPhone}</p>
                    </div>

                    {/* WhatsApp Button */}
                    <Button className="w-full font-semibold" color="success" size="lg" startContent={<MessageCircle className="h-5 w-5" />} onPress={handleWhatsApp}>
                        Chamar no WhatsApp
                    </Button>
                </CardBody>
            </Card>
        </div>
    );
}
