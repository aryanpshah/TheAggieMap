export type LocationTag =
  | "Quiet"
  | "Outlets"
  | "Late"
  | "Collab"
  | "Whiteboards"
  | "Buffet"
  | "Fitness"
  | "Classes"
  | "Networking"
  | "Internships"
  | string;

export type LocationCategory = "Study" | "Dining" | "Events" | "Rec" | "Building" | "Other";

export interface LocationDetail {
  id: string;
  name: string;
  category: LocationCategory;
  description: string;
  tags: LocationTag[];
  distanceMeters?: number;
  address?: string;
  campusArea?: string;
  imageUrl?: string;
  hours?: Array<{ day: string; open: string; close: string }>;
  amenities?: string[];
  currentBusyScore?: number;
  statusText?: string;
  lat?: number;
  lng?: number;
  placeId?: string;
}
