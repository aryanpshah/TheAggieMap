import type { LatLng } from "../utils/distance";

export type ExploreItem = {
  name: string;
  tags: string[];
  coord?: LatLng;
};

export const STUDY_SPOTS: ExploreItem[] = [
  {
    name: "Evans Library (4th Floor Quiet)",
    tags: ["Quiet", "Outlets"],
    coord: { lat: 30.6189, lng: -96.3381 },
  },
  {
    name: "Zachry Pods",
    tags: ["Collab", "Whiteboards"],
    coord: { lat: 30.6199, lng: -96.3418 },
  },
  {
    name: "West Campus Library Booths",
    tags: ["Quiet", "Late"],
    coord: { lat: 30.6108, lng: -96.3468 },
  },
];

export const DINING_HALLS: ExploreItem[] = [
  {
    name: "Sbisa Dining Hall",
    tags: ["Buffet", "Northside"],
    coord: { lat: 30.6196, lng: -96.341 },
  },
  {
    name: "Southside Commons",
    tags: ["Food Hall", "Southside"],
    coord: { lat: 30.6079, lng: -96.3411 },
  },
  {
    name: "MSC Dining",
    tags: ["Central", "Variety"],
    coord: { lat: 30.6127, lng: -96.3415 },
  },
];

export const LIBRARIES: ExploreItem[] = [
  {
    name: "Evans Library",
    tags: ["Central", "Stacks"],
    coord: { lat: 30.6188, lng: -96.3385 },
  },
  {
    name: "West Campus Library",
    tags: ["Business", "Quiet"],
    coord: { lat: 30.6107, lng: -96.3464 },
  },
];

export const REC: ExploreItem[] = [
  {
    name: "Student Recreation Center",
    tags: ["Weights", "Courts"],
    coord: { lat: 30.6076, lng: -96.3434 },
  },
  {
    name: "PEAP Building",
    tags: ["Classes", "Fitness"],
    coord: { lat: 30.6109, lng: -96.3494 },
  },
];

export const SOUTHSIDE_COMMONS_COORD: LatLng = {
  lat: 30.6079,
  lng: -96.3411,
};
