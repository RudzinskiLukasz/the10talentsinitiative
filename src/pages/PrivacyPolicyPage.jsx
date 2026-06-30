import PageHeader from "../components/PageHeader.jsx";
import ProseContent from "../components/ProseContent.jsx";
import { privacyPolicy } from "../data/policies.js";

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader title="Privacy Policy" />
      <section className="mx-auto max-w-3xl px-5 pb-20 sm:px-8">
        <ProseContent content={privacyPolicy.split("\n")} />
      </section>
    </>
  );
}
