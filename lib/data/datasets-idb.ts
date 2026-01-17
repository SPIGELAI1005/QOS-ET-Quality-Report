/**
 * Store large parsed datasets in IndexedDB to avoid localStorage quota limits.
 * This is used by the Upload page for incremental uploads (complaints/deliveries)
 * and background KPI recalculation.
 */

import type { Complaint, Delivery } from "@/lib/domain/types";

const DB_NAME = "qos-et-datasets";
const DB_VERSION = 1;
const STORE_COMPLAINTS = "complaints";
const STORE_DELIVERIES = "deliveries";

type StoreName = typeof STORE_COMPLAINTS | typeof STORE_DELIVERIES;

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (typeof window === "undefined") return Promise.reject(new Error("IndexedDB not available on server"));
  if (dbPromise) return dbPromise;

  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_COMPLAINTS)) {
        db.createObjectStore(STORE_COMPLAINTS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_DELIVERIES)) {
        db.createObjectStore(STORE_DELIVERIES, { keyPath: "id" });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("Failed to open IndexedDB"));
  });

  return dbPromise;
}

function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error("IndexedDB transaction failed"));
    tx.onabort = () => reject(tx.error || new Error("IndexedDB transaction aborted"));
  });
}

async function putMany<T extends { id: string }>(storeName: StoreName, rows: T[]): Promise<number> {
  if (rows.length === 0) return 0;
  const db = await openDb();
  const tx = db.transaction(storeName, "readwrite");
  const store = tx.objectStore(storeName);

  // Chunk to keep transactions responsive for very large datasets
  const CHUNK = 2000;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const slice = rows.slice(i, i + CHUNK);
    slice.forEach((row) => {
      if (row?.id) store.put(row);
    });
  }

  await txDone(tx);
  return rows.length;
}

async function getAll<T>(storeName: StoreName): Promise<T[]> {
  const db = await openDb();
  const tx = db.transaction(storeName, "readonly");
  const store = tx.objectStore(storeName);

  const req = store.getAll();
  const rows = await new Promise<T[]>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result as T[]);
    req.onerror = () => reject(req.error || new Error("IndexedDB getAll failed"));
  });

  await txDone(tx);
  return rows;
}

async function count(storeName: StoreName): Promise<number> {
  const db = await openDb();
  const tx = db.transaction(storeName, "readonly");
  const store = tx.objectStore(storeName);
  const req = store.count();
  const c = await new Promise<number>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("IndexedDB count failed"));
  });
  await txDone(tx);
  return c;
}

export async function upsertComplaints(rows: Complaint[]): Promise<number> {
  return await putMany<Complaint>(STORE_COMPLAINTS, rows);
}

export async function upsertDeliveries(rows: Delivery[]): Promise<number> {
  return await putMany<Delivery>(STORE_DELIVERIES, rows);
}

export async function getAllComplaints(): Promise<Complaint[]> {
  return await getAll<Complaint>(STORE_COMPLAINTS);
}

export async function getAllDeliveries(): Promise<Delivery[]> {
  return await getAll<Delivery>(STORE_DELIVERIES);
}

export async function getDatasetCounts(): Promise<{ complaints: number; deliveries: number }> {
  const [complaints, deliveries] = await Promise.all([count(STORE_COMPLAINTS), count(STORE_DELIVERIES)]);
  return { complaints, deliveries };
}

export async function clearDatasets(): Promise<void> {
  const db = await openDb();
  const tx = db.transaction([STORE_COMPLAINTS, STORE_DELIVERIES], "readwrite");
  tx.objectStore(STORE_COMPLAINTS).clear();
  tx.objectStore(STORE_DELIVERIES).clear();
  await txDone(tx);
}

