"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

// Dynamically import Leaflet map, disabling Server-Side Rendering
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface DriveLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export function DonorMap({ drives }: { drives: DriveLocation[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Fix Leaflet's default icon path issues with Next.js
    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      });
    });
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-[400px] w-full bg-muted animate-pulse rounded-lg flex items-center justify-center">Loading Map...</div>;

  return (
    <MapContainer
      center={[40.7128, -74.0060]}
      zoom={12}
      style={{ height: "400px", width: "100%", borderRadius: "0.5rem", zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {drives.map((drive) => (
        <Marker key={drive.id} position={[drive.lat, drive.lng]}>
          <Popup>
            <strong>{drive.name}</strong> <br /> Accepting donations now.
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
