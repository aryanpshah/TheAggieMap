import { useEffect, useState } from "react";

type GoogleInstance = typeof google | undefined;

type HookState = {
  ready: boolean;
  error: string | null;
  google: GoogleInstance;
};

const SCRIPT_ID = "google-maps-script";
const LIBRARIES = "places,geometry";

export default function useGoogleMapsClient(): HookState {
  const [state, setState] = useState<HookState>({ ready: false, error: null, google: undefined });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.google?.maps?.geometry && window.google.maps.places) {
      setState({ ready: true, error: null, google: window.google });
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setState({ ready: false, error: "Missing Google Maps API key.", google: undefined });
      return;
    }

    const handleLoad = () => {
      if (window.google?.maps) {
        setState({ ready: true, error: null, google: window.google });
        const script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
        if (script) {
          script.setAttribute("data-loaded", "true");
        }
      } else {
        setState({ ready: false, error: "Google Maps failed to load.", google: undefined });
      }
    };

    const handleError = () => {
      setState({ ready: false, error: "Google Maps failed to load.", google: undefined });
    };

    const existingScript = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      if (existingScript.getAttribute("data-loaded") === "true") {
        handleLoad();
      } else {
        existingScript.addEventListener("load", handleLoad);
        existingScript.addEventListener("error", handleError);
      }

      return () => {
        existingScript.removeEventListener("load", handleLoad);
        existingScript.removeEventListener("error", handleError);
      };
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${LIBRARIES}`;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", handleLoad);
    script.addEventListener("error", handleError);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", handleLoad);
      script.removeEventListener("error", handleError);
    };
  }, []);

  return state;
}
