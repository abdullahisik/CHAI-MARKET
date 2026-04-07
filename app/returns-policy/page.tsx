import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";

export default function ReturnsPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f8f5ee] text-[#1f2e1f]">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="mb-6 text-4xl font-bold">Returns Policy</h1>
        <div className="rounded bg-white p-8 shadow">
          <p className="leading-8 text-gray-700">
            If there is an issue with your order, please contact us as soon as
            possible. We will review each case and offer replacement, refund or
            support where appropriate.
          </p>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}