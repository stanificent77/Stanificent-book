// src/components/CustomSplashScreen.tsx
import React, { useEffect } from 'react';
import './CustomSplashScreen.css'; // Create this CSS file for styles

const CustomSplashScreen: React.FC = () => {

  const splash = "/assets/splash.gif";

    useEffect(() => {
        const timer = setTimeout(() => {
            // Hide the splash screen after a delay
            const splashElement = document.getElementById('custom-splash-screen');
            if (splashElement) {
                splashElement.style.display = 'none';
            }
        }, 5000); // Set time for how long the GIF should show

        return () => clearTimeout(timer); // Cleanup the timer
    }, []);

    return (
        <div id="custom-splash-screen" className="splash-screen">
            <img src={splash} alt="Splash" />
        </div>
    );
};

export default CustomSplashScreen;
