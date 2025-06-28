export enum SessionStatus {
  AUTHENTICATED = "authenticated",
  UNAUTHENTICATED = "unauthenticated",
  LOADING = "loading",
}

export enum FetchMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

export enum ContentType {
  // Do not set Content-Type if using FormData
  NONE = "",
  JSON = "application/json",
  TEXT = "text/plain",
}
