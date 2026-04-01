import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { RefreshCcw, ArrowRightLeft, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import AdSlot from '../components/common/AdSlot';

const HIGHLIGHT_CURRENCIES = ['USD', 'PKR', 'AED', 'SAR', 'GBP', 'EUR'];
const BASE_API_URL = 'https://api.exchangerate-api.com/v4/latest/';

export default function Forex() {
  const [rates, setRates] = useState({});
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('PKR');
  const [isOffline, setIsOffline] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchRates = async (base = 'USD') => {
    setIsLoading(true);
    setIsOffline(false);
    try {
      const res = await axios.get(`${BASE_API_URL}${base}`);
      setRates(res.data.rates);
      setLastUpdated(new Date().toLocaleString());
      localStorage.setItem('cachedRates', JSON.stringify({ base, rates: res.data.rates, date: new Date().toLocaleString() }));
    } catch (error) {
      console.error("Failed to fetch rates, falling back to cache.", error);
      setIsOffline(true);
      const cached = localStorage.getItem('cachedRates');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.base === base) {
          setRates(parsed.rates);
          setLastUpdated(parsed.date);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates(fromCurrency);
  }, [fromCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const convertedAmount = rates[toCurrency] ? (parseFloat(amount) || 0) * rates[toCurrency] : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Live PKR to USD & Global Currency Exchange Rates Pakistan</title>
        <meta name="description" content="Check live currency exchange rates for Pakistan. Fast conversion for US Dollar (USD) to PKR, UAE Dirham (AED), Saudi Riyal (SAR), Euro (EUR), and GBP." />
        <meta name="keywords" content="pkr to usd, usd to pkr open market, aed to pkr, sar to pkr rate today, forex rates pakistan, interbank rate, live currency exchange" />
        <meta property="og:title" content="Live PKR Currency Exchange & Converter" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Live PKR Currency Exchange Rates",
              "description": "Real-time USD, AED, SAR, GBP to PKR conversion."
            }
          `}
        </script>
      </Helmet>

      <div className="mb-6"><AdSlot slotId="FOREX_TOP" /></div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Live Currency Converter</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-2xl">
          Get real-time exchange rates for global currencies dynamically with a powerful built-in offline caching mechanism.
        </p>

        <div className="g-card p-6 md:p-8 mb-8 relative">
          {isOffline && (
            <div className="absolute top-0 left-0 w-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 text-sm py-2 px-4 flex justify-center items-center gap-2 rounded-t-xl font-medium">
              <AlertTriangle className="w-4 h-4" />
              You are offline or API failed. Showing cached rates from {lastUpdated}.
            </div>
          )}

          <div className={`grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-end ${isOffline ? 'mt-8' : ''}`}>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Amount</label>
              <div className="relative flex rounded-lg border border-[var(--border)] overflow-hidden focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 transition-shadow">
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 bg-transparent px-4 py-3 text-lg font-medium outline-none w-full"
                  min="0"
                />
                <select 
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="bg-gray-50 dark:bg-gray-800 border-l border-[var(--border)] px-4 py-3 outline-none font-bold text-[var(--foreground)]"
                >
                  {Object.keys(rates).length > 0 ? Object.keys(rates).map(c => (
                    <option key={c} value={c}>{c}</option>
                  )) : <option value={fromCurrency}>{fromCurrency}</option>}
                </select>
              </div>
            </div>

            <div className="flex justify-center pb-2">
              <button 
                onClick={handleSwap}
                className="p-3 bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 rounded-full hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors shadow-sm"
              >
                <ArrowRightLeft className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-300">Converted to</label>
              <div className="relative flex rounded-lg border border-[var(--border)] overflow-hidden bg-gray-50 dark:bg-gray-800/50">
                <div className="flex-1 px-4 py-3 text-2xl font-bold flex items-center overflow-x-auto whitespace-nowrap">
                   {isLoading ? <span className="text-gray-400 text-lg animate-pulse">Fetching...</span> : convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </div>
                <select 
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-800 border-l border-[var(--border)] px-4 py-3 outline-none font-bold text-[var(--foreground)]"
                >
                  {Object.keys(rates).length > 0 ? Object.keys(rates).map(c => (
                    <option key={c} value={c}>{c}</option>
                  )) : <option value={toCurrency}>{toCurrency}</option>}
                </select>
              </div>
            </div>

          </div>

          <div className="mt-8 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t border-[var(--border)] pt-4">
            <div>
              1 {fromCurrency} = {rates[toCurrency] || '...'} {toCurrency}
            </div>
            <div className="flex items-center gap-2">
              <span>Updated: {lastUpdated}</span>
              <button onClick={() => fetchRates(fromCurrency)} className="hover:text-primary-500 transition-colors" title="Refresh Rates">
                <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">Popular Conversions (from {fromCurrency})</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {HIGHLIGHT_CURRENCIES.filter(c => c !== fromCurrency).map(currency => (
              <div key={currency} className="g-card p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer" onClick={() => setToCurrency(currency)}>
                <span className="font-semibold text-gray-600 dark:text-gray-300">{currency}</span>
                <span className="font-bold">{rates[currency] ? rates[currency].toFixed(4) : '...'}</span>
              </div>
            ))}
          </div>
        </div>
        
        <AdSlot slotId="FOREX_BOTTOM" />
      </div>
    </div>
  );
}
