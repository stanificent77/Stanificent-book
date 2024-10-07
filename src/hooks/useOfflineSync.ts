// src/hooks/useOfflineSync.ts
import { useEffect } from 'react';

// Function to simulate saving to IndexedDB or LocalStorage
const saveToIndexedDB = async (data: any) => {
    const offlineData = JSON.parse(localStorage.getItem('offlineData') || '[]');
    offlineData.push(data);
    localStorage.setItem('offlineData', JSON.stringify(offlineData));
};

// Function to fetch offline data from storage
const fetchOfflineData = () => {
    return JSON.parse(localStorage.getItem('offlineData') || '[]');
};

// Function to clear offline data from storage
const clearOfflineData = () => {
    localStorage.removeItem('offlineData');
};

const useOfflineSync = () => {
    const saveDataOffline = async (data: any, endpoint: string) => {
        const offlineData = {
            data,
            endpoint,
            timestamp: Date.now(),
        };

        // Save offline data
        try {
            await saveToIndexedDB(offlineData);
            console.log("Data saved offline:", offlineData);
        } catch (error) {
            console.error("Error saving offline data:", error);
        }
    };

    const syncOfflineData = async () => {
        const offlineDataArray = fetchOfflineData();

        if (offlineDataArray.length > 0) {
            for (const offlineData of offlineDataArray) {
                try {
                    const response = await fetch(offlineData.endpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(offlineData.data),
                    });

                    const result = await response.json();
                    console.log("Sync successful:", result);

                    // Clear the offline data after successful sync
                    clearOfflineData();
                } catch (error) {
                    console.error("Sync failed:", error);
                }
            }
        }
    };

    useEffect(() => {
        const handleOnline = () => {
            console.log("Back online! Syncing offline data...");
            syncOfflineData(); // Sync the offline data when online
        };

        window.addEventListener('online', handleOnline);

        // Cleanup the event listener
        return () => {
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    return { saveDataOffline };
};

export default useOfflineSync; // Ensure it's a default export
