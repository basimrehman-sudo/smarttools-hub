import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Newspaper, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import axios from 'axios';
import AdSlot from '../components/common/AdSlot';

const SOURCES = [
  { id: 'geo', name: 'Geo News', url: 'https://www.geo.tv/rss/1/53' },
  { id: 'express', name: 'Express Tribune', url: 'https://tribune.com.pk/feed/home' },
  { id: 'dawn', name: 'Dawn News', url: 'https://www.dawn.com/feeds/home/' }
];

export default function News() {
  const [activeSource, setActiveSource] = useState(SOURCES[0]);
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNews = async (source) => {
    setIsLoading(true);
    setError('');
    try {
      const RSS2JSON_API = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(source.url)}`;
      const res = await axios.get(RSS2JSON_API);
      if (res.data.status === 'ok') {
        setNews(res.data.items);
      } else {
        setError('Failed to load news feed. It might be rate-limited.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching the news.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(activeSource);
    
    // Auto refresh every 5 minutes (300000 ms)
    const interval = setInterval(() => {
      fetchNews(activeSource);
    }, 300000);
    
    return () => clearInterval(interval);
  }, [activeSource]);

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <Helmet>
        <title>Breaking News Pakistan: Geo News & Dawn Live Ticker</title>
        <meta name="description" content="Live breaking news ticker from top Pakistani sources like Geo News, Dawn, and Express Tribune. Stay updated with the latest headlines." />
        <meta name="keywords" content="geo news live, ary news breaking, dawn news headlines, pakistan news today, top stories pakistan, urdu news headlines" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Pakistan News Headlines",
              "description": "Live breaking news ticker from top Pakistani news outlets."
            }
          `}
        </script>
      </Helmet>

      {/* Marquee Animation Styles */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-flex;
          white-space: nowrap;
          animation: marquee 45s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="mb-6"><AdSlot slotId="NEWS_TOP" /></div>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Newspaper className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              Pakistan News Headlines
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Live, auto-updating breaking news ticker.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <select 
              value={activeSource.id}
              onChange={(e) => setActiveSource(SOURCES.find(s => s.id === e.target.value))}
              className="bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] rounded-lg px-4 py-2 outline-none focus:border-primary-500"
            >
              {SOURCES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <button 
              onClick={() => fetchNews(activeSource)}
              disabled={isLoading}
              className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title="Refresh News"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* The Live Ticker Strip */}
        <div className="g-card bg-white dark:bg-gray-900 border-l-4 border-l-red-600 overflow-hidden relative flex items-center mb-8 h-16">
          <div className="bg-red-600 text-white font-bold px-4 py-5 z-10 hidden sm:flex items-center shadow-lg h-full uppercase tracking-wider text-sm flex-shrink-0">
            <AlertCircle className="w-4 h-4 mr-2" /> BREAKING
          </div>
          
          <div className="flex-1 overflow-hidden h-full flex items-center">
            {error ? (
              <span className="text-red-500 px-4">{error}</span>
            ) : isLoading && news.length === 0 ? (
              <span className="text-gray-500 px-4 animate-pulse">Loading latest headlines...</span>
            ) : (
              <div className="animate-marquee w-full gap-8 pl-full">
                {news.map((item, index) => {
                  const isBreaking = index < 3; // Highlight first 3 as breaking
                  return (
                    <a 
                      key={index} 
                      href={item.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center hover:underline"
                    >
                      <span className={`w-2 h-2 rounded-full mr-3 ${isBreaking ? 'bg-red-500 animate-pulse' : 'bg-primary-500'}`}></span>
                      <span className={`text-lg font-medium ${isBreaking ? 'text-red-600 dark:text-red-400 font-bold' : 'text-[var(--foreground)]'}`}>
                        {item.title}
                      </span>
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Detailed News Grid */}
        <div>
          <h2 className="text-xl font-bold mb-6 border-b border-[var(--border)] pb-2">Latest Stories</h2>
          {isLoading && news.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="g-card p-4 animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 h-40 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-6 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item, index) => (
                <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="block group">
                  <div className="g-card h-full flex flex-col hover:border-primary-400 transition-colors">
                    {item.thumbnail || item.enclosure?.link ? (
                      <div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img 
                          src={item.thumbnail || item.enclosure?.link} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                        />
                      </div>
                    ) : (
                       <div className="h-2 bg-gradient-to-r from-primary-500 to-purple-500"></div>
                    )}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-primary-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm flex-1 line-clamp-3 mb-4 flex-grow-0">
                        {item.description ? item.description.replace(/(<([^>]+)>)/gi, "") : 'Click to read full story.'}
                      </p>
                      <div className="mt-auto flex justify-between items-center text-xs text-gray-400">
                         <span>{new Date(item.pubDate).toLocaleString()}</span>
                         <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 text-primary-500" />
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12"><AdSlot slotId="NEWS_BOTTOM" /></div>
      </div>
    </div>
  );
}
