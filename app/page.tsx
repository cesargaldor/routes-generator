import { getRoutes } from "@/actions/routes";
import Container from "@/components/container";
import { RouteCard } from "@/components/route-card";
import { ExtendedRoute } from "@/types/routes";

export default async function Home() {
  const routes = (await getRoutes()) as ExtendedRoute[];

  return (
    <Container title="Listado de rutas">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes?.map((route, index) => (
            <RouteCard key={index} route={route} />
          ))}
        </div>
      </div>
    </Container>
  );
}
