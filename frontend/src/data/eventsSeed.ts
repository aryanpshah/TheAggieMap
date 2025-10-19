export type CampusEventCategory =
  | "Academic"
  | "Wellness"
  | "Clubs"
  | "Career"
  | "Sports"
  | "Hackathon"
  | "Community";

export interface CampusEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  details: string;
  location: string;
  category: CampusEventCategory;
}

export const EVENTS_SEED: CampusEvent[] = [
  {
    id: "lib-study-1",
    title: "TAMU Library Study Session",
    start: "2025-10-19T15:00:00-05:00",
    end: "2025-10-19T17:00:00-05:00",
    details: "Study and collaboration session for CSCE 315.",
    location: "Evans Library, Texas A&M University",
    category: "Academic",
  },
  {
    id: "rec-yoga-1",
    title: "Sunrise Yoga at Rec",
    start: "2025-10-20T07:30:00-05:00",
    end: "2025-10-20T08:30:00-05:00",
    details: "Beginner-friendly yoga. Mats provided.",
    location: "Student Recreation Center",
    category: "Wellness",
  },
  {
    id: "aggie-hack-night",
    title: "Aggie Coding Hack Night",
    start: "2025-10-21T18:00:00-05:00",
    end: "2025-10-21T21:00:00-05:00",
    details:
      "Bring your side projects or team up for mini challenges. Snacks and GitHub swag for participants.",
    location: "Zachry Engineering Education Complex, Collaboration Commons",
    category: "Hackathon",
  },
  {
    id: "msc-career-fair",
    title: "MSC Career Fair Prep Workshop",
    start: "2025-10-23T10:00:00-05:00",
    end: "2025-10-23T11:30:00-05:00",
    details:
      "Prep your elevator pitch and learn how to stand out. Resume reviewers available on site.",
    location: "MSC Gates Ballroom",
    category: "Career",
  },
  {
    id: "midnight-yell-1",
    title: "Midnight Yell Practice",
    start: "2025-10-25T23:30:00-05:00",
    end: "2025-10-26T01:00:00-05:00",
    details: "Midnight Yell before the big game. Yell Leaders, FTAB, and 12th Man traditions.",
    location: "Kyle Field",
    category: "Sports",
  },
  {
    id: "rec-intramural-finals",
    title: "Intramural Flag Football Finals",
    start: "2025-10-27T19:00:00-05:00",
    end: "2025-10-27T21:00:00-05:00",
    details: "Championship match under the lights. Bring friends and cheer on your dorm team.",
    location: "Penberthy Rec Sports Complex",
    category: "Sports",
  },
  {
    id: "campus-bbq",
    title: "Howdy Week Welcome BBQ",
    start: "2025-10-29T17:00:00-05:00",
    end: "2025-10-29T19:00:00-05:00",
    details: "Live music, Aggie traditions crash course, and local food trucks.",
    location: "Aggie Park",
    category: "Community",
  },
  {
    id: "women-in-engineering",
    title: "Women in Engineering Networking Meetup",
    start: "2025-10-30T18:00:00-05:00",
    end: "2025-10-30T20:00:00-05:00",
    details:
      "Connect with mentors from industry and campus orgs. Short lightning talks followed by networking.",
    location: "Zachry Engineering Education Complex, 3rd Floor Terrace",
    category: "Clubs",
  },
  {
    id: "data-science-workshop",
    title: "Aggie Data Science Workshop",
    start: "2025-10-31T15:00:00-05:00",
    end: "2025-10-31T17:30:00-05:00",
    details: "Hands-on intro to SQL, Python, and visualization with campus datasets.",
    location: "Harrington Education Center, Room 204",
    category: "Academic",
  },
  {
    id: "grad-school-info",
    title: "Graduate School Info Session",
    start: "2025-11-03T14:00:00-06:00",
    end: "2025-11-03T15:30:00-06:00",
    details: "Admissions, funding, and statement of purpose walkthrough with the Graduate School.",
    location: "Rudder Tower, 601",
    category: "Academic",
  },
];
