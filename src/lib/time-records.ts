export interface TimeRecord {
  id: string;
  date: string; // YYYY-MM-DD
  morningIn: string; // HH:mm
  lunchOut: string;
  afternoonIn: string;
  eveningOut: string;
  createdAt: string;
}

const STORAGE_KEY = "dtr-records";

export function getRecords(): TimeRecord[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as TimeRecord[];
  } catch {
    return [];
  }
}

export function saveRecord(record: Omit<TimeRecord, "id" | "createdAt">): TimeRecord {
  const records = getRecords();
  const existing = records.findIndex((r) => r.date === record.date);
  const newRecord: TimeRecord = {
    ...record,
    id: existing >= 0 ? records[existing].id : crypto.randomUUID(),
    createdAt: existing >= 0 ? records[existing].createdAt : new Date().toISOString(),
  };

  if (existing >= 0) {
    records[existing] = newRecord;
  } else {
    records.unshift(newRecord);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  return newRecord;
}

export function deleteRecord(id: string): void {
  const records = getRecords().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function formatTime(time: string): string {
  if (!time) return "—";
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${ampm}`;
}

export function formatDateDisplay(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
