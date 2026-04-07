import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";

export default function DeliveryInformationPage() {
  return (
    <main className="min-h-screen bg-[#f8f5ee] text-[#1f2e1f]">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="mb-6 text-4xl font-bold">Delivery Information</h1>
        <div className="rounded bg-white p-8 shadow">
          <p className="leading-8 text-gray-700">
            Orders under £75 include a £4.99 delivery charge. Orders above £75
            qualify for free delivery. Delivery times may vary by location.
          </p>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}