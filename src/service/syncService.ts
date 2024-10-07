import { getUnsyncedData, markDataAsSynced } from '../utils/idbutility';

// Sync data when back online
export const syncOfflineData = async (endpoint: string) => {
  const unsyncedData = await getUnsyncedData();

  if (unsyncedData.length === 0) {
    console.log('No data to sync.');
    return;
  }

  // Loop through each unsynced record and sync
  for (const data of unsyncedData) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await markDataAsSynced(data.id); // Mark as synced in IndexedDB
        console.log(`Data synced successfully: ${data.id}`);
      } else {
        console.error(`Failed to sync data: ${data.id}`);
      }
    } catch (error) {
      console.error('Sync error:', error);
    }
  }
};
