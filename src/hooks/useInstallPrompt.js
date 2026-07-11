import { useCallback, useEffect, useState } from "react";
import {
  dismissInstallPrompt,
  isIosSafari,
  isMobileDevice,
  isStandaloneMode,
  wasInstallPromptDismissed,
} from "../utils/pwa.js";

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    if (!isMobileDevice() || isStandaloneMode() || wasInstallPromptDismissed()) {
      return undefined;
    }

    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setVisible(true);
      setIosHint(false);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    if (isIosSafari()) {
      setIosHint(true);
      setVisible(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return false;

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);

    if (choice.outcome === "accepted") {
      dismissInstallPrompt();
    }

    return choice.outcome === "accepted";
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    dismissInstallPrompt();
    setVisible(false);
  }, []);

  return {
    visible,
    iosHint,
    canInstall: Boolean(deferredPrompt),
    install,
    dismiss,
  };
}
