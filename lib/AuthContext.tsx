"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

import { UserSession } from "./types";
import { getSession, setSession, clearSession } from "./storage";

interface AuthContextType {
    user: UserSession | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserSession | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load session from IndexedDB on mount
        async function loadSession() {
            try {
                const session = await getSession();

                if (session && session.loggedIn) {
                    setUser(session);
                }
            } catch (error) {
                console.error("Error loading session:", error);
            } finally {
                setLoading(false);
            }
        }
        loadSession();
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<boolean> => {
        // Mock authentication - accepts any email/password
        // In production, you would validate credentials here
        if (!email || !password) {
            return false;
        }

        const session: UserSession = {
            email,
            loggedIn: true,
            timestamp: Date.now(),
        };

        try {
            await setSession(session);
            setUser(session);

            return true;
        } catch (error) {
            console.error("Error saving session:", error);

            return false;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await clearSession();
            setUser(null);
        } catch (error) {
            console.error("Error clearing session:", error);
        }
    }, []);

    return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
