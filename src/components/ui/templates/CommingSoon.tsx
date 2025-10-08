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
    {/* Twitter */}
    <a href="#" className="text-gray-400 hover:text-gray-600">
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
    </a>
    {/* Github */}
    <a href="#" className="text-gray-400 hover:text-gray-600">
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" /></svg>
    </a>
    {/* Facebook */}
    <a href="#" className="text-gray-400 hover:text-gray-600">
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
    </a>
    {/* Dribbble */}
    <a href="#" className="text-gray-400 hover:text-gray-600">
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.762-3.362zM12 3.475c2.17 0 4.154.872 5.614 2.318-.219.232-1.04 1.06-2.83 2.295-.3-1.153-.536-2.424-.666-3.662a8.521 8.521 0 00-2.118-.01zM4.467 12.542a8.571 8.571 0 007.533 7.533c-3.37-.252-6.494-2.13-8.008-4.949a8.45 8.45 0 01.475-2.584zM12 20.525c-2.17 0-4.154-.872-5.614-2.318.219-.232 1.04-1.06 2.83-2.295.3 1.153.536 2.424.666 3.662a8.521 8.521 0 002.118.01z" clipRule="evenodd" /></svg>
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
        Waduh maap banget nih broo, kita(<span className="font-semibold text-gray-800">divisi pendidikan</span>) lagi nyoba ngembangin lebih lanjut fitur ini. stay tuned terus ya!
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
