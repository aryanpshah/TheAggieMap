export type SuggestedStatus = "Quiet" | "Moderate" | "Busy";

export type SuggestedCard = {
  id: string;
  name: string;
  distanceMeters: number;
  busyScore: number; // 0..100
  status: SuggestedStatus;
  tags: string[];
  imageUrl: string;
};
