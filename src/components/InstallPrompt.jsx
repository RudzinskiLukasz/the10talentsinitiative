import { useTranslation } from "react-i18next";
import { useInstallPrompt } from "../hooks/useInstallPrompt.js";

export default function InstallPrompt() {
  const { t } = useTranslation();
  const { visible, iosHint, canInstall, install, dismiss } = useInstallPrompt();

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="pwa-install-title"
      aria-describedby="pwa-install-body"
      className="fixed inset-x-0 bottom-0 z-[70] border-t border-border bg-surface-nav/95 px-4 py-4 shadow-[0_-12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:px-6"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p
            id="pwa-install-title"
            className="font-display text-base font-semibold text-fg sm:text-lg"
          >
            {t("pwa.installTitle")}
          </p>
          <p id="pwa-install-body" className="mt-1 text-sm leading-relaxed text-fg-muted">
            {iosHint && !canInstall ? t("pwa.iosHint") : t("pwa.installBody")}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {canInstall ? (
            <button
              type="button"
              onClick={install}
              className="rounded-full bg-cta px-5 py-2.5 text-sm font-bold text-on-cta transition hover:bg-cta-hover"
            >
              {t("pwa.installAction")}
            </button>
          ) : null}
          <button
            type="button"
            onClick={dismiss}
            className="rounded-full border border-border-strong bg-surface px-5 py-2.5 text-sm font-semibold text-fg transition hover:bg-surface-hover"
          >
            {t("pwa.dismiss")}
          </button>
        </div>
      </div>
    </div>
  );
}
