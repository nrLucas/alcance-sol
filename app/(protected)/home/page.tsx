"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { AlertTriangle, Radio } from "lucide-react";

import { MOCK_ANTENNAS } from "@/lib/types";

// Dynamic import to prevent SSR issues with Leaflet
const OfflineMapComponent = dynamic(() => import("@/components/OfflineMapComponent"), {
    ssr: false,
    loading: () => (
        <div className="flex h-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#156362] border-t-transparent" />
        </div>
    ),
});

export default function HomePage() {
    return (
        <div className="flex h-[calc(100vh-56px)] flex-col">
            {/* Map Container */}
            <div className="relative flex-1">
                <OfflineMapComponent antennas={MOCK_ANTENNAS} />

                {/* Legend Overlay */}
                <Card className="absolute left-3 top-3 bg-white/90 shadow-lg backdrop-blur-sm dark:bg-zinc-900/90">
                    <CardBody className="gap-2 p-3">
                        <h3 className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Legenda</h3>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full border-2 border-white bg-blue-500 shadow-sm" />
                            <span className="text-xs text-zinc-600 dark:text-zinc-400">Sua localização</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#1f7e7b] to-[#156362]">
                                <Radio className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-xs text-zinc-600 dark:text-zinc-400">Antena</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full border-2 border-[#0f5453] bg-[#0f5453]/20" />
                            <span className="text-xs text-zinc-600 dark:text-zinc-400">Área de cobertura</span>
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Fixed Bottom Button */}
            <div className="sticky bottom-0 border-t bg-white dark:bg-zinc-900">
                <Link href="/report">
                    <Button className="w-full font-semibold text-white" color="success" size="lg" startContent={<AlertTriangle className="h-5 w-5" />}>
                        Reportar problema
                    </Button>
                </Link>
            </div>
        </div>
    );
}
