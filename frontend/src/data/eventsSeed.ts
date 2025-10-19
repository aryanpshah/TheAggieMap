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
    id: "forsyth-growing-legacy-2025-10-21",
    title: "A Growing Legacy",
    start: "2025-10-21T09:00:00-05:00",
    end: "2025-10-21T20:00:00-05:00",
    details: "Exhibition celebrating the 1989 Runyon Family donation of 19th–20th century art and complementary private-collector gifts.",
    location: "Forsyth Galleries",
    category: "Community",
  },
  {
    id: "opas-soweto-gospel-choir-2025-10-21",
    title: "OPAS presents Soweto Gospel Choir — PEACE",
    start: "2025-10-21T19:30:00-05:00",
    end: "2025-10-21T21:30:00-05:00",
    details: "Multi-Grammy and Emmy Award–winning choir performs South African freedom songs, spirituals, and classics in an uplifting program for all ages.",
    location: "Rudder Auditorium",
    category: "Community",
  },
  {
    id: "applique-workshop-mccraw-2025-10-25",
    title: "Another Way to Appliqué: Workshop with Barbara McCraw",
    start: "2025-10-25T09:00:00-05:00",
    end: "2025-10-25T13:00:00-05:00",
    details: "Quilt artist Barbara McCraw shares a proven appliqué method she has taught for nearly 20 years.",
    location: "J. Wayne Stark Galleries",
    category: "Community",
  },
  {
    id: "mfa-dance-momentums-2025-10-25",
    title: "“Momentums”: M.F.A. in Dance Student Showcase",
    start: "2025-10-25T19:00:00-05:00",
    end: "2025-10-25T21:00:00-05:00",
    details: "New choreographic works produced by the M.F.A. cohort, featuring original pieces and full student-led production. Tickets $6 students / $8 general.",
    location: "Physical Education Activity Program (PEAP) Building",
    category: "Community",
  },
  {
    id: "silver-taps-2025-11-04",
    title: "Silver Taps",
    start: "2025-11-04T22:30:00-06:00",
    end: "2025-11-04T23:15:00-06:00",
    details: "A final tribute honoring Aggies enrolled at Texas A&M at the time of their passing.",
    location: "Academic Building",
    category: "Community",
  },
  {
    id: "dwg-project-launch-2025-11-04",
    title: "DWG Project Launch",
    start: "2025-11-04T17:30:00-06:00",
    end: "2025-11-04T20:30:00-06:00",
    details: "Launch of the DWG Project reconstructing the history of Dallas’s DW Gallery (1975–1988). Demos, oral-history screening, roundtable with artists, and reception.",
    location: "Rudder Forum (5:30–7:00) & J. Wayne Stark Galleries (7:00–8:30)",
    category: "Community",
  },
  {
    id: "gardens-cinema-night-2025-11-02",
    title: "Gardens Cinema Night",
    start: "2025-11-02T17:00:00-06:00",
    end: "2025-11-02T20:00:00-06:00",
    details: "Family-friendly evening with activities, food truck, complimentary popcorn/drinks, and a movie under the stars. No alcohol permitted.",
    location: "The Gardens Event Lawn",
    category: "Community",
  },
  {
    id: "singing-cadets-flag-room-2025-11-14",
    title: "Texas A&M Singing Cadets Concert",
    start: "2025-11-14T17:00:00-06:00",
    end: "2025-11-14T18:00:00-06:00",
    details: "Free Friday home game concert in the MSC Flag Room. Open to the public.",
    location: "Memorial Student Center (Flag Room)",
    category: "Community",
  },
  {
    id: "maymester-greece-info-2025-10-20",
    title: "Info Session — Maymester Greece: Global Tech Leadership",
    start: "2025-10-20T11:00:00-05:00",
    end: "2025-10-20T12:00:00-05:00",
    details: "Learn about ENGR 489 in Greece with Professor Maria Polyzoi. Virtual option available.",
    location: "Zachry Engineering Education Complex 150",
    category: "Academic",
  },
  {
    id: "meloy-speaker-treuhardt-2025-10-21",
    title: "Kelson Treuhardt — Meloy Speaker Event",
    start: "2025-10-21T15:55:00-05:00",
    end: "2025-10-21T16:55:00-05:00",
    details: "Engineering Entrepreneurship Hour with the founder of a leading structural engineering consulting firm.",
    location: "Chemistry 2104",
    category: "Career",
  },
  {
    id: "meloy-speaker-taha-raja-2025-11-04",
    title: "Taha Raja — Meloy Speaker Event",
    start: "2025-11-04T15:55:00-06:00",
    end: "2025-11-04T16:55:00-06:00",
    details: "Seasoned entrepreneur and principal at FMW Fasteners, Power Cloud Consulting, and Brambleberry Services & Tours. Former NASA engineer; Aggie ’92 (BS Aerospace). Talk covers scaling companies, ecommerce/ERP, and global entrepreneurship.",
    location: "Chemistry Building",
    category: "Career",
  },
  {
    id: "bootstrapping-finite-temperature-2025-10-20",
    title: "Bootstrapping the Physics at Finite Temperature",
    start: "2025-10-20T14:00:00-05:00",
    end: "2025-10-20T15:00:00-05:00",
    details: "How consistency-condition bootstraps can probe finite-temperature observables in statistical and quantum systems, with examples from the lattice Ising model and large-N ungauged matrix quantum mechanics (one- and two-point correlators).",
    location: "TBD",
    category: "Academic",
  },
];
