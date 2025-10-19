import { toZuluRange } from "./datetime";

interface CalendarLinkArgs {
  title: string;
  startISO: string;
  endISO: string;
  details?: string;
  location?: string;
}

export function buildGoogleCalendarCreateUrl({
  title,
  startISO,
  endISO,
  details,
  location,
}: CalendarLinkArgs): string {
  const { startZulu, endZulu } = toZuluRange(startISO, endISO);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${startZulu}/${endZulu}`,
    details: details ?? "",
    location: location ?? "",
    ctz: "America/Chicago",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
