import PageHeader from "../components/PageHeader.jsx";
import ProseContent from "../components/ProseContent.jsx";
import { cookiePolicy } from "../data/policies.js";

export default function CookiePolicyPage() {
  return (
    <>
      <PageHeader title="Cookie Policy (EU)" />
      <section className="mx-auto max-w-3xl px-5 pb-20 sm:px-8">
        <ProseContent content={cookiePolicy.split("\n")} />
      </section>
    </>
  );
}
