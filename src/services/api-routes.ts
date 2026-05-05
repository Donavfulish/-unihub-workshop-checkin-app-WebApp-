import type { ApiRouteDefinition } from "@/types/http";

export const API_ROUTE_REGISTRY: ApiRouteDefinition[] = [
  {
    module: "auth",
    basePath: "/auth",
    route: "/register",
    method: "POST",
    note: "Public",
  },
  {
    module: "auth",
    basePath: "/auth",
    route: "/login",
    method: "POST",
    note: "Public",
  },

  {
    module: "workshop",
    basePath: "/workshops",
    route: "/",
    method: "GET",
    note: "Require external auth middleware",
  },
  {
    module: "workshop",
    basePath: "/workshops",
    route: "/",
    method: "POST",
    note: "Require external auth middleware",
  },
  {
    module: "workshop",
    basePath: "/workshops",
    route: "/:id",
    method: "GET",
    note: "Require external auth middleware",
  },
  {
    module: "workshop",
    basePath: "/workshops",
    route: "/:id",
    method: "PUT",
    note: "Require external auth middleware",
  },
  {
    module: "workshop",
    basePath: "/workshops",
    route: "/:id",
    method: "DELETE",
    note: "Require external auth middleware",
  },

  {
    module: "registration",
    basePath: "/registrations",
    route: "/",
    method: "POST",
    note: "Require external auth middleware",
  },
  {
    module: "registration",
    basePath: "/registrations",
    route: "/register",
    method: "POST",
    note: "Legacy alias for client compatibility, require external auth middleware",
  },

  {
    module: "payment",
    basePath: "/payments",
    route: "/",
    method: "POST",
    note: "Require external auth middleware",
  },

  {
    module: "checkin",
    basePath: "/checkin",
    route: "/",
    method: "POST",
    note: "Require external auth middleware in app.ts",
  },
  {
    module: "ai-summary",
    basePath: "/ai-summary",
    route: "/pdf",
    method: "POST",
    note: "Require external auth middleware in app.ts",
  },
  {
    module: "csv-import",
    basePath: "/csv-import",
    route: "/run",
    method: "POST",
    note: "Require external auth middleware in app.ts",
  },
];
