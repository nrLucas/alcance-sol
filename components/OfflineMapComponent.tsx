"use client";

import { useEffect, useState, useRef } from "react";
import { WifiOff } from "lucide-react";

import { Antenna, MOCK_ANTENNAS } from "@/lib/types";

const ANTENNA_COLOR = "#0f5453";
const USER_MARKER_COLOR = "#3b82f6";

interface OfflineMapComponentProps {
    antennas?: Antenna[];
}

export default function OfflineMapComponent({ antennas = MOCK_ANTENNAS }: OfflineMapComponentProps) {
    const [isOnline, setIsOnline] = useState(true);
    const [isReady, setIsReady] = useState(false);
    const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const circlesRef = useRef<any[]>([]);
    const imageOverlayRef = useRef<any>(null);

    const defaultCenter: [number, number] = [-16.6869, -49.2648];

    // Monitor de conexão
    useEffect(() => {
        setIsOnline(navigator.onLine);
        const toggle = () => setIsOnline(navigator.onLine);

        window.addEventListener("online", toggle);
        window.addEventListener("offline", toggle);

        return () => {
            window.removeEventListener("online", toggle);
            window.removeEventListener("offline", toggle);
        };
    }, []);

    // Carregamento de CSS do Leaflet
    useEffect(() => {
        if (!document.querySelector("#leaflet-css")) {
            const link = document.createElement("link");

            link.id = "leaflet-css";
            link.rel = "stylesheet";
            link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
            document.head.appendChild(link);
        }
    }, []);

    // Inicializar mapa usando API imperativa do Leaflet
    useEffect(() => {
        if (typeof window === "undefined" || !mapContainerRef.current) return;

        // Se já existe um mapa, não criar outro
        if (mapInstanceRef.current) return;

        const initMap = async () => {
            try {
                const L = await import("leaflet");

                // Fix para ícones padrão
                delete (L.Icon.Default.prototype as any)._getIconUrl;
                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
                });

                // Verificar se container já tem mapa inicializado
                const container = mapContainerRef.current;

                if (!container || (container as any)._leaflet_id) {
                    return;
                }

                // Criar ícones customizados
                const userMarkerIcon = L.divIcon({
                    className: "user-icon",
                    html: `<div style="width:20px;height:20px;background:${USER_MARKER_COLOR};border:3px solid white;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>`,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10],
                });

                const antennaMarkerIcon = L.divIcon({
                    className: "antenna-icon",
                    html: `<div style="width:28px;height:28px;background:#156362;border:2px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5M19.1 4.9C23 8.8 23 15.1 19.1 19M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/></svg>
                 </div>`,
                    iconSize: [28, 28],
                    iconAnchor: [14, 14],
                });

                // Criar mapa
                const map = L.map(container).setView(defaultCenter, 13);

                mapInstanceRef.current = map;

                // Adicionar tiles de satélite (ESRI World Imagery)
                L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
                    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
                    maxZoom: 19,
                }).addTo(map);

                // Calcular bounds para a imagem de cobertura baseado nas antenas
                // Pegamos os extremos das antenas e adicionamos padding para cobrir a área
                const lats = antennas.map((a) => a.lat);
                const lngs = antennas.map((a) => a.lng);
                const padding = 0.03; // ~3km de padding aproximado

                const imageBounds: [[number, number], [number, number]] = [
                    [Math.min(...lats) - padding, Math.min(...lngs) - padding], // SW
                    [Math.max(...lats) + padding, Math.max(...lngs) + padding], // NE
                ];

                // Adicionar imagem de cobertura como overlay (escala com zoom)
                const imageOverlay = L.imageOverlay("/plot/path1-1.png", imageBounds, {
                    opacity: 1,
                    interactive: false,
                }).addTo(map);

                imageOverlayRef.current = imageOverlay;

                // Adicionar marcadores das antenas
                antennas.forEach((antenna) => {
                    const marker = L.marker([antenna.lat, antenna.lng], { icon: antennaMarkerIcon }).bindPopup(antenna.name).addTo(map);

                    markersRef.current.push(marker);

                    const circle = L.circle([antenna.lat, antenna.lng], {
                        radius: antenna.radiusMeters,
                        color: ANTENNA_COLOR,
                        fillColor: ANTENNA_COLOR,
                        fillOpacity: 0.15,
                        weight: 2,
                    }).addTo(map);

                    circlesRef.current.push(circle);
                });

                // Obter localização do usuário
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            const userLatLng: [number, number] = [pos.coords.latitude, pos.coords.longitude];

                            setUserPosition(userLatLng);

                            // Adicionar marcador do usuário
                            const userMarker = L.marker(userLatLng, { icon: userMarkerIcon }).bindPopup("Sua localização").addTo(map);

                            markersRef.current.push(userMarker);

                            // Ajustar bounds para mostrar usuário e antenas
                            const allPoints = [userLatLng, ...antennas.map((a) => [a.lat, a.lng] as [number, number])];

                            if (allPoints.length > 0) {
                                const bounds = L.latLngBounds(allPoints);

                                map.fitBounds(bounds, { padding: [50, 50] });
                            }

                            setIsReady(true);
                        },
                        () => {
                            // Sem geolocalização, ajustar apenas para antenas
                            if (antennas.length > 0) {
                                const bounds = L.latLngBounds(antennas.map((a) => [a.lat, a.lng]));

                                map.fitBounds(bounds, { padding: [50, 50] });
                            }
                            setIsReady(true);
                        },
                        { timeout: 5000, enableHighAccuracy: true },
                    );
                } else {
                    setIsReady(true);
                }
            } catch (error) {
                console.error("Error initializing map:", error);
                setIsReady(true);
            }
        };

        // Aguardar CSS carregar antes de inicializar
        const checkCSSAndInit = () => {
            const cssLoaded = document.querySelector("#leaflet-css");

            if (cssLoaded) {
                initMap();
            } else {
                setTimeout(checkCSSAndInit, 100);
            }
        };

        checkCSSAndInit();

        // Cleanup
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
            markersRef.current = [];
            circlesRef.current = [];
            imageOverlayRef.current = null;
        };
    }, [antennas]);

    return (
        <div className="relative z-10 h-full w-full bg-zinc-100 dark:bg-zinc-800">
            {/* Overlay de Loading */}
            {!isReady && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 dark:bg-zinc-900/80">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#156362] border-t-transparent" />
                </div>
            )}

            {/* Banner de Offline */}
            {!isOnline && (
                <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-center gap-2 bg-amber-100 py-2 text-amber-800 shadow-sm dark:bg-amber-900/40 dark:text-amber-200">
                    <WifiOff className="h-4 w-4" />
                    <span className="text-xs font-medium">Modo Offline: Usando dados em cache</span>
                </div>
            )}

            {/* Container do Mapa */}
            <div ref={mapContainerRef} className="h-full w-full" style={{ minHeight: "300px" }} />
        </div>
    );
}
