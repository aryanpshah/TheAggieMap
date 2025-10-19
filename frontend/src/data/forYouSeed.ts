export type ForYouItem = {
  id: string;
  name: string;
  category: "Study" | "Dining" | "Rec" | "Library" | "Event" | "Other";
  tags?: string[];
  coord?: { lat: number; lng: number };
  href?: string;
  weight?: number;
};

export const FOR_YOU_POOL: ForYouItem[] = [
  {
    id: "zachry-pods",
    name: "Zachry Pods",
    category: "Study",
    tags: ["Collab", "Whiteboards"],
    coord: { lat: 30.6195, lng: -96.3395 },
    href: "/map?place=zachry",
    weight: 1.3,
  },
  {
    id: "evans-quiet",
    name: "Evans Library (4th Floor Quiet)",
    category: "Library",
    tags: ["Quiet", "Outlets"],
    coord: { lat: 30.6188, lng: -96.3382 },
    href: "/map?place=evans",
    weight: 1.2,
  },
  {
    id: "sbisa",
    name: "Sbisa Dining Hall",
    category: "Dining",
    tags: ["Buffet", "Northside"],
    coord: { lat: 30.6192, lng: -96.3405 },
    href: "/map?place=sbisa",
    weight: 1.0,
  },
  {
    id: "southside-commons",
    name: "Southside Commons",
    category: "Dining",
    tags: ["Food Hall", "Southside"],
    coord: { lat: 30.6129, lng: -96.3399 },
    href: "/map?place=southside",
    weight: 1.1,
  },
  {
    id: "rec-center",
    name: "Student Rec Center",
    category: "Rec",
    tags: ["Weights", "Courts"],
    coord: { lat: 30.6117, lng: -96.34 },
    href: "/map?place=rec",
    weight: 0.9,
  },
  {
    id: "msc-lounge",
    name: "MSC Lounge",
    category: "Other",
    tags: ["Central", "Meetups"],
    coord: { lat: 30.6123, lng: -96.3412 },
    href: "/map?place=msc",
    weight: 1.0,
  },
  {
    id: "west-campus-library",
    name: "West Campus Library",
    category: "Library",
    tags: ["Business", "Quiet"],
    coord: { lat: 30.6137, lng: -96.3427 },
    href: "/map?place=wcl",
    weight: 1.0,
  },
  {
    id: "peap-building",
    name: "PEAP Building",
    category: "Rec",
    tags: ["Classes", "Fitness"],
    coord: { lat: 30.6105, lng: -96.3387 },
    href: "/map?place=peap",
    weight: 0.8,
  },
  {
    id: "msc-career-booths",
    name: "Career Booths at MSC",
    category: "Event",
    tags: ["Networking", "Internships"],
    coord: { lat: 30.6123, lng: -96.3412 },
    href: "/events?category=career",
    weight: 1.1,
  },
];
