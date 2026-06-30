import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageHeader from "../components/PageHeader.jsx";
import Reveal from "../components/Reveal.jsx";
import {
  donationBankConfig,
  hasConfiguredBankDetails,
  hasPaystackPayments,
  paystackPublicKey,
} from "../data/donations.js";

const MIN_NGN = 100;

function formatNgn(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function DonationsPage() {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isPaying, setIsPaying] = useState(false);

  const bankReady = hasConfiguredBankDetails();
  const paystackReady = hasPaystackPayments();

  async function handleCopyAccountNumber() {
    if (!donationBankConfig.accountNumber) return;
    try {
      await navigator.clipboard.writeText(donationBankConfig.accountNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function handleDonate(event) {
    event.preventDefault();
    if (!paystackReady) return;

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount < MIN_NGN) return;
    if (!email.trim()) return;

    setPaymentStatus(null);
    setIsPaying(true);

    try {
      const { default: PaystackPop } = await import("@paystack/inline-js");
      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: paystackPublicKey,
        email: email.trim(),
        amount: Math.round(parsedAmount * 100),
        currency: "NGN",
        metadata: {
          purpose: "donation",
          donor_name: name.trim() || undefined,
        },
        onSuccess: () => {
          setPaymentStatus("success");
          setAmount("");
          setIsPaying(false);
        },
        onCancel: () => {
          setPaymentStatus("cancelled");
          setIsPaying(false);
        },
      });
    } catch {
      setPaymentStatus("cancelled");
      setIsPaying(false);
    }
  }

  const parsedAmount = Number(amount);
  const amountValid =
    Number.isFinite(parsedAmount) && parsedAmount >= MIN_NGN;

  return (
    <>
      <PageHeader
        title={t("donationsPage.title")}
        description={t("donationsPage.intro")}
      />

      <section className="mx-auto max-w-4xl space-y-8 px-5 pb-20 sm:px-8">
        <Reveal className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <h2 className="font-display text-xl font-semibold text-fg sm:text-2xl">
            {t("donationsPage.bankTransfer.title")}
          </h2>
          <p className="mt-2 text-sm text-fg-muted sm:text-base">
            {t("donationsPage.bankTransfer.subtitle")}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-fg-muted">
            {t("donationsPage.bankTransfer.instructions")}
          </p>

          {bankReady ? (
            <dl className="mt-6 space-y-4 rounded-xl border border-border-subtle bg-bg/60 p-5">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
                  {t("donationsPage.bankTransfer.accountNameLabel")}
                </dt>
                <dd className="mt-1 font-medium text-fg">
                  {donationBankConfig.accountName}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
                  {t("donationsPage.bankTransfer.bankNameLabel")}
                </dt>
                <dd className="mt-1 font-medium text-fg">
                  {donationBankConfig.bankName}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
                  {t("donationsPage.bankTransfer.accountNumberLabel")}
                </dt>
                <dd className="mt-1 flex flex-wrap items-center gap-3">
                  <span className="font-mono text-lg font-semibold tracking-wide text-fg">
                    {donationBankConfig.accountNumber}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyAccountNumber}
                    className="rounded-full border border-border-strong bg-surface px-4 py-1.5 text-xs font-semibold text-fg transition hover:bg-surface-hover"
                  >
                    {copied
                      ? t("donationsPage.bankTransfer.copied")
                      : t("donationsPage.bankTransfer.copyAccountNumber")}
                  </button>
                </dd>
              </div>
              {donationBankConfig.sortCode ? (
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
                    {t("donationsPage.bankTransfer.sortCodeLabel")}
                  </dt>
                  <dd className="mt-1 font-mono font-medium text-fg">
                    {donationBankConfig.sortCode}
                  </dd>
                </div>
              ) : null}
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-fg-subtle">
                  {t("donationsPage.bankTransfer.referenceLabel")}
                </dt>
                <dd className="mt-1 text-sm text-fg-muted">
                  {t("donationsPage.bankTransfer.referenceHint")}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="mt-6 text-sm text-fg-muted">
              {t("donationsPage.bankTransfer.contactForDetails")}{" "}
              <Link
                to="/contact"
                className="font-semibold text-accent underline-offset-2 hover:underline"
              >
                {t("donationsPage.bankTransfer.contactLink")}
              </Link>
              .
            </p>
          )}
        </Reveal>

        <Reveal delay={80} className="rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <h2 className="font-display text-xl font-semibold text-fg sm:text-2xl">
            {t("donationsPage.onlinePayment.title")}
          </h2>
          <p className="mt-2 text-sm text-fg-muted sm:text-base">
            {t("donationsPage.onlinePayment.subtitle")}
          </p>

          {paystackReady ? (
            <form onSubmit={handleDonate} className="mt-6 space-y-5">
              <label className="block">
                <span className="text-sm font-medium text-fg">
                  {t("donationsPage.onlinePayment.amountLabel")}
                </span>
                <input
                  type="number"
                  min={MIN_NGN}
                  step="1"
                  required
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder={String(MIN_NGN)}
                  className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring transition focus:ring-2"
                />
                <span className="mt-2 block text-xs text-fg-subtle">
                  {t("donationsPage.onlinePayment.amountHint")}
                  {amountValid ? ` (${formatNgn(parsedAmount)})` : null}
                </span>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-fg">
                  {t("common.name")}
                </span>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring transition focus:ring-2"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-fg">
                  {t("donationsPage.onlinePayment.emailLabel")}{" "}
                  <span className="text-accent">{t("common.required")}</span>
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg outline-none ring-ring transition focus:ring-2"
                />
              </label>

              <button
                type="submit"
                disabled={isPaying || !amountValid}
                className="rounded-full bg-accent px-8 py-3 text-sm font-semibold text-accent-fg transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPaying
                  ? t("donationsPage.onlinePayment.processing")
                  : t("donationsPage.onlinePayment.donateNow")}
              </button>

              {paymentStatus === "success" ? (
                <p className="rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-fg">
                  {t("donationsPage.onlinePayment.success")}
                </p>
              ) : null}
              {paymentStatus === "cancelled" ? (
                <p className="rounded-xl border border-border bg-bg px-4 py-3 text-sm text-fg-muted">
                  {t("donationsPage.onlinePayment.cancelled")}
                </p>
              ) : null}
            </form>
          ) : (
            <p className="mt-6 rounded-xl border border-border-subtle bg-bg/60 px-4 py-3 text-sm text-fg-muted">
              {t("donationsPage.onlinePayment.comingSoon")}
            </p>
          )}
        </Reveal>

        <Reveal delay={120}>
          <p className="text-center text-xs leading-relaxed text-fg-subtle sm:text-sm">
            {t("donationsPage.trustNote")}
          </p>
        </Reveal>
      </section>
    </>
  );
}
