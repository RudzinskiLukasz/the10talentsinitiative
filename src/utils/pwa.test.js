import {
  dismissInstallPrompt,
  getDismissKey,
  isIosDevice,
  isMobileDevice,
  wasInstallPromptDismissed,
} from "./pwa.js";

describe("pwa utils", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("detects mobile user agents", () => {
    Object.defineProperty(window.navigator, "userAgent", {
      value: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
      configurable: true,
    });
    expect(isMobileDevice()).toBe(true);
    expect(isIosDevice()).toBe(true);
  });

  it("tracks dismissed install prompts", () => {
    expect(wasInstallPromptDismissed()).toBe(false);
    dismissInstallPrompt();
    expect(wasInstallPromptDismissed()).toBe(true);
    expect(localStorage.getItem(getDismissKey())).toBe("1");
  });
});
