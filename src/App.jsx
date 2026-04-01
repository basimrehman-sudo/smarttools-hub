import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const SpeedTest = lazy(() => import('./pages/SpeedTest'));
const PDFTools = lazy(() => import('./pages/PDFTools'));
const Forex = lazy(() => import('./pages/Forex'));
const News = lazy(() => import('./pages/News'));
const Islamic = lazy(() => import('./pages/Islamic'));
const Tracker = lazy(() => import('./pages/Tracker'));
// Placeholder imports for future tools

export default function App() {
  return (
    <Layout>
      <Suspense fallback={
        <div className="flex h-64 items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/speed-test" element={<SpeedTest />} />
          <Route path="/pdf" element={<PDFTools />} />
          <Route path="/islamic" element={<Islamic />} />
          <Route path="/forex" element={<Forex />} />
          <Route path="/news" element={<News />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
