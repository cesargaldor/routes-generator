import { Route } from "@prisma/client";

export type ExtendedRoute = Route & {
  creator: {
    name: string;
  };
};
