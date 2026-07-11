import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import InstallPrompt from "./InstallPrompt.jsx";
import i18n from "../i18n/index.js";
import * as pwa from "../utils/pwa.js";

function renderPrompt() {
  return render(
    <I18nextProvider i18n={i18n}>
      <InstallPrompt />
    </I18nextProvider>
  );
}

describe("InstallPrompt", () => {
  beforeEach(() => {
    localStorage.clear();
    i18n.changeLanguage("en");
    vi.spyOn(pwa, "isMobileDevice").mockReturnValue(true);
    vi.spyOn(pwa, "isStandaloneMode").mockReturnValue(false);
    vi.spyOn(pwa, "wasInstallPromptDismissed").mockReturnValue(false);
    vi.spyOn(pwa, "isIosSafari").mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows the install banner after beforeinstallprompt on mobile", async () => {
    renderPrompt();

    await act(async () => {
      const event = new Event("beforeinstallprompt", { cancelable: true });
      event.prompt = vi.fn().mockResolvedValue(undefined);
      event.userChoice = Promise.resolve({ outcome: "accepted" });
      window.dispatchEvent(event);
    });

    expect(
      await screen.findByRole("dialog", { name: i18n.t("pwa.installTitle") })
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t("pwa.installBody"))).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: i18n.t("pwa.installAction") })
    ).toBeInTheDocument();
  });

  it("dismisses the banner and remembers the choice", async () => {
    const user = userEvent.setup();
    vi.spyOn(pwa, "isIosSafari").mockReturnValue(true);
    renderPrompt();

    await user.click(screen.getByRole("button", { name: i18n.t("pwa.dismiss") }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(localStorage.getItem(pwa.getDismissKey())).toBe("1");
  });

  it("does not render when the app is already installed", () => {
    vi.spyOn(pwa, "isStandaloneMode").mockReturnValue(true);
    renderPrompt();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
