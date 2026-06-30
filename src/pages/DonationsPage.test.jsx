import { screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import DonationsPage from "./DonationsPage.jsx";
import { renderWithI18n, i18n } from "../test/i18n.jsx";

const mockDonations = vi.hoisted(() => ({
  donationBankConfig: {
    accountName: "The Ten Talents Humanitarian Initiative",
    accountNumber: "",
    bankName: "Zenith Bank",
    sortCode: "",
  },
  hasConfiguredBankDetails: vi.fn(() => false),
  hasPaystackPayments: vi.fn(() => false),
  paystackPublicKey: "",
}));

vi.mock("../data/donations.js", () => mockDonations);

describe("DonationsPage", () => {
  beforeEach(() => {
    i18n.changeLanguage("en");
    mockDonations.hasConfiguredBankDetails.mockReturnValue(false);
    mockDonations.hasPaystackPayments.mockReturnValue(false);
    mockDonations.donationBankConfig.accountNumber = "";
  });

  it("renders bank transfer section", () => {
    renderWithI18n(<DonationsPage />);

    expect(
      screen.getByRole("heading", { name: i18n.t("donationsPage.bankTransfer.title") })
    ).toBeInTheDocument();
    expect(screen.getByText(i18n.t("donationsPage.bankTransfer.instructions"))).toBeInTheDocument();
  });

  it("shows contact message when bank account number is not configured", () => {
    renderWithI18n(<DonationsPage />);

    expect(screen.getByText(i18n.t("donationsPage.bankTransfer.contactForDetails"), { exact: false })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: i18n.t("donationsPage.bankTransfer.contactLink") })).toHaveAttribute("href", "/contact");
  });

  it("shows account details when bank account number is configured", () => {
    mockDonations.hasConfiguredBankDetails.mockReturnValue(true);
    mockDonations.donationBankConfig.accountNumber = "0123456789";

    renderWithI18n(<DonationsPage />);

    expect(screen.getByText("0123456789")).toBeInTheDocument();
    expect(screen.getByText("Zenith Bank")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: i18n.t("donationsPage.bankTransfer.copyAccountNumber") })
    ).toBeInTheDocument();
  });

  it("shows online payment coming soon when Paystack is not configured", () => {
    renderWithI18n(<DonationsPage />);

    expect(screen.getByText(i18n.t("donationsPage.onlinePayment.comingSoon"))).toBeInTheDocument();
  });
});
