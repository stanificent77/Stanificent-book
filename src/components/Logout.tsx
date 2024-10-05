import React from 'react';
import { useHistory } from 'react-router-dom';
import { IonButton } from '@ionic/react';

const Logout: React.FC = () => {
  const history = useHistory();

  const handleLogout = () => {
    // Clear user info from localStorage or sessionStorage
    localStorage.removeItem('userInfo');
    sessionStorage.removeItem('userInfo');

    // Redirect to login page
    history.push('/login');
  };

  return (
    <IonButton onClick={handleLogout} color="danger">
      Logout
    </IonButton>
  );
};

export default Logout;
