import React, { useEffect, useState } from 'react';

const InstallPWAButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  // Verificar si está en modo standalone (es decir, PWA instalada)
  useEffect(() => {
    const checkStandaloneMode = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true; // iOS soporte para `standalone`
      setIsStandalone(isStandaloneMode);
    };
    checkStandaloneMode();
  }, []);

  // Escuchar el evento `beforeinstallprompt`
  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event); // Guardamos el evento para usarlo después
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Función para mostrar el prompt de instalación (para llamar desde el botón)
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      (deferredPrompt as any).prompt(); // Mostrar el prompt de instalación
      const choiceResult = await (deferredPrompt as any).userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('El usuario aceptó instalar la PWA');
      } else {
        console.log('El usuario rechazó instalar la PWA');
      }
      setDeferredPrompt(null); // Limpiar el evento después de su uso
    }
  };

  // Solo muestra el botón si no está en modo standalone y el prompt está disponible
  if (isStandalone || !deferredPrompt) {
    return null;
  }

  // Renderiza tu botón existente con el evento `onClick` que llama a la función de instalación
  return (
    <div className="buttonsFirst" id="descargaAPKdiv">
      <button id="descargaAPK" onClick={handleInstallClick}>
        Descargar App <img src="../assets/descargaAPK.png" alt="Descarga App" />
      </button>
    </div>
  );
};

export default InstallPWAButton;
