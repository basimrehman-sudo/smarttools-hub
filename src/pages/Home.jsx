import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Activity, 
  FileText, 
  DollarSign, 
  Package, 
  Newspaper, 
  MapPin, 
  Calendar
} from 'lucide-react';
import AdSlot from '../components/common/AdSlot';

const tools = [
  { id: 'speed-test', name: 'Internet Speed Test', icon: <Activity className="w-8 h-8 text-blue-500" />, desc: 'Check your download, upload speed and ping instantly.', path: '/speed-test' },
  { id: 'pdf-tools', name: 'PDF Tools', icon: <FileText className="w-8 h-8 text-red-500" />, desc: 'Convert, merge, split and compress PDF files securely.', path: '/pdf' },
  { id: 'forex', name: 'Live Forex Converter', icon: <DollarSign className="w-8 h-8 text-green-500" />, desc: 'Real-time exchange rates with PKR, USD, AED highlights.', path: '/forex' },
  { id: 'tracker', name: 'Pakistan Parcel Tracker', icon: <Package className="w-8 h-8 text-yellow-500" />, desc: 'Track TCS, Leopards, Pak Post & more universally.', path: '/tracker' },
  { id: 'news', name: 'News Headlines Ticker', icon: <Newspaper className="w-8 h-8 text-purple-500" />, desc: 'Latest breaking news from top Pakistani sources.', path: '/news' },
  { id: 'prayer', name: 'Prayer Timings', icon: <MapPin className="w-8 h-8 text-teal-500" />, desc: 'Auto-location based accurate Islamic prayer times.', path: '/islamic' },
  { id: 'hijri', name: 'Hijri Calendar', icon: <Calendar className="w-8 h-8 text-indigo-500" />, desc: 'Islamic calendar with event highlights and converter.', path: '/islamic' },
];

export default function Home() {
  return (
    <>
      <Helmet>
        <title>SmartTools Hub Pakistan - All-in-One Free Online Utilities</title>
        <meta name="description" content="The fastest free utility platform in Pakistan. Live Forex PKR, TCS/Leopards tracking, breaking news ticker, accurate prayer timings, and secure PDF tools." />
        <meta name="keywords" content="utilities pakistan, tcs tracking pakistan, pkr to usd, live forex pakistan, pdf tools online, ptcl speed test, ptcl internet check, prayer timings karachi, smart tools" />
        <meta property="og:title" content="SmartTools Hub Pakistan - Free Online Utilities" />
        <meta property="og:description" content="Fast, free, and secure online tools optimized for Pakistan. Currency converters, parcel trackers, ptcl speed test, and more." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://smarttoolshub.com/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        {/* Google Discover optimization: Schema Markup */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "SmartTools Hub Pakistan",
              "url": "https://smarttoolshub.com/",
              "description": "All-in-One Free Utility Website in Pakistan featuring package tracking, live currency, internet speed test, and Islamic calendar.",
              "inLanguage": "en-PK",
              "publisher": {
                "@type": "Organization",
                "name": "SmartTools Hub"
              }
            }
          `}
        </script>
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Ad */}
        <div className="mb-8">
          <AdSlot slotId="HEADER_SLOT" />
        </div>

        {/* Hero Section */}
        <section className="text-center py-12 mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--foreground)] mb-4 tracking-tight">
            All the Tools You Need, <span className="text-primary-500">In One Hub</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Access blazing fast utilities from PDF conversion to real-time Forex and localized tracking, completely free and secure.
          </p>
        </section>

        {/* Tools Grid Section */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <Link to={tool.path} key={tool.id} className="block group">
                <div className="g-card p-6 h-full flex flex-col hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                  <div className="mb-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-2xl w-max group-hover:scale-110 transition-transform duration-300">
                    {tool.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm flex-1">{tool.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer Ad */}
        <div className="mt-16">
          <AdSlot slotId="FOOTER_SLOT" />
        </div>
      </div>
    </>
  );
}
