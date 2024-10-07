import { openDB } from 'idb';

const DB_NAME = 'OfflineSyncDB';
const STORE_NAME = 'offlineData';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    }
  });
};

export const saveDataToIDB = async (data: any, endpoint: string) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.add({ data, endpoint });
  await tx.done;
};

export const getAllDataFromIDB = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const clearIDBStore = async () => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.clear();
  await tx.done;
};
