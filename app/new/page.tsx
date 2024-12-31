"use client";
import Container from "@/components/container";
import CreateRouteForm from "@/components/create-route-form";
import Map from "@/components/map";
import { useState } from "react";

export default function Home() {
  const [mapData, setMapData] = useState<any>(null);

  return (
    <Container title="Generar ruta">
      <CreateRouteForm onSetData={(data) => setMapData(data)} />
      {mapData && (
        <div className="mt-6">
          <Map data={mapData} />
        </div>
      )}
    </Container>
  );
}
