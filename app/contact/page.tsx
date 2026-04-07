import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f8f5ee] text-[#1f2e1f]">
      <SiteHeader />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="mb-6 text-4xl font-bold">Contact Us</h1>
        <div className="rounded bg-white p-8 shadow">
          <div className="space-y-3 text-gray-700">
            <p>Manchester, UK</p>
            <p>Phone: +44 ...</p>
            <p>Email: info@chaimarket.co.uk</p>
            <p>WhatsApp orders available</p>
          </div>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}