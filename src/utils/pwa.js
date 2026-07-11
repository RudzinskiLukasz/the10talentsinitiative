const DISMISS_KEY = "ttt-pwa-dismissed";

export function getDismissKey() {
  return DISMISS_KEY;
}

export function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

export function isMobileDevice() {
  if (typeof window === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(window.navigator.userAgent);
}

export function isIosDevice() {
  if (typeof window === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(window.navigator.userAgent);
}

export function isIosSafari() {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  return isIosDevice() && /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS/i.test(ua);
}

export function wasInstallPromptDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

export function dismissInstallPrompt() {
  try {
    localStorage.setItem(DISMISS_KEY, "1");
  } catch {
    /* ignore */
  }
}
