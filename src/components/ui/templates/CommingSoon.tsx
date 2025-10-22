"use client";

import React from "react";
import { SiSmart } from "react-icons/si";

// Komponen Ikon SVG untuk logo dan media sosial
const FlowUILogo = () => (
  <div className="flex items-center space-x-3">
    <SiSmart className="h-8 w-8 text-indigo-600" />
    <span className="text-2xl font-bold text-gray-900">SMART SYSTEMS</span>
  </div>
);

const SocialIcons = () => (
  <div className="flex justify-center space-x-6">
    {/* Github */}
    <a
      href="https://github.com/skylann1/himsi-smart-system-updated/tree/development"
      className="text-gray-400 hover:text-gray-600"
    >
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z"
          clipRule="evenodd"
        />
      </svg>
    </a>

    {/* Discord */}
    <a href="https://discord.gg/Pjds3M6w" className="text-gray-400 hover:text-gray-600">
      <svg
        className="h-6 w-6"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.249a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.076.076 0 00-.079-.037 19.736 19.736 0 00-4.885 1.515.069.069 0 00-.032.027C2.22 9.04 1.674 13.58 2.015 18.08a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.077.077 0 00.084-.028 14.124 14.124 0 001.233-1.994.076.076 0 00-.041-.107 13.107 13.107 0 01-1.872-.9.077.077 0 01-.007-.128c.126-.094.253-.192.374-.291a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.099.248.197.374.291a.077.077 0 01-.006.128 12.64 12.64 0 01-1.873.899.076.076 0 00-.04.108c.36.698.767 1.37 1.232 1.993a.076.076 0 00.084.028 19.9 19.9 0 005.994-3.03.078.078 0 00.031-.056c.5-6.21-.838-10.722-3.548-13.685a.06.06 0 00-.031-.028zM8.02 15.331c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.213 0 2.177 1.095 2.157 2.418 0 1.334-.955 2.419-2.157 2.419zm7.974 0c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.213 0 2.177 1.095 2.157 2.418 0 1.334-.944 2.419-2.157 2.419z" />
      </svg>
    </a>
  </div>
);

export default function ComingSoonPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-[#F9FAFB] p-6 text-center font-sans">
      <div className="flex flex-col items-center">
        {/* Logo */}
        <FlowUILogo />

        {/* Coming Soon Text */}
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
          Coming Soon
        </p>
      </div>

      {/* Deskripsi */}
      <p className="mt-8 max-w-xl text-base text-gray-600">
        Waduh maap banget nih broo, kita(
        <span className="font-semibold text-gray-800">divisi pendidikan</span>)
        lagi nyoba ngembangin lebih lanjut fitur ini. stay tuned terus ya!
      </p>

      {/* Form Berlangganan */}
      <div className="mt-12 w-full max-w-md">
        <p className="font-medium text-gray-800">
          Dapatkan notifikasi kalo udah launch!
        </p>
        <form className="mt-4 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="email-address" className="sr-only">
            Email address
          </label>
          <input
            id="email-address"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full flex-grow rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Email address"
          />
          <button
            type="submit"
            className="flex-shrink-0 rounded-md bg-[#111827] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            Subscribe
          </button>
        </form>
      </div>

      {/* Ikon Media Sosial */}
      <div className="mt-16">
        <SocialIcons />
      </div>
    </main>
  );
}
