'use client';

export async function getUserPosition(
  timeoutMs = 2000,
): Promise<{ lat: number; lng: number } | null> {
  if (typeof window === "undefined" || !("geolocation" in navigator)) {
    return null;
  }

  return new Promise((resolve) => {
    let settled = false;

    const timer = window.setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(null);
      }
    }, timeoutMs);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!settled) {
          settled = true;
          window.clearTimeout(timer);
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        }
      },
      () => {
        if (!settled) {
          settled = true;
          window.clearTimeout(timer);
          resolve(null);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: timeoutMs,
        maximumAge: 30_000,
      },
    );
  });
}
