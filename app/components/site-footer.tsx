"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SettingsData = {
  social?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    whatsapp?: string;
  };
};

export default function SiteFooter() {
  const [settings, setSettings] = useState<SettingsData>({
    social: {
      instagram: "",
      facebook: "",
      tiktok: "",
      whatsapp: "",
    },
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();

        setSettings(
          data || {
            social: {
              instagram: "",
              facebook: "",
              tiktok: "",
              whatsapp: "",
            },
          }
        );
      } catch {
        setSettings({
          social: {
            instagram: "",
            facebook: "",
            tiktok: "",
            whatsapp: "",
          },
        });
      }
    };

    loadSettings();
  }, []);

  const social = settings.social || {};

  return (
    <footer className="bg-[#102418] px-6 py-14 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div>
          <h3 className="mb-4 text-xl font-bold text-[#d4af37]">CHAI MARKET</h3>
          <p className="text-sm text-gray-300">
            Wholesale & retail food products across Manchester and the UK.
          </p>
        </div>

        <div>
          <h4 className="mb-4 font-bold">Information</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/delivery-information">Delivery Information</Link>
            </li>
            <li>
              <Link href="/returns-policy">Returns Policy</Link>
            </li>
            <li>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms-conditions">Terms & Conditions</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link href="/contact">Contact Us</Link>
            </li>
            <li>Manchester, UK</li>
            <li>Phone: +44 ...</li>
            <li>Email: info@chaimarket.co.uk</li>
            <li>WhatsApp orders available</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-bold">Social Media</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              {social.instagram ? (
                <a href={social.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              ) : (
                "Instagram"
              )}
            </li>
            <li>
              {social.facebook ? (
                <a href={social.facebook} target="_blank" rel="noreferrer">
                  Facebook
                </a>
              ) : (
                "Facebook"
              )}
            </li>
            <li>
              {social.tiktok ? (
                <a href={social.tiktok} target="_blank" rel="noreferrer">
                  TikTok
                </a>
              ) : (
                "TikTok"
              )}
            </li>
            <li>
              {social.whatsapp ? (
                <a href={social.whatsapp} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              ) : (
                "WhatsApp"
              )}
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/20 pt-6 text-sm text-gray-400">
        © 2026 CHAI MARKET. All rights reserved.
      </div>
    </footer>
  );
}