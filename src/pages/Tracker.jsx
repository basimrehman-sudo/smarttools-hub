import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Package, Truck, CheckCircle2, Clock, Search, ExternalLink, MapPin } from 'lucide-react';
import AdSlot from '../components/common/AdSlot';

const COURIERS = [
  { id: 'auto', name: 'Auto Detect Courier' },
  { id: 'tcs', name: 'TCS', trackingUrl: 'https://www.tcsexpress.com/tracking' },
  { id: 'leopards', name: 'Leopards Courier', trackingUrl: 'https://leopardscourier.com/tracking' },
  { id: 'pakpost', name: 'Pakistan Post', trackingUrl: 'http://ep.gov.pk/track.asp' },
  { id: 'mnp', name: 'M&P', trackingUrl: 'https://mulphilog.com/track' },
  { id: 'blueex', name: 'BlueEx', trackingUrl: 'https://www.blue-ex.com/tracking' },
  { id: 'callcourier', name: 'Call Courier', trackingUrl: 'https://callcourier.com.pk/tracking/' },
  { id: 'trax', name: 'Trax', trackingUrl: 'https://trax.pk/tracking/' }
];

export default function Tracker() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [selectedCourier, setSelectedCourier] = useState('auto');
  const [isTracking, setIsTracking] = useState(false);
  const [results, setResults] = useState(null);

  // Simple auto-detect logic based on common prefixes/lengths in PK
  const detectCourier = (num) => {
    num = num.toUpperCase();
    if (num.length === 11 || num.length === 12 && /^\d+$/.test(num)) return 'tcs';
    if (num.startsWith('LE') || (num.length === 14 && /^\d+$/.test(num))) return 'leopards';
    if (num.startsWith('EP') || num.startsWith('CP')) return 'pakpost';
    if (num.length === 15 && /^\d+$/.test(num)) return 'mnp';
    return 'tcs'; // Default fallback for demo
  };

  const handleTrack = (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setIsTracking(true);
    setResults(null);

    // Simulate API delay
    setTimeout(() => {
      const courierId = selectedCourier === 'auto' ? detectCourier(trackingNumber) : selectedCourier;
      const courierObj = COURIERS.find(c => c.id === courierId);
      
      // Generate mock tracking data for demonstration
      const isDelivered = Math.random() > 0.3; // 70% chance it's delivered for demo purposes
      
      setResults({
        courier: courierObj,
        trackingNumber: trackingNumber.toUpperCase(),
        status: isDelivered ? 'Delivered' : 'In Transit',
        origin: 'Karachi, Sindh',
        destination: 'Lahore, Punjab',
        eta: isDelivered ? null : new Date(Date.now() + 86400000 * Math.floor(Math.random() * 3 + 1)).toLocaleDateString(),
        timeline: [
          { status: 'Shipment Booked', location: 'Karachi Origin Facility', time: 'Oct 10, 2024 - 10:00 AM', completed: true },
          { status: 'Departed from Origin', location: 'Karachi Hub', time: 'Oct 10, 2024 - 08:30 PM', completed: true },
          { status: 'Arrived at Destination Hub', location: 'Lahore Main Hub', time: 'Oct 11, 2024 - 06:15 AM', completed: true },
          { status: 'Out for Delivery', location: 'Lahore local', time: 'Oct 11, 2024 - 09:00 AM', completed: isDelivered },
          { status: 'Delivered', location: 'To Receiver', time: isDelivered ? 'Oct 11, 2024 - 02:45 PM' : 'Pending', completed: isDelivered },
        ]
      });
      
      setIsTracking(false);
    }, 1200);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>TCS, Leopards & Pakistan Post Tracking Online</title>
        <meta name="description" content="Universal parcel tracker for Pakistan. Live tracking for TCS, Leopards Courier, Pakistan Post, M&P, Call Courier, and Trax shipments instantly." />
        <meta name="keywords" content="tcs tracking, leopards tracking, ptc tracking, pakistan post track, m&p tracking, trax pk, courier tracking online" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Pakistan Couriers Universal Tracking",
              "description": "Track multiple parcels from top couriers like TCS, Leopards, and Pakistan Post."
            }
          `}
        </script>
      </Helmet>

      <div className="mb-6"><AdSlot slotId="TRACKER_TOP" /></div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Package className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          Universal Parcel Tracker
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-2xl">
          Track packages across all major Pakistani courier services efficiently.
        </p>

        <div className="g-card p-6 md:p-8 mb-8">
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Tracking Number</label>
              <input 
                type="text" 
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number (e.g. 12345678901)"
                required
                className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-shadow"
              />
            </div>
            <div className="md:w-64">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Courier Service</label>
              <select 
                value={selectedCourier}
                onChange={(e) => setSelectedCourier(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-shadow"
              >
                {COURIERS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button 
                type="submit" 
                disabled={isTracking || !trackingNumber.trim()}
                className="g-button h-[50px] w-full md:w-32 flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isTracking ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Search className="w-5 h-5" />}
                {isTracking ? 'Tracking' : 'Track'}
              </button>
            </div>
          </form>

          {/* Dev Notice */}
          <div className="mt-4 text-xs text-yellow-600 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded flex items-center gap-2">
            <span className="font-bold">Demo Notice:</span> Cross-origin APIs for local couriers are restricted. Results below use a simulated pipeline visualization. 
          </div>
        </div>

        {results && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 animate-fade-in mb-8">
            {/* Summary Panel */}
            <div className="g-card p-6 h-max">
              <div className="text-center mb-6 pb-6 border-b border-[var(--border)]">
                <div className="text-sm text-gray-400 capitalize mb-1">{results.courier.name} Shipment</div>
                <div className="text-2xl font-bold tracking-wider mb-2">{results.trackingNumber}</div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${results.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                   {results.status === 'Delivered' ? <CheckCircle2 className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                   {results.status}
                </span>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-500">From</div>
                    <div className="font-medium text-[var(--foreground)]">{results.origin}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-500">To</div>
                    <div className="font-medium text-[var(--foreground)]">{results.destination}</div>
                  </div>
                </div>
                
                {results.eta && (
                  <div className="flex items-start gap-3 pt-4 border-t border-[var(--border)] mt-4">
                    <Clock className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-gray-500">Estimated Delivery</div>
                      <div className="font-bold text-lg text-[var(--foreground)]">{results.eta}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <a 
                  href={results.courier.trackingUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full text-center px-4 py-2 border border-[var(--border)] rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  Verify Locally on {results.courier.name} <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Timeline View */}
            <div className="g-card p-6 md:p-8">
              <h3 className="text-xl font-bold mb-6">Delivery Timeline</h3>
              
              <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-3 md:ml-4 space-y-8">
                 {results.timeline.map((event, idx) => (
                   <div key={idx} className={`relative pl-8 ${!event.completed ? 'opacity-50' : ''}`}>
                     {/* Node dot */}
                     <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${event.completed ? (idx === results.timeline.length - 1 && results.status === 'Delivered' ? 'bg-green-500' : 'bg-primary-500') : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                     
                     <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4 mb-1">
                       <h4 className={`font-bold text-lg ${event.completed ? 'text-[var(--foreground)]' : 'text-gray-400'}`}>{event.status}</h4>
                       <span className="text-xs font-semibold text-gray-500 tracking-wide whitespace-nowrap bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{event.time}</span>
                     </div>
                     <p className="text-gray-500 text-sm font-medium">{event.location}</p>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        )}

        <AdSlot slotId="TRACKER_BOTTOM" />
      </div>
    </div>
  );
}
