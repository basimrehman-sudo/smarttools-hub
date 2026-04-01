import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Moon, Sun, Clock, Calendar as CalendarIcon, Search } from 'lucide-react';
import axios from 'axios';
import AdSlot from '../components/common/AdSlot';

export default function Islamic() {
  const [city, setCity] = useState('Karachi');
  const [country, setCountry] = useState('Pakistan');
  const [method, setMethod] = useState(1); // 1 = University of Islamic Sciences, Karachi
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('Karachi, Pakistan');
  const [nextPrayer, setNextPrayer] = useState({ name: '', diff: '' });

  const fetchTimings = async (c, co, m) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${c}&country=${co}&method=${m}`);
      setData(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Could not fetch prayer timings for the specified location.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimings(city, country, method);
  }, [city, country, method]);

  useEffect(() => {
    if (!data) return;

    const updateCountdown = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTimeStr = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;
      
      const timings = data.timings;
      const prayers = [
        { name: 'Fajr', time: timings.Fajr },
        { name: 'Sunrise', time: timings.Sunrise },
        { name: 'Dhuhr', time: timings.Dhuhr },
        { name: 'Asr', time: timings.Asr },
        { name: 'Maghrib', time: timings.Maghrib },
        { name: 'Isha', time: timings.Isha }
      ];

      let upcoming = prayers.find(p => p.time > currentTimeStr);
      if (!upcoming) {
        // If all prayers today have passed, next is Fajr tomorrow
        upcoming = { name: 'Fajr', time: prayers[0].time };
      }

      // Calculate diff
      const [upH, upM] = upcoming.time.split(':').map(Number);
      let targetDate = new Date();
      targetDate.setHours(upH, upM, 0, 0);
      
      if (upcoming.name === 'Fajr' && targetDate < now) {
         targetDate.setDate(targetDate.getDate() + 1);
      }

      const diffMs = targetDate - now;
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);

      setNextPrayer({
        name: upcoming.name,
        diff: `${diffHrs}h ${diffMins}m ${diffSecs}s`
      });
    };

    updateCountdown();
    const iv = setInterval(updateCountdown, 1000);
    return () => clearInterval(iv);
  }, [data]);

  const handleSearch = (e) => {
    e.preventDefault();
    const parts = searchTerm.split(',');
    const newCity = parts[0].trim();
    const newCountry = parts[1] ? parts[1].trim() : '';
    setCity(newCity);
    setCountry(newCountry);
  };

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <Helmet>
        <title>Islamic Prayer Timing & Hijri Calendar Pakistan</title>
        <meta name="description" content="Accurate global Islamic prayer times, auto location detection for Pakistan cities (Lahore, Karachi, Islamabad), Hijri calendar converter, and Azan countdown." />
        <meta name="keywords" content="namaz timing karachi, prayer times lahore, hijri calendar today pakistan, fajr time islamabad, maghrib time lahore, islamic calendar" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Live Prayer Timings Pakistan",
              "description": "Accurate namaz timings and Hijri calendar for users in Pakistan."
            }
          `}
        </script>
      </Helmet>

      <div className="mb-6"><AdSlot slotId="ISLAMIC_TOP" /></div>

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Moon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              Prayer Timings & Hijri Calendar
            </h1>
            <p className="text-gray-500 dark:text-gray-400">Live countdown, Hijri dates, and accurate timings.</p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="City, Country"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] outline-none focus:border-primary-500"
              />
            </div>
            <button type="submit" className="g-button px-4 py-3 flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>
        </div>

        {/* Info Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="g-card p-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white border-none relative overflow-hidden">
            <Moon className="w-32 h-32 absolute -bottom-6 -right-6 opacity-10" />
            <h3 className="text-primary-100 font-semibold mb-1 text-sm uppercase tracking-wide">Next Prayer</h3>
            <div className="text-3xl font-bold mb-1">{nextPrayer.name || '...'}</div>
            <div className="text-lg font-medium opacity-90 flex items-center gap-2">
              <Clock className="w-5 h-5" /> -{nextPrayer.diff || '...'} remaining
            </div>
          </div>

          <div className="g-card p-6 col-span-1 md:col-span-2 flex flex-col justify-center">
            {data ? (
              <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" /> Date Info
                  </h3>
                  <div className="text-xl font-bold">{data.date.gregorian.date}</div>
                  <div className="text-primary-600 dark:text-primary-400 font-medium">
                    {data.date.gregorian.weekday.en}
                  </div>
                </div>
                <div className="hidden md:block w-px h-12 bg-[var(--border)]"></div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-2">
                    <Moon className="w-4 h-4" /> Hijri Date
                  </h3>
                  <div className="text-xl font-bold">
                    {data.date.hijri.day} {data.date.hijri.month.en} {data.date.hijri.year}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                    {data.date.hijri.designation.expanded}
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-pulse space-y-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            )}
          </div>
        </div>

        {/* Timing Grid */}
        <h2 className="text-xl font-bold mb-4">Prayer Times for {city}</h2>
        {isLoading && !data ? (
           <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
             {[1,2,3,4,5,6].map(i => <div key={i} className="g-card h-24 animate-pulse"></div>)}
           </div>
        ) : data && (
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            {[
              { id: 'Fajr', name: 'Fajr', icon: <Moon className="w-6 h-6" /> },
              { id: 'Sunrise', name: 'Sunrise', icon: <Sun className="w-6 h-6 text-orange-500" /> },
              { id: 'Dhuhr', name: 'Dhuhr', icon: <Sun className="w-6 h-6 text-yellow-500" /> },
              { id: 'Asr', name: 'Asr', icon: <Sun className="w-6 h-6 text-orange-400" /> },
              { id: 'Maghrib', name: 'Maghrib', icon: <Moon className="w-6 h-6 text-indigo-500" /> },
              { id: 'Isha', name: 'Isha', icon: <Moon className="w-6 h-6 text-blue-900 dark:text-blue-300" /> },
            ].map(prayer => (
               <div key={prayer.id} className={`g-card p-4 text-center ${nextPrayer.name === prayer.name ? 'border-primary-500 ring-1 ring-primary-500 bg-primary-50 dark:bg-primary-900/20' : ''}`}>
                 <div className="flex justify-center mb-2 opaciy-80">{prayer.icon}</div>
                 <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">{prayer.name}</div>
                 <div className="text-xl font-bold">{data.timings[prayer.id]}</div>
               </div>
            ))}
          </div>
        )}

        {/* Additional Ad Slot */}
        <div className="mt-8"><AdSlot slotId="ISLAMIC_BOTTOM" /></div>
      </div>
    </div>
  );
}
