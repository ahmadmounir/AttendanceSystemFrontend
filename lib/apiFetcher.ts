import { cookies } from "next/headers";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

type ApiOptions = RequestInit & { auth?: boolean };

export async function apiFetch<T>(
  path: string,
  { auth = true, headers: extra = {}, ...init }: ApiOptions = {}
): Promise<T> {
  const reqHeaders = new Headers(extra);

  // Add JSON defaults if body is an object
  if (init.body && !(init.body instanceof FormData)) {
    reqHeaders.set("Content-Type", "application/json");
  }

  // Attach token from httpOnly cookie on the server
  if (auth) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (token) reqHeaders.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: reqHeaders,
    // Optional: leverage Next.js fetch features
    // cache: "no-store",
    // next: { revalidate: 0 },
  });

  if (!res.ok) {
    // You can centralize error handling here
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} — ${text}`);
  }
  return (await res.json()) as T;
}