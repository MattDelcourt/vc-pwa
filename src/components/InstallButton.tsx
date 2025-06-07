import { useEffect, useState } from 'react';

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const checkInstallStatus = async () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;

      // Hide button if running standalone
      if (!isStandalone) {
        console.log('App not installed or running in browser');
        setShowButton(true);
      } else {
        console.log('App is installed (standalone mode)');
        setShowButton(false);
      }
    };

    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      console.log('beforeinstallprompt fired');
      setDeferredPrompt(e);
      checkInstallStatus();
    });

    // Run on load in case app was uninstalled
    checkInstallStatus();

    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    console.log('Install result:', result.outcome);

    setDeferredPrompt(null);
    setShowButton(false); // Hide after installation
  };

  if (!showButton || !deferredPrompt) return null;

  return (
    <button onClick={handleInstallClick} className="install-button">
      Install App
    </button>
  );
};

export default InstallButton;
