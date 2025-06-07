import React, { useEffect, useState } from 'react';

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
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

    // Detect if install prompt supported
    if (!('onbeforeinstallprompt' in window)) {
      setIsInstallSupported(false);
    }

    // Detect if app is already installed
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

  // Trigger actual install prompt
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      alert(
        isIOS && isSafari
          ? 'To install on iOS, please tap Share → Add to Home Screen.'
          : 'Install not supported on your device.'
      );
    }
  };

  // Reset install status for reinstalling
  const handleReinstallClick = async () => {
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
      console.error('Error resetting app:', error);
      alert('Failed to reset app. Check console.');
    }
  };

  let buttonText = 'Install';

  if (isIOS && isSafari) {
    buttonText = 'iOS Install';
  } else if (isInstalled) {
    buttonText = 'Reinstall';
  } else if (!isInstallSupported) {
    buttonText = 'Install';
  }

  const onClickHandler = isInstalled ? handleReinstallClick : handleInstallClick;

  return (
    <button onClick={onClickHandler} className="install-button">
      {buttonText}
    </button>
  );
};

export default InstallButton;

