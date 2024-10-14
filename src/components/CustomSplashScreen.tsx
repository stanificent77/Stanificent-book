import React, { useEffect, useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { SplashScreen } from '@capacitor/splash-screen';
import './CustomSplashScreen.css';

const CustomSplashScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hideSplashScreen = () => {
      // Set a timer to hide the custom splash screen after the app is ready
      setTimeout(() => {
        setIsVisible(false);
        SplashScreen.hide(); // Hide Capacitor's default splash screen if needed
      }, 3000); // Adjust the duration to match your GIF length
    };

    hideSplashScreen();
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <IonPage>
      <IonContent className="custom-splash-content">
        <div className='gif-cont'>
          <img src="resources/splash.gif" alt="Splash Screen" className="splash-gif" />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CustomSplashScreen;
