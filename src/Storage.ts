// src/storage.ts
import { Storage } from '@ionic/storage';

// Create a new storage instance
const storage = new Storage({
  name: '__mydb',
  driverOrder: ['sqlite', 'indexeddb', 'websql'],
});

// Initialize the storage
export const initStorage = async () => {
  await storage.create();
};

// Functions to handle storage operations
export const setCredentials = async (login_id: string, password: string) => {
  await storage.set('username', login_id);
  await storage.set('password', password);
};

export const getCredentials = async () => {
  const username = await storage.get('username');
  const password = await storage.get('password');
  return { username, password };
};

export const clearCredentials = async () => {
  await storage.remove('username');
  await storage.remove('password');
};
