import React from 'react';
import {
  LayoutDashboard,
  Activity,
  GitFork,
  Navigation,
  Siren,
  TrafficCone,
  Cpu,
  Sparkles,
  Radio,
  FileSpreadsheet,
  Info,
  ShieldCheck,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 'Live' },
  { id: 'traffic', label: 'Live Traffic', icon: Activity },
  { id: 'network', label: 'Road Network', icon: GitFork, badge: 'Graph' },
  { id: 'routing', label: 'Route Optimization', icon: Navigation, badge: 'Dijkstra' },
  { id: 'emergency', label: 'Emergency Response', icon: Siren, badge: 'Min-Heap' },
  { id: 'signals', label: 'Traffic Signals', icon: TrafficCone },
  { id: 'performance', label: 'Performance Analysis', icon: Cpu },
  { id: 'prediction', label: 'AI Prediction', icon: Sparkles, badge: 'AI' },
  { id: 'iot', label: 'IoT Sensors', icon: Radio },
  { id: 'reports', label: 'Reports & Export', icon: FileSpreadsheet },
  { id: 'about', label: 'About Project', icon: Info },
];

export const Sidebar = ({ activePage, setActivePage, isMobileOpen, setIsMobileOpen }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900/95 border-r border-slate-800 backdrop-blur-md flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Siren className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="font-bold text-base text-white tracking-tight flex items-center gap-1.5">
                SMARTCITY <span className="text-cyan-400 font-extrabold text-xs px-1.5 py-0.5 rounded-sm bg-cyan-950/80 border border-cyan-800">ITS</span>
              </h1>
              <p className="text-xs text-slate-400">Traffic & Emergency System</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white lg:hidden hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* System Status Pill */}
        <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">Core Systems Online</span>
          </div>
          <span className="text-cyan-400 font-mono text-[11px]">v2.4.0 (ADS)</span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            System Operations
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                      isActive
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 border border-slate-700/50'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* College Project Signature Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="rounded-xl p-3 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/60 text-xs">
            <div className="flex items-center space-x-2 text-cyan-400 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>IP College Project</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Demonstrating Graphs, Min-Heap Priority Queues, and Dijkstra's Algorithm in Smart City ITS.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
