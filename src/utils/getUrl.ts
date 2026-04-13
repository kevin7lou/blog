const DUMMY_ORIGIN = "https://example.com";

export function withBase(path = "/") {
  const basePath = import.meta.env.BASE_URL.endsWith("/")
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const baseUrl = new URL(basePath, DUMMY_ORIGIN);
  const normalizedPath = path.replace(/^\/+/, "");

  return new URL(normalizedPath, baseUrl).pathname;
}

export function stripBase(pathname: string) {
  const basePath = withBase("/").replace(/\/$/, "");

  if (!basePath) return pathname;
  if (pathname === basePath) return "/";

  return pathname.startsWith(`${basePath}/`)
    ? pathname.slice(basePath.length) || "/"
    : pathname;
}
