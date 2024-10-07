import { openDB } from 'idb';

// Database and store names
const DB_NAME = 'offlineDB';
const STORE_NAME = 'offlineData';

// Initialize IndexedDB
export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    }
  });
};

// Save data into IndexedDB
export const saveDataToIDB = async (data: any) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.add({ ...data, synced: false });
  await tx.done;
  console.log('Data saved to IndexedDB:', data);
};

// Get all unsynced data from IndexedDB
export const getUnsyncedData = async () => {
  const db = await initDB();
  return await db.getAllFromIndex(STORE_NAME, 'synced');
};

// Mark data as synced
export const markDataAsSynced = async (id: number) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const data = await tx.store.get(id);
  data.synced = true;
  await tx.store.put(data);
  await tx.done;
};
