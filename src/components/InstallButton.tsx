import { useEffect, useState } from 'react';

declare global {
  interface WindowEventMap {
    beforeinstallprompt: any;
  }
}

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check iOS PWA mode
    const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true;
    if (isStandalone) setInstalled(true);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleClick = async () => {
    const confirmMsg = installed
      ? 'App appears to be already installed. Do you want to reinstall it?'
      : 'Do you want to install this app?';

    const confirmed = confirm(confirmMsg);
    if (!confirmed) return;

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('App installed');
      } else {
        console.log('Install dismissed');
      }
      setDeferredPrompt(null); // Only prompt once
    } else {
      alert('Install not supported or already installed. Try using the browser’s install option.');
    }
  };

  const getButtonLabel = () => {
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) return 'iOS Install';
    return installed ? 'Reinstall' : 'Install';
  };

  return (
    <button className="install-button" onClick={handleClick}>
      {getButtonLabel()}
    </button>
  );
};

export default InstallButton;

