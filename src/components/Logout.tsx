import React from 'react';
import { useHistory } from 'react-router-dom';
import { IonButton } from '@ionic/react';

const Logout: React.FC = () => {
  const history = useHistory();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost/pos-endpoint/logout.php', {
        method: 'POST',   // or 'GET' if you're using GET for logout
        credentials: 'include',  // Send cookies and session data
      });
  
      const data = await response.json();
  
      if (data.success) {
        // Clear local session data (if any)
        localStorage.removeItem('session_token');
        sessionStorage.removeItem('session_token');

        localStorage.removeItem('userInfo');
        sessionStorage.removeItem('userInfo');
        
        // Redirect the user to the login page
        history.push('/login');
      } else {
        console.error('Logout failed:', data.message);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  return (
    <IonButton onClick={handleLogout} color="danger">
      Logout
    </IonButton>
  );
};

export default Logout;
