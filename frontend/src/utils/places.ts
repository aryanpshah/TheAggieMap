export const SOUTHSIDE_COMMONS_FALLBACK: google.maps.LatLngLiteral = {
  lat: 30.612547,
  lng: -96.343369,
};

const QUERY = "Southside Commons, College Station, TX";
let cachedAnchor: google.maps.LatLngLiteral | null = null;

export async function getSouthsideCommonsAnchor(
  mapsApi: typeof google,
): Promise<google.maps.LatLngLiteral> {
  if (cachedAnchor) {
    return cachedAnchor;
  }

  try {
    const service = new mapsApi.maps.places.PlacesService(document.createElement("div"));

    const placeId = await findPlaceId(service);
    if (!placeId) {
      cachedAnchor = SOUTHSIDE_COMMONS_FALLBACK;
      return cachedAnchor;
    }

    const geometry = await getPlaceGeometry(service, placeId);
    if (!geometry) {
      cachedAnchor = SOUTHSIDE_COMMONS_FALLBACK;
      return cachedAnchor;
    }

    const { location } = geometry;
    if (!location) {
      cachedAnchor = SOUTHSIDE_COMMONS_FALLBACK;
      return cachedAnchor;
    }

    cachedAnchor = { lat: location.lat(), lng: location.lng() };
    return cachedAnchor;
  } catch {
    cachedAnchor = SOUTHSIDE_COMMONS_FALLBACK;
    return cachedAnchor;
  }
}

async function findPlaceId(service: google.maps.places.PlacesService): Promise<string | undefined> {
  return new Promise((resolve) => {
    service.findPlaceFromQuery(
      {
        query: QUERY,
        fields: ["place_id"],
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results?.length) {
          resolve(results[0].place_id ?? undefined);
        } else {
          resolve(undefined);
        }
      },
    );
  });
}

async function getPlaceGeometry(
  service: google.maps.places.PlacesService,
  placeId: string,
): Promise<google.maps.places.PlaceResult["geometry"] | null> {
  return new Promise((resolve) => {
    service.getDetails(
      {
        placeId,
        fields: ["geometry"],
      },
      (result, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && result?.geometry) {
          resolve(result.geometry);
        } else {
          resolve(null);
        }
      },
    );
  });
}
