/**
 * SQLite Database Layer
 * Provides platform-agnostic database operations for time records
 * Supports both Capacitor (mobile) and localStorage (web fallback)
 */

import { TimeRecord } from './time-records';

const STORAGE_KEY = 'dtr-records-sqlite';
const DB_VERSION = 1;

interface DatabaseConfig {
  isCapacitor: boolean;
}

let dbConfig: DatabaseConfig = {
  isCapacitor: false,
};

// Detect if running in Capacitor environment
export function initializeDatabase(): void {
  try {
    const isCapacitor = !!(window as any).Capacitor;
    dbConfig.isCapacitor = isCapacitor;
    console.log(`[v0] Database initialized: ${isCapacitor ? 'Capacitor/SQLite' : 'Web/localStorage'}`);

    if (isCapacitor) {
      initializeCapacitorDatabase();
    }
  } catch (error) {
    console.error('[v0] Failed to initialize database:', error);
    dbConfig.isCapacitor = false;
  }
}

// Initialize Capacitor SQLite database (mobile)
async function initializeCapacitorDatabase(): Promise<void> {
  try {
    const { sqlite } = await import('@capacitor-community/sqlite');

    // Create or open the database
    await sqlite.createConnection({
      database: 'dtr_database',
      version: DB_VERSION,
      encrypted: false,
      mode: 'no-encryption',
    });

    await sqlite.open({ database: 'dtr_database' });

    // Create table if it doesn't exist
    await sqlite.execute({
      database: 'dtr_database',
      statements: `
        CREATE TABLE IF NOT EXISTS time_logs (
          id TEXT PRIMARY KEY,
          date TEXT NOT NULL UNIQUE,
          morningIn TEXT,
          lunchOut TEXT,
          afternoonIn TEXT,
          eveningOut TEXT,
          createdAt TEXT NOT NULL
        );
      `,
    });

    console.log('[v0] Capacitor SQLite database initialized');
  } catch (error) {
    console.warn('[v0] Capacitor SQLite initialization failed, falling back to localStorage:', error);
    dbConfig.isCapacitor = false;
  }
}

// Get all records
export async function getAllRecords(): Promise<TimeRecord[]> {
  if (dbConfig.isCapacitor) {
    return getRecordsFromCapacitor();
  }
  return getRecordsFromLocalStorage();
}

// Save or update a record
export async function saveRecord(record: TimeRecord): Promise<TimeRecord> {
  if (dbConfig.isCapacitor) {
    return saveRecordToCapacitor(record);
  }
  return saveRecordToLocalStorage(record);
}

// Delete a record
export async function deleteRecordById(id: string): Promise<void> {
  if (dbConfig.isCapacitor) {
    return deleteRecordFromCapacitor(id);
  }
  deleteRecordFromLocalStorage(id);
}

// ============ Capacitor SQLite Implementation ============

async function getRecordsFromCapacitor(): Promise<TimeRecord[]> {
  try {
    const { sqlite } = await import('@capacitor-community/sqlite');

    const result = await sqlite.query({
      database: 'dtr_database',
      statement: 'SELECT * FROM time_logs ORDER BY date DESC;',
      values: [],
    });

    return result.values?.map((row: any) => ({
      id: row.id,
      date: row.date,
      morningIn: row.morningIn || '',
      lunchOut: row.lunchOut || '',
      afternoonIn: row.afternoonIn || '',
      eveningOut: row.eveningOut || '',
      createdAt: row.createdAt,
    })) || [];
  } catch (error) {
    console.error('[v0] Error fetching records from Capacitor:', error);
    return [];
  }
}

async function saveRecordToCapacitor(record: TimeRecord): Promise<TimeRecord> {
  try {
    const { sqlite } = await import('@capacitor-community/sqlite');

    const existing = await sqlite.query({
      database: 'dtr_database',
      statement: 'SELECT id FROM time_logs WHERE date = ?;',
      values: [record.date],
    });

    if (existing.values && existing.values.length > 0) {
      // Update existing record
      await sqlite.run({
        database: 'dtr_database',
        statement: `
          UPDATE time_logs 
          SET morningIn = ?, lunchOut = ?, afternoonIn = ?, eveningOut = ?
          WHERE date = ?;
        `,
        values: [
          record.morningIn,
          record.lunchOut,
          record.afternoonIn,
          record.eveningOut,
          record.date,
        ],
      });
    } else {
      // Insert new record
      await sqlite.run({
        database: 'dtr_database',
        statement: `
          INSERT INTO time_logs (id, date, morningIn, lunchOut, afternoonIn, eveningOut, createdAt)
          VALUES (?, ?, ?, ?, ?, ?, ?);
        `,
        values: [
          record.id,
          record.date,
          record.morningIn,
          record.lunchOut,
          record.afternoonIn,
          record.eveningOut,
          record.createdAt,
        ],
      });
    }

    console.log(`[v0] Record saved to Capacitor: ${record.date}`);
    return record;
  } catch (error) {
    console.error('[v0] Error saving record to Capacitor:', error);
    throw error;
  }
}

async function deleteRecordFromCapacitor(id: string): Promise<void> {
  try {
    const { sqlite } = await import('@capacitor-community/sqlite');

    await sqlite.run({
      database: 'dtr_database',
      statement: 'DELETE FROM time_logs WHERE id = ?;',
      values: [id],
    });

    console.log(`[v0] Record deleted from Capacitor: ${id}`);
  } catch (error) {
    console.error('[v0] Error deleting record from Capacitor:', error);
    throw error;
  }
}

// ============ localStorage Fallback Implementation ============

function getRecordsFromLocalStorage(): TimeRecord[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as TimeRecord[];
  } catch (error) {
    console.error('[v0] Error parsing localStorage records:', error);
    return [];
  }
}

function saveRecordToLocalStorage(record: TimeRecord): TimeRecord {
  const records = getRecordsFromLocalStorage();
  const existingIndex = records.findIndex((r) => r.date === record.date);

  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.unshift(record);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  console.log(`[v0] Record saved to localStorage: ${record.date}`);
  return record;
}

function deleteRecordFromLocalStorage(id: string): void {
  const records = getRecordsFromLocalStorage().filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  console.log(`[v0] Record deleted from localStorage: ${id}`);
}
