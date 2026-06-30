import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { donationFailedPage } from "../data/content.js";

export default function DonationFailedPage() {
  return (
    <>
      <PageHeader title={donationFailedPage.title} description={donationFailedPage.body} />
      <section className="mx-auto max-w-3xl px-5 pb-20 text-center sm:px-8">
        <Link
          to="/donations"
          className="inline-flex rounded-full bg-cta px-7 py-3 text-sm font-bold text-on-cta transition hover:bg-cta-hover"
        >
          Try again
        </Link>
      </section>
    </>
  );
}
