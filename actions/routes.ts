import { ERROR_DEFAULT } from "@/constants/error";
import { parseOpenAIData } from "@/lib/utils";
import prisma from "@/prisma";
import OpenAI from "openai";

export type PrevState = {
  data?: any;
  success?: string;
  error?: string;
};

const token = process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN as string;

export async function getRoutes() {
  try {
    return await prisma.route.findMany({
      include: {
        creator: true,
      },
    });
  } catch (error) {
    return { error: ERROR_DEFAULT };
  }
}

export async function createRouteAction(
  prevState: PrevState,
  formData: FormData
) {
  const prompt = `${formData.get("description")}
    Devuelve únicamente un JSON con el siguiente formato:
    {
      "start": { "name": "Ciudad de inicio", "coordinates": [latitud, longitud] },
      "stops": [
        { "name": "Parada 1", "coordinates": [latitud, longitud] },
        { "name": "Parada 2", "coordinates": [latitud, longitud] }
      ],
      "end": { "name": "Ciudad de finalización", "coordinates": [latitud, longitud] }
    }
    Asegúrate de que las coordenadas sean reales y correctas.
  `;

  const client = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY as string,
    dangerouslyAllowBrowser: true,
  });

  try {
    const openAiResponse = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente experto en generar rutas de viaje por carretera en formato JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0,
    });

    const jsonResponse = JSON.parse(
      openAiResponse?.choices?.[0].message?.content || "{}"
    );

    // const mockData = {
    //   start: { name: "Sevilla", coordinates: [-5.9823, 37.3886] }, // longitud, latitud
    //   stops: [
    //     { name: "Zahara de la Sierra", coordinates: [-5.391, 36.8382] },
    //     { name: "Grazalema", coordinates: [-5.3676, 36.7651] },
    //     { name: "El Bosque", coordinates: [-5.5052, 36.7578] },
    //   ],
    //   end: { name: "Sevilla", coordinates: [-5.9823, 37.3886] },
    // };

    const waypointsStr = parseOpenAIData(jsonResponse)
      .map((point: any) => `${point[0]},${point[1]}`)
      .join(";");
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${waypointsStr}?access_token=${token}&geometries=geojson`;

    const response = await fetch(url);
    if (!response.ok) {
      return { error: "Error al obtener la ruta" };
    }
    const directionsData = await response.json();

    return {
      data: {
        waypoints: parseOpenAIData(jsonResponse),
        routeGeoJson: directionsData?.routes?.[0]?.geometry,
      },
      success: "Ruta generada correctamente",
      error: undefined,
    };
  } catch (error) {
    return { error: ERROR_DEFAULT };
  }
}
