"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

import { Antenna } from "@/lib/types";

interface MapBoundsHandlerInnerProps {
    userPosition: [number, number] | null;
    antennas: Antenna[];
}

export default function MapBoundsHandlerInner({ userPosition, antennas }: MapBoundsHandlerInnerProps) {
    const map = useMap();

    useEffect(() => {
        if (!map) return;

        // Collect all points to fit bounds
        const points: L.LatLngExpression[] = [];

        if (userPosition) {
            points.push(userPosition);
        }

        antennas.forEach((antenna) => {
            points.push([antenna.lat, antenna.lng]);
        });

        if (points.length > 0) {
            const bounds = L.latLngBounds(points);

            // Add some padding to the bounds
            map.fitBounds(bounds, {
                padding: [50, 50],
                maxZoom: 14,
            });
        }
    }, [map, userPosition, antennas]);

    return null;
}
