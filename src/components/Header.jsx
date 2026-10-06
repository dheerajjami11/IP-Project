import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Search,
  RefreshCw,
  Cpu,
  Radio,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Siren
} from 'lucide-react';
import { useCity } from '../context/CityContext';

export const Header = ({ onOpenMobile, activePage, setActivePage }) => {
  const { congestedRoadsCount, activeEmergenciesCount } = useCity();
  const [notificationOpen, setNotificationOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenMobile}
          className="p-2 rounded-lg text-slate-400 hover:text-white lg:hidden hover:bg-slate-800"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              ITS Operation Center
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-sm font-bold text-white capitalize">
              {activePage.replace('-', ' ')}
            </span>
          </div>
          <p className="hidden md:block text-[11px] text-slate-400">
            Real-time urban telemetry, route optimization & priority emergency preemption
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Quick status counters */}
        <div className="hidden sm:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs">
          <div className="flex items-center space-x-1.5 text-amber-400 font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{congestedRoadsCount} Congested</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center space-x-1.5 text-rose-400 font-medium">
            <Siren className="w-3.5 h-3.5 animate-pulse" />
            <span>{activeEmergenciesCount} Emergencies</span>
          </div>
        </div>

        {/* Quick Navigation Shortcut */}
        <button
          onClick={() => setActivePage('emergency')}
          className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30 transition text-xs font-medium"
        >
          <Siren className="w-3.5 h-3.5 text-rose-400" />
          <span>Priority Dispatch</span>
        </button>

        <button
          onClick={() => setActivePage('routing')}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-600/30 transition text-xs font-medium"
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>Calculate Route</span>
        </button>
      </div>
    </header>
  );
};
