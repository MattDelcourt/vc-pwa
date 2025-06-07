import React, { useEffect, useState } from 'react';

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallSupported, setIsInstallSupported] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detect if install is supported
    if (!('onbeforeinstallprompt' in window)) {
      setIsInstallSupported(false);
    }

    const checkInstalled = () => {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as any).standalone === true;
      setIsInstalled(standalone);
    };

    checkInstalled();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleConfirm = async () => {
    setShowPopup(false);

    if (isInstalled) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.unregister();
        }

        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(name => caches.delete(name)));
        }

        localStorage.clear();
        sessionStorage.clear();

        if ('indexedDB' in window) {
          const dbs = await indexedDB.databases();
          for (const db of dbs) {
            if (db.name) indexedDB.deleteDatabase(db.name);
          }
        }

        alert('App reset. Please reload and install again.');
      } catch (error) {
        console.error('Reinstall failed:', error);
        alert('Failed to reset. Check console.');
      }
    } else {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        setDeferredPrompt(null);
      } else {
        alert(
          isIOS && isSafari
            ? 'To install on iOS, tap Share → Add to Home Screen.'
            : 'Install not supported on this device.'
        );
      }
    }
  };

  const handleClick = () => {
    setShowPopup(true);
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  let buttonText = 'Install';

  if (isIOS && isSafari) {
    buttonText = 'iOS Install';
  } else if (isInstalled) {
    buttonText = 'Reinstall';
  }

  return (
    <>
      <button onClick={handleClick} className="install-button">
        {buttonText}
      </button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Confirm {buttonText}</h2>
            {isInstalled && (
              <p style={{ color: 'white' }}>
                You've already installed this app. Reinstalling will reset all local data.
              </p>
            )}
            {!isInstalled && (
              <p style={{ color: 'white' }}>
                This will install the app on your device.
              </p>
            )}
            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={handleConfirm}
                style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  marginRight: '1rem',
                  cursor: 'pointer'
                }}
              >
                Confirm
              </button>
              <button
                onClick={handleCancel}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallButton;

