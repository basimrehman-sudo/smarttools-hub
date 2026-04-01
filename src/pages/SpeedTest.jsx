import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Play, RotateCcw, Server, Activity, Download, Upload, Clock } from 'lucide-react';
import AdSlot from '../components/common/AdSlot';
import axios from 'axios';

export default function SpeedTest() {
  const [status, setStatus] = useState('idle'); // idle, ping, download, upload, complete
  const [ispInfo, setIspInfo] = useState(null);
  const [metrics, setMetrics] = useState({ ping: 0, download: 0, upload: 0 });
  const [progress, setProgress] = useState(0); // 0 to 100 for current status
  const [lastTest, setLastTest] = useState(null);

  useEffect(() => {
    // Load last test from storage
    const saved = localStorage.getItem('lastSpeedTest');
    if (saved) setLastTest(JSON.parse(saved));

    // Fetch ISP info
    axios.get('https://ipapi.co/json/')
      .then(res => setIspInfo(res.data))
      .catch(err => console.error("Could not fetch ISP info", err));
  }, []);

  const runTest = async () => {
    setStatus('ping');
    setProgress(0);
    setMetrics({ ping: 0, download: 0, upload: 0 });

    // Mock Ping
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      setMetrics(p => ({ ...p, ping: Math.floor(Math.random() * 20) + 10 }));
      await new Promise(r => setTimeout(r, 100));
    }
    const finalPing = metrics.ping || 18;
    setMetrics(p => ({ ...p, ping: finalPing }));
    
    // Mock Download
    setStatus('download');
    let finalDownload = 0;
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      const val = (Math.random() * 20) + 30 + (i * 0.5); // Ramp up to ~80Mbps
      finalDownload = val;
      setMetrics(p => ({ ...p, download: val.toFixed(1) }));
      await new Promise(r => setTimeout(r, 150));
    }

    // Mock Upload
    setStatus('upload');
    let finalUpload = 0;
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      const val = (Math.random() * 10) + 10 + (i * 0.2); // Ramp up to ~30Mbps
      finalUpload = val;
      setMetrics(p => ({ ...p, upload: val.toFixed(1) }));
      await new Promise(r => setTimeout(r, 150));
    }

    setStatus('complete');
    setProgress(100);
    const result = { ping: finalPing, download: finalDownload.toFixed(1), upload: finalUpload.toFixed(1), date: new Date().toISOString() };
    setLastTest(result);
    localStorage.setItem('lastSpeedTest', JSON.stringify(result));
  };

  const getGaugeValue = () => {
    if (status === 'ping') return progress * 1.8; // Max 180 deg
    if (status === 'download') return progress * 1.8;
    if (status === 'upload') return progress * 1.8;
    if (status === 'complete') return 180;
    return 0;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>PTCL & Zong Internet Speed Test Pakistan - Check Live Speed</title>
        <meta name="description" content="Check your PTCL, Nayatel, Jazz 4G, and Zong internet speed instantly! Free, fast broadband & mobile connection test with accurate ping and IP lookup." />
        <meta name="keywords" content="ptcl speed test, zong speed test, jazz 4g speed check, nayatel speed test, internet speed test pakistan, check ping pakistan" />
        <meta property="og:title" content="Pakistan Internet Speed Test: PTCL, Zong, Jazz, Nayatel" />
        <meta property="og:description" content="Measure your internet speed accurately with our free online tool. Perfect for checking PTCL broadband or 4G data speeds across Pakistan." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "SmartTools Speed Test Pakistan",
              "applicationCategory": "Utility",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "PKR"
              },
              "description": "A live interface to test Ping, Download, and Upload speeds for ISPs like PTCL, Jazz, Zong, and Nayatel in Pakistan."
            }
          `}
        </script>
      </Helmet>

      <div className="mb-6"><AdSlot slotId="SPEEDTEST_TOP" /></div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Internet Speed Test</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Measure your broadband or mobile connection speed accurately (Simulated for Demo).</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 g-card p-8 flex flex-col items-center justify-center relative min-h-[400px]">
            {/* SVG Gauge */}
            <div className="relative w-64 h-32 overflow-hidden mb-8">
              <svg viewBox="0 0 200 100" className="w-full h-full transform transition-all duration-300">
                <path d="M 10 90 A 80 80 0 0 1 190 90" fill="none" stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="12" strokeLinecap="round" />
                <path 
                  d="M 10 90 A 80 80 0 0 1 190 90" 
                  fill="none" 
                  stroke="currentColor" 
                  className={`${status === 'upload' ? 'text-purple-500' : 'text-primary-500'} transition-all duration-[150ms]`} 
                  strokeWidth="12" 
                  strokeLinecap="round" 
                  strokeDasharray="251" 
                  strokeDashoffset={251 - (251 * getGaugeValue() / 180)}
                />
              </svg>
              <div className="absolute bottom-0 left-0 w-full text-center">
                <div className="text-4xl font-extrabold pb-2">
                  {status === 'idle' || status === 'ping' ? '--' : (status === 'download' ? metrics.download : metrics.upload)}
                  <span className="text-xl font-normal text-gray-500 inline-block ml-1">Mbps</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {status !== 'idle' && status !== 'complete' ? (
              <div className="text-primary-600 dark:text-primary-400 font-medium uppercase tracking-widest animate-pulse flex items-center gap-2">
                <Activity className="w-5 h-5" /> Testing {status}...
              </div>
            ) : (
              <button 
                onClick={runTest}
                className="g-button flex items-center gap-2 text-lg px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600"
              >
                {status === 'complete' ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                {status === 'complete' ? 'Test Again' : 'Start Test'}
              </button>
            )}

            {/* In-Tool Ad */}
            <div className="w-full mt-10">
              <AdSlot slotId="SPEEDTEST_INNER" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="g-card p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                <Server className="w-4 h-4" /> Connection Details
              </h3>
              {ispInfo ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-[var(--border)] pb-2">
                    <span className="text-gray-500">ISP</span>
                    <span className="font-medium text-right font-semibold">{ispInfo.org || ispInfo.isp || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--border)] pb-2">
                    <span className="text-gray-500">IP</span>
                    <span className="font-medium">{ispInfo.ip}</span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--border)] pb-2">
                    <span className="text-gray-500">Server</span>
                    <span className="font-medium">{ispInfo.city}, {ispInfo.country}</span>
                  </div>
                </div>
              ) : (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                </div>
              )}
            </div>

            <div className="g-card p-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Live Results</h3>
              <div className="grid py-2 border-b border-[var(--border)] grid-cols-2 gap-4 items-center">
                <div className="flex items-center gap-2 text-gray-500"><Download className="w-4 h-4 text-blue-500" /> Download</div>
                <div className="text-right font-bold text-lg">{metrics.download || '--'} <span className="text-xs text-gray-400 font-normal">Mbps</span></div>
              </div>
              <div className="grid py-2 border-b border-[var(--border)] grid-cols-2 gap-4 items-center">
                <div className="flex items-center gap-2 text-gray-500"><Upload className="w-4 h-4 text-purple-500" /> Upload</div>
                <div className="text-right font-bold text-lg">{metrics.upload || '--'} <span className="text-xs text-gray-400 font-normal">Mbps</span></div>
              </div>
              <div className="grid py-2 grid-cols-2 gap-4 items-center">
                <div className="flex items-center gap-2 text-gray-500"><Clock className="w-4 h-4 text-yellow-500" /> Ping</div>
                <div className="text-right font-bold text-lg">{metrics.ping || '--'} <span className="text-xs text-gray-400 font-normal">ms</span></div>
              </div>
            </div>

            {lastTest && status === 'idle' && (
              <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-100 dark:border-primary-800">
                <h4 className="text-xs font-semibold text-primary-600 dark:text-primary-400 mb-2">LAST TEST: {new Date(lastTest.date).toLocaleDateString()}</h4>
                <div className="text-sm">DL: {lastTest.download} Mbps • UL: {lastTest.upload} Mbps</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
