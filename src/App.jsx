import React, { useState } from 'react';
import { CityProvider } from './context/CityContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

// 11 Core Pages
import { Dashboard } from './pages/Dashboard';
import { LiveTraffic } from './pages/LiveTraffic';
import { RoadNetwork } from './pages/RoadNetwork';
import { RouteOptimization } from './pages/RouteOptimization';
import { EmergencyResponse } from './pages/EmergencyResponse';
import { TrafficSignals } from './pages/TrafficSignals';
import { PerformanceAnalysis } from './pages/PerformanceAnalysis';
import { AIPrediction } from './pages/AIPrediction';
import { IoTSensors } from './pages/IoTSensors';
import { Reports } from './pages/Reports';
import { AboutProject } from './pages/AboutProject';

export function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Router dispatcher
  const renderCurrentPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard setActivePage={setActivePage} />;
      case 'traffic':
        return <LiveTraffic />;
      case 'network':
        return <RoadNetwork />;
      case 'routing':
        return <RouteOptimization />;
      case 'emergency':
        return <EmergencyResponse />;
      case 'signals':
        return <TrafficSignals />;
      case 'performance':
        return <PerformanceAnalysis />;
      case 'prediction':
        return <AIPrediction />;
      case 'iot':
        return <IoTSensors />;
      case 'reports':
        return <Reports />;
      case 'about':
        return <AboutProject />;
      default:
        return <Dashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <CityProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
        {/* Navigation Sidebar */}
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Main Content Area */}
        <div className="lg:pl-72 flex flex-col flex-1 min-w-0">
          <Header
            onOpenMobile={() => setIsMobileOpen(true)}
            activePage={activePage}
            setActivePage={setActivePage}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {renderCurrentPage()}
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              &copy; {new Date().getFullYear()} IP Project &ndash; SmartCity Traffic & Emergency Response System
            </div>
            <div className="flex items-center space-x-3 text-slate-400 font-mono text-[11px]">
              <span>ADS: Graphs &bull; Min-Heap &bull; Dijkstra</span>
              <span>&bull;</span>
              <span className="text-cyan-400">Autonomous ITS Operations</span>
            </div>
          </footer>
        </div>
      </div>
    </CityProvider>
  );
}

export default App;
