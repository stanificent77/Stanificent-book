// src/services/apiService.ts
export async function sendToServer(data: any) {
    try {
      const response = await fetch('http://localhost/pos-endpoint/addemployee.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error sending data to server:', error);
      return { success: false, message: 'Sync failed' };
    }
  }
  