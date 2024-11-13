import React, { useState } from 'react';
import {  useHistory } from 'react-router-dom';
import { IonButton, IonLoading } from '@ionic/react';
import { useSession } from '../hooks/useSession';

const Logout: React.FC = () => {
  const history =  useHistory();
  const { logout, isAuthenticated } = useSession();
  const [showLoading, setShowLoading] = useState(false);

  const end = () => {
    if(navigator.onLine){
    setShowLoading(true); // Show loading
    setTimeout(() => {
      isAuthenticated
      logout(); // Perform logout
      setShowLoading(false); // Hide loading
      history.push('/login'); // Redirect to login
    }, 100); // Simulate some delay for the loading effect
  }else{
    sessionStorage.removeItem("session_token");
    sessionStorage.removeItem("userInfo");
    // Redirect to the login page after logout
    history.push("/login");
  }
  };

  return (
    <>
      <IonButton onClick={end} color="danger">
        Logout
      </IonButton>
      <IonLoading
        isOpen={showLoading} // Control visibility using state
        message="Logging out..."
        duration={2000} // Show for 2 seconds
      />
    </>
  );
};

export default Logout;
