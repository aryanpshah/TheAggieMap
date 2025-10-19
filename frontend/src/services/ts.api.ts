const processEnv =
  (typeof process !== "undefined" ? process.env : undefined) ?? ({} as Record<string, string | undefined>);
const metaEnv =
  (typeof import.meta !== "undefined" ? ((import.meta as unknown as { env?: Record<string, string> }).env ?? {}) : {}) as
    | Record<string, string>
    | undefined;

const API_BASE =
  processEnv.NEXT_PUBLIC_API_BASE_URL ??
  processEnv.VITE_API_BASE_URL ??
  metaEnv?.VITE_API_BASE_URL ??
  "";

export type RawOccupancyItem = Record<string, number>;
export type RawOccupancyResponse = RawOccupancyItem[];

const DEFAULT_TIMEOUT_MS = 10_000;
const MAX_RETRIES = 2;

async function fetchWithTimeout(
  input: RequestInfo,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const userSignal = init.signal;
  if (userSignal) {
    if (userSignal.aborted) {
      controller.abort();
    } else {
      userSignal.addEventListener("abort", () => controller.abort(), { once: true });
    }
  }
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(input, {
      ...init,
      signal: controller.signal,
      mode: "cors",
      headers: {
        Accept: "application/json",
        ...init.headers,
      },
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchOccupancy(signal?: AbortSignal): Promise<RawOccupancyResponse> {
  if (!API_BASE) {
    throw new Error("Missing VITE_API_BASE_URL");
  }

  const url = `${API_BASE.replace(/\/$/, "")}/api/retrieve`;
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await fetchWithTimeout(
        url,
        {
          method: "GET",
          signal,
          credentials: "include",
        },
        DEFAULT_TIMEOUT_MS,
      );

      if (!response.ok) {
        throw new Error(`retrieve failed: ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as unknown;
      if (!Array.isArray(data)) {
        throw new Error("Unexpected payload: expected array");
      }
      return data as RawOccupancyResponse;
    } catch (error) {
      lastError = error;
      const isAbort = (error as Error)?.name === "AbortError";
      if (isAbort || attempt === MAX_RETRIES) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }

  throw (lastError instanceof Error ? lastError : new Error("Failed to fetch occupancy"));
}
