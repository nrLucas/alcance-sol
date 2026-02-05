"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/spinner";

import { useAuth } from "@/lib/AuthContext";

export default function RootPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user?.loggedIn) {
                router.replace("/home");
            } else {
                router.replace("/login");
            }
        }
    }, [user, loading, router]);

    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Spinner color="warning" size="lg" />
        </div>
    );
}
