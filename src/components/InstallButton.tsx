import { useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      console.log('beforeinstallprompt fired');
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      console.log('App installed');
      setInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('beforeinstallprompt', () => {
      console.log('✅ beforeinstallprompt event fired');
    });

    // Check if app is running in standalone (PWA) mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      console.log('Running in standalone mode');
      setInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleClick = async () => {
    const confirmMsg = installed
      ? 'The app appears to be already installed. Do you want to reinstall it?'
      : 'Do you want to install this app?';

    const confirmed = window.confirm(confirmMsg);
    if (!confirmed) return;

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      console.log('UserChoice:', result);
      if (result.outcome === 'accepted') {
        alert('App installed successfully!');
        setInstalled(true);
      } else {
        alert('Install was dismissed.');
      }
      setDeferredPrompt(null); // Clean up
    } else {
      alert('Install prompt not available. Try using your browser’s install option.');
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
