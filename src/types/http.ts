export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface ApiRouteDefinition {
  module: string;
  basePath: string;
  route: string;
  method: HttpMethod;
  note?: string;
}

export type JsonObject = Record<string, any>;

export interface AuthRequestOptions {
  token?: string;
}
