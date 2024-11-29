import { openDB } from 'idb';

const DB_NAME = 'calculator-history';
const STORE_NAME = 'calculations';
const MAX_HISTORY_ITEMS = 50; // Increased from 10 to 50

export interface Calculation {
  id?: number;
  operation: string;
  input: string;
  result: string;
  timestamp: string;
}

const initDB = async () => {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('timestamp', 'timestamp');
      }
    },
  });
  return db;
};

export const saveCalculation = async (operation: string, input: string, result: string): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const count = await store.count();

  // If we're at the limit, remove the oldest entries
  if (count >= MAX_HISTORY_ITEMS) {
    const index = store.index('timestamp');
    const oldestEntries = await index.getAll(null, count - MAX_HISTORY_ITEMS + 1);
    for (const entry of oldestEntries) {
      await store.delete(entry.id!);
    }
  }

  // Add the new calculation
  await store.add({
    operation,
    input,
    result,
    timestamp: new Date().toISOString(),
  });
};

export const getRecentCalculations = async (limit: number = MAX_HISTORY_ITEMS): Promise<Calculation[]> => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const index = store.index('timestamp');
  
  return index.getAll(null, limit);
};

export const deleteCalculation = async (id: number): Promise<void> => {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
};

export const clearHistory = async (): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.objectStore(STORE_NAME).clear();
};