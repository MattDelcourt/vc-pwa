import { useEffect, useState } from 'react';

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallSupported, setIsInstallSupported] = useState(true);

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (!('onbeforeinstallprompt' in window)) {
      setIsInstallSupported(false);
    }

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

            {!isInstallSupported && (
              <p style={{ color: 'orange' }}>
                Your device or browser doesn’t support automatic installation.
              </p>
            )}

            {isIOS && isSafari && (
              <p>
                On iOS, tap the <strong>Share</strong> button, then choose{" "}
                <strong>"Add to Home Screen"</strong>.
              </p>
            )}

            <div style={{ marginTop: '1rem' }}>
              <button onClick={confirmInstall} >
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
