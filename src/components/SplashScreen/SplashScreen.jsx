import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onLoadComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Minimum display time of 1.5 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);
      // Wait for fade animation then call onLoadComplete
      setTimeout(() => {
        onLoadComplete();
      }, 500);
    }, 1500);

    return () => clearTimeout(timer);
  }, [onLoadComplete]);

  return (
    <div className={`splash-screen ${fadeOut ? 'splash-screen--fade-out' : ''}`}>
      <div className="splash-screen__content">
        <img
          src="https://res.cloudinary.com/duaz5kg1m/image/upload/v1775406211/logo_p6u2km.png"
          alt="Shining Star English School"
          className="splash-screen__logo"
        />
        <h1 className="splash-screen__title">Shining Star</h1>
        <p className="splash-screen__subtitle">English School</p>
        <div className="splash-screen__loader">
          <div className="splash-screen__spinner"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
