/** Bank and payment gateway config — env vars override these public defaults. */

const DEFAULT_ACCOUNT_NAME = "THE TEN TALENT HUMANITARIAN INITIATIVE";
const DEFAULT_ACCOUNT_NUMBER = "1312265547";

export const donationBankConfig = {
  accountName:
    import.meta.env.VITE_ZENITH_ACCOUNT_NAME?.trim() || DEFAULT_ACCOUNT_NAME,
  accountNumber:
    import.meta.env.VITE_ZENITH_ACCOUNT_NUMBER?.trim() || DEFAULT_ACCOUNT_NUMBER,
  bankName: import.meta.env.VITE_ZENITH_BANK_NAME?.trim() || "Zenith Bank",
  sortCode: import.meta.env.VITE_ZENITH_SORT_CODE?.trim() || "",
};

export const paystackPublicKey =
  import.meta.env.VITE_PAYSTACK_PUBLIC_KEY?.trim() || "";

export const flutterwavePublicKey =
  import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY?.trim() || "";

export function hasConfiguredBankDetails() {
  return Boolean(donationBankConfig.accountNumber);
}

export function hasPaystackPayments() {
  return Boolean(paystackPublicKey);
}
