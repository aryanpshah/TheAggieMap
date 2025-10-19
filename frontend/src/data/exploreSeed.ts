import type { LatLng } from "../utils/distance";

export type ExploreItem = {
  id: string;
  name: string;
  tags: string[];
  coord?: LatLng;
};

export const STUDY_SPOTS: ExploreItem[] = [
  {
    id: "evans-quiet",
    name: "Evans Library (4th Floor Quiet)",
    tags: ["Quiet", "Outlets"],
    coord: { lat: 30.6189, lng: -96.3381 },
  },
  {
    id: "zachry-pods",
    name: "Zachry Pods",
    tags: ["Collab", "Whiteboards"],
    coord: { lat: 30.6199, lng: -96.3418 },
  },
  {
    id: "west-campus-library-booths",
    name: "West Campus Library Booths",
    tags: ["Quiet", "Late"],
    coord: { lat: 30.6108, lng: -96.3468 },
  },
];

export const DINING_HALLS: ExploreItem[] = [
  {
    id: "sbisa",
    name: "Sbisa Dining Hall",
    tags: ["Buffet", "Northside"],
    coord: { lat: 30.6196, lng: -96.341 },
  },
  {
    id: "southside-commons",
    name: "Southside Commons",
    tags: ["Food Hall", "Southside"],
    coord: { lat: 30.6079, lng: -96.3411 },
  },
  {
    id: "msc-dining",
    name: "MSC Dining",
    tags: ["Central", "Variety"],
    coord: { lat: 30.6127, lng: -96.3415 },
  },
];

export const LIBRARIES: ExploreItem[] = [
  {
    id: "evans-library",
    name: "Evans Library",
    tags: ["Central", "Stacks"],
    coord: { lat: 30.6188, lng: -96.3385 },
  },
  {
    id: "west-campus-library",
    name: "West Campus Library",
    tags: ["Business", "Quiet"],
    coord: { lat: 30.6107, lng: -96.3464 },
  },
];

export const REC: ExploreItem[] = [
  {
    id: "rec-center",
    name: "Student Recreation Center",
    tags: ["Weights", "Courts"],
    coord: { lat: 30.6076, lng: -96.3434 },
  },
  {
    id: "peap-building",
    name: "PEAP Building",
    tags: ["Classes", "Fitness"],
    coord: { lat: 30.6109, lng: -96.3494 },
  },
];

export const SOUTHSIDE_COMMONS_COORD: LatLng = {
  lat: 30.6079,
  lng: -96.3411,
};
