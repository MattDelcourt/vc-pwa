import { useEffect, useState } from 'react';

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const checkInstallStatus = () => {
      const standalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as any).standalone === true;
      setIsInstalled(standalone);
    };

    checkInstallStatus();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    setShowPopup(true);
  };

  const confirmInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    }
    setShowPopup(false);
  };

  const cancelInstall = () => {
    setShowPopup(false);
  };

  return (
    <>
      <button onClick={handleInstallClick} className="install-button">
        Install App
      </button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p>Do you want to install this app?</p>
            {isInstalled && (
              <p style={{ color: 'red' }}>
                It looks like you've already installed this app.
              </p>
            )}
            <div style={{ marginTop: '1rem' }}>
              <button onClick={confirmInstall} disabled={!deferredPrompt}>
                Yes, Install
              </button>
              <button onClick={cancelInstall} style={{ marginLeft: '0.5rem' }}>
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
