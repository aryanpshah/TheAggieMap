"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type Coordinates = {
  latitude: number;
  longitude: number;
  accuracy?: number;
};

export type LocationStatus = "idle" | "granted" | "fallback";

type LocationContextValue = {
  status: LocationStatus;
  userCoords?: Coordinates;
  setLocationResult: (result: LocationResult) => void;
};

export type LocationResult =
  | { status: "granted"; coords: Coordinates }
  | { status: "fallback" };

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [userCoords, setUserCoords] = useState<Coordinates | undefined>(undefined);

  const setLocationResult = useCallback((result: LocationResult) => {
    if (result.status === "granted") {
      setStatus("granted");
      setUserCoords(result.coords);
    } else {
      setStatus("fallback");
      setUserCoords(undefined);
    }
  }, []);

  const value = useMemo<LocationContextValue>(
    () => ({
      status,
      userCoords,
      setLocationResult,
    }),
    [status, userCoords, setLocationResult],
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocationContext() {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error("useLocationContext must be used within a LocationProvider");
  }
  return ctx;
}
