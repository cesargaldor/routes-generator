import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExtendedRoute } from "@/types/routes";
import Link from "next/link";

interface InfoCardProps {
  route: ExtendedRoute;
}

export function RouteCard({ route }: InfoCardProps) {
  return (
    <Link href={`/r/${route.id}`}>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl">{route?.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between">
          <p className="text-muted-foreground mb-4">{route?.description}</p>
          <div className="text-sm text-muted-foreground">
            <p>Creada el: {route.createdAt.toLocaleDateString()}</p>
            <p>Creada por: {route?.creator?.name}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
