"use client";
import Map, { Marker, Layer, Source, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";

type Props = {
  data: any;
};

const token = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN as string;

export default function RouteMap({ data }: Props) {
  const [viewport, setViewport] = useState<any>({});
  const [waypoints, setWaypoints] = useState<any[]>([]);
  const [routeGeoJson, setRouteGeoJson] = useState<any>(null);

  const debouncedSetViewport = useCallback(
    debounce((viewState: any) => {
      setViewport(viewState);
    }, 0),
    []
  );

  const handleMapMove = (evt: any) => {
    const { longitude, latitude, zoom } = evt.viewState;
    setViewport((prev: any) => {
      if (
        prev.latitude !== latitude ||
        prev.longitude !== longitude ||
        prev.zoom !== zoom
      ) {
        debouncedSetViewport(evt.viewState);
      }
      return prev;
    });
  };

  useEffect(() => {
    if (!!data && !waypoints.length && !routeGeoJson) {
      const totalCoordinates = data?.waypoints?.reduce(
        (acc: any, coords: any) => {
          acc.lat += coords[1]; // latitud
          acc.lng += coords[0]; // longitud
          return acc;
        },
        { lat: 0, lng: 0 }
      );

      const center = {
        latitude: totalCoordinates.lat / data?.waypoints?.length,
        longitude: totalCoordinates.lng / data?.waypoints?.length,
      };

      setViewport({
        latitude: center.latitude,
        longitude: center.longitude,
        zoom: 9,
      });
      setWaypoints(data?.waypoints);
      setRouteGeoJson(data?.routeGeoJson);
    }
  }, [data]);

  return (
    <div className="w-full h-[45rem] lg:h-[55rem]">
      <Map
        viewState={viewport}
        mapStyle="mapbox://styles/mapbox/streets-v10"
        mapboxAccessToken={token}
        onMove={handleMapMove}
        scrollZoom={false}
      >
        <NavigationControl position="top-right" />

        {waypoints?.map((coords, index) => (
          <Marker longitude={coords[0]} latitude={coords[1]} key={index}>
            <div
              style={{
                backgroundColor: "#00b894",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
              }}
            ></div>
          </Marker>
        ))}

        {routeGeoJson && (
          <Source
            id="route"
            type="geojson"
            data={{ type: "Feature", geometry: routeGeoJson }}
          >
            <Layer
              id="route-layer"
              type="line"
              paint={{
                "line-color": "#55efc4",
                "line-width": 5,
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
}
