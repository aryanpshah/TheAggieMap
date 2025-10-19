export const CT_TIME_ZONE = "America/Chicago";

export type DateInput = string | Date;

type TimeParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

function ensureDate(input: DateInput): Date {
  const date = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date input.");
  }
  return date;
}

function extractParts(date: Date, timeZone: string = CT_TIME_ZONE): TimeParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);
  const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: Number.parseInt(lookup.year, 10),
    month: Number.parseInt(lookup.month, 10),
    day: Number.parseInt(lookup.day, 10),
    hour: Number.parseInt(lookup.hour, 10),
    minute: Number.parseInt(lookup.minute, 10),
    second: Number.parseInt(lookup.second, 10),
  };
}

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

function buildDatePortion(parts: TimeParts): string {
  return `${parts.year.toString().padStart(4, "0")}-${pad(parts.month)}-${pad(parts.day)}T${pad(
    parts.hour,
  )}:${pad(parts.minute)}:${pad(parts.second)}`;
}

function computeOffsetMinutes(date: Date, parts: TimeParts): number {
  const utcEquivalent = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  );
  return Math.round((utcEquivalent - date.getTime()) / 60000);
}

function formatOffset(offsetMinutes: number, separator: ":" | "" = ""): string {
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absolute = Math.abs(offsetMinutes);
  const hours = Math.floor(absolute / 60);
  const minutes = absolute % 60;
  if (separator) {
    return `${sign}${pad(hours)}${separator}${pad(minutes)}`;
  }
  return `${sign}${pad(hours)}${pad(minutes)}`;
}

export function toCTIsoString(input: DateInput): string {
  const date = ensureDate(input);
  const parts = extractParts(date);
  const offsetMinutes = computeOffsetMinutes(date, parts);
  return `${buildDatePortion(parts)}${formatOffset(offsetMinutes, ":")}`;
}

export function toCompactOffset(input: DateInput): string {
  const date = ensureDate(input);
  const parts = extractParts(date);
  const offsetMinutes = computeOffsetMinutes(date, parts);
  return `${parts.year.toString().padStart(4, "0")}${pad(parts.month)}${pad(parts.day)}T${pad(
    parts.hour,
  )}${pad(parts.minute)}${pad(parts.second)}${formatOffset(offsetMinutes)}`;
}

function formatZulu(date: Date): string {
  return (
    date.getUTCFullYear().toString().padStart(4, "0") +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    "Z"
  );
}

export function toZuluRange(
  startISO: string,
  endISO: string,
): { startZulu: string; endZulu: string } {
  const start = ensureDate(startISO);
  const end = ensureDate(endISO);
  return {
    startZulu: formatZulu(start),
    endZulu: formatZulu(end),
  };
}

export function formatRangeCT(startISO: string, endISO: string): string {
  const start = ensureDate(startISO);
  const end = ensureDate(endISO);

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: CT_TIME_ZONE,
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: CT_TIME_ZONE,
    hour: "numeric",
    minute: "2-digit",
  });

  const startDateText = dateFormatter.format(start);
  const endDateText = dateFormatter.format(end);
  const startTimeText = timeFormatter.format(start);
  const endTimeText = timeFormatter.format(end);

  if (startDateText === endDateText) {
    return `${startDateText} • ${startTimeText}–${endTimeText} CT`;
  }

  return `${startDateText} ${startTimeText} – ${endDateText} ${endTimeText} CT`;
}
