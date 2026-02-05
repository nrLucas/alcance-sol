"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { WifiOff, MapPin } from "lucide-react";

import { Antenna, MOCK_ANTENNAS } from "@/lib/types";

interface MapComponentProps {
    antennas?: Antenna[];
}

declare global {
    interface Window {
        google: typeof google;
        initMap: () => void;
    }
}

export default function MapComponent({ antennas = MOCK_ANTENNAS }: MapComponentProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const [isOnline, setIsOnline] = useState(true);
    const [mapError, setMapError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const mapInstanceRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);
    const circlesRef = useRef<google.maps.Circle[]>([]);

    // Check online status
    useEffect(() => {
        setIsOnline(navigator.onLine);

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    const initMap = useCallback(async () => {
        if (!mapRef.current || !window.google) return;

        try {
            // Default center (Goiânia, GO)
            let center = { lat: -16.6869, lng: -49.2648 };

            // Try to get user's location
            if ("geolocation" in navigator) {
                try {
                    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 0,
                        });
                    });

                    center = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                } catch (geoError) {
                    console.log("Geolocation not available:", geoError);
                }
            }

            const map = new window.google.maps.Map(mapRef.current, {
                center,
                zoom: 13,
                disableDefaultUI: true,
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                styles: [
                    {
                        featureType: "poi",
                        stylers: [{ visibility: "off" }],
                    },
                ],
            });

            mapInstanceRef.current = map;

            // Add user position marker
            const userMarker = new window.google.maps.Marker({
                position: center,
                map,
                title: "Sua localização",
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "#3b82f6",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 3,
                },
            });

            markersRef.current.push(userMarker);

            // Add antenna markers and coverage circles
            antennas.forEach((antenna) => {
                // Antenna marker
                const antennaMarker = new window.google.maps.Marker({
                    position: { lat: antenna.lat, lng: antenna.lng },
                    map,
                    title: antenna.name,
                    icon: {
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 12,
                        fillColor: "#f59e0b",
                        fillOpacity: 1,
                        strokeColor: "#ffffff",
                        strokeWeight: 2,
                    },
                });

                markersRef.current.push(antennaMarker);

                // Coverage circle
                const circle = new window.google.maps.Circle({
                    strokeColor: "#f59e0b",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#f59e0b",
                    fillOpacity: 0.15,
                    map,
                    center: { lat: antenna.lat, lng: antenna.lng },
                    radius: antenna.radiusMeters,
                });

                circlesRef.current.push(circle);
            });

            setIsLoading(false);
        } catch (error) {
            console.error("Error initializing map:", error);
            setMapError(true);
            setIsLoading(false);
        }
    }, [antennas]);

    // Load Google Maps script
    useEffect(() => {
        if (!isOnline) return;

        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            console.error("Google Maps API key not configured");
            setMapError(true);
            setIsLoading(false);

            return;
        }

        // Check if already loaded
        if (window.google?.maps) {
            initMap();

            return;
        }

        // Create script element
        const script = document.createElement("script");

        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
        script.async = true;
        script.defer = true;

        // Define callback
        window.initMap = initMap;

        script.onerror = () => {
            setMapError(true);
            setIsLoading(false);
        };

        document.head.appendChild(script);

        return () => {
            // Cleanup markers and circles
            markersRef.current.forEach((marker) => marker.setMap(null));
            circlesRef.current.forEach((circle) => circle.setMap(null));
            markersRef.current = [];
            circlesRef.current = [];
        };
    }, [isOnline, initMap]);

    // Offline or error state
    if (!isOnline || mapError) {
        return (
            <div className="flex h-full flex-col items-center justify-center bg-gradient-to-b from-zinc-100 to-zinc-200 p-6 dark:from-zinc-800 dark:to-zinc-900">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-300 dark:bg-zinc-700">
                    <WifiOff className="h-10 w-10 text-zinc-500" />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-zinc-700 dark:text-zinc-300">Mapa indisponível</h2>
                <p className="text-center text-sm text-zinc-500">
                    {!isOnline ? "Você está offline. Conecte-se à internet para ver o mapa." : "Erro ao carregar o mapa. Verifique sua conexão ou a API key."}
                </p>
                <div className="mt-6 flex items-center gap-2 rounded-lg bg-amber-100 px-4 py-2 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                    <MapPin className="h-5 w-5" />
                    <span className="text-sm">Você ainda pode reportar problemas!</span>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-full w-full">
            {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
                </div>
            )}
            <div ref={mapRef} className="h-full w-full" style={{ minHeight: "300px" }} />
        </div>
    );
}
