import { useEffect, useState } from 'react';

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault(); // Prevent default install prompt
      setDeferredPrompt(e); // Save the event for later
      setShowButton(true); // Show our install button
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    console.log('Install result:', result.outcome);

    setDeferredPrompt(null);
    setShowButton(false); // Hide button after prompt
  };

  if (!showButton) return null;

  return (
    <button onClick={handleInstallClick} className="install-button">
      Install App
    </button>
  );
};

export default InstallButton;
