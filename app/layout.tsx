import type { Metadata, Viewport } from "next";

import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { AuthProvider } from "@/lib/AuthContext";

import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "Sol Conectividade",
    description: "Reporte problemas de sinal e conectividade",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Sol Conectividade",
    },
    formatDetection: {
        telephone: false,
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#156362",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html suppressHydrationWarning lang="pt-BR">
            <head>
                <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
                <link href="https://fonts.googleapis.com" rel="preconnect" />
                <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
                <link href="/icons/icon-192x192.png" rel="apple-touch-icon" />
                <meta content="yes" name="apple-mobile-web-app-capable" />
                <meta content="yes" name="mobile-web-app-capable" />
            </head>
            <body className="min-h-screen bg-background antialiased">
                <HeroUIProvider>
                    <NextThemesProvider attribute="class" defaultTheme="light" forcedTheme="light">
                        <AuthProvider>{children}</AuthProvider>
                    </NextThemesProvider>
                </HeroUIProvider>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('SW registered:', registration.scope);
                  }).catch(function(error) {
                    console.log('SW registration failed:', error);
                  });
                });
              }
            `,
                    }}
                />
            </body>
        </html>
    );
}
