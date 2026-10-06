import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Clock,
  Compass,
  Flame,
  GitFork,
  Navigation,
  Siren,
  Sparkles,
  TrendingUp,
  Zap
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useCity } from '../context/CityContext';
import { ConceptExplainer } from '../components/ConceptExplainer';
import { InteractiveNetworkGraph } from '../components/InteractiveNetworkGraph';
import { LeafletCityMap } from '../components/LeafletCityMap';

export const Dashboard = ({ setActivePage }) => {
  const {
    intersections,
    roads,
    activeEmergencies,
    totalIntersections,
    activeRoadsCount,
    congestedRoadsCount,
    activeEmergenciesCount
  } = useCity();

  const [viewMode, setViewMode] = useState('graph'); // 'graph' or 'gis'
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);

  // Hourly traffic volume trend mock data
  const trafficTrendData = [
    { time: '06:00', volume: 2200, speed: 58 },
    { time: '08:00', volume: 5400, speed: 32 },
    { time: '10:00', volume: 6800, speed: 24 },
    { time: '12:00', volume: 4900, speed: 40 },
    { time: '14:00', volume: 4700, speed: 42 },
    { time: '16:00', volume: 6100, speed: 28 },
    { time: '18:00', volume: 7300, speed: 18 },
    { time: '20:00', volume: 5100, speed: 36 },
    { time: '22:00', volume: 3100, speed: 52 }
  ];

  // Traffic distribution
  const trafficDistribution = [
    { name: 'Low Flow', value: roads.filter(r => r.trafficStatus === 'Low').length, color: '#10b981' },
    { name: 'Medium Flow', value: roads.filter(r => r.trafficStatus === 'Medium').length, color: '#eab308' },
    { name: 'High Congestion', value: roads.filter(r => r.trafficStatus === 'High').length, color: '#f97316' },
    { name: 'Critical Stalls', value: roads.filter(r => r.trafficStatus === 'Critical').length, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      {/* College Project ADS Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Autonomous Urban Mobility Operations</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            SmartCity Intelligent Transportation & Emergency Response Center
          </h1>
          <p className="text-slate-400 text-xs mt-1 max-w-3xl">
            Demonstrating graph theory algorithms (Dijkstra's Shortest Path) with Min-Heap Priority Queues, real-time traffic signal preemption, and edge telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('routing')}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center space-x-1.5 shadow-lg shadow-cyan-500/20"
          >
            <Navigation className="w-4 h-4" />
            <span>Calculate Shortest Route</span>
          </button>
          <button
            onClick={() => setActivePage('emergency')}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition flex items-center space-x-1.5 shadow-lg shadow-rose-600/20"
          >
            <Siren className="w-4 h-4 animate-pulse" />
            <span>Emergency Dispatch</span>
          </button>
        </div>
      </div>

      {/* Educational Concept Explainer */}
      <ConceptExplainer title="Urban Graph Representation & Priority Scheduling" concept="Graph Theory & Min-Heap">
        <p>
          Urban traffic networks are mathematically modeled as <strong>weighted graphs G = (V, E)</strong>. Intersections serve as <strong>vertices (V)</strong>, and road segments serve as <strong>directed/undirected edges (E)</strong>. Edge weights are computed dynamically as Weight = Distance &times; Congestion Factor.
        </p>
        <p className="mt-1">
          Emergency response incorporates an optimized <strong>Min-Heap Priority Queue</strong> to ensure immediate preemption for critical medical (Cardiac/Trauma) and structural fire calls over standard vehicle traffic.
        </p>
      </ConceptExplainer>

      {/* TOP METRIC CARDS (8 Critical Stats) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Intersections</span>
            <GitFork className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-mono">{totalIntersections}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1">
            <span>Vertices |V| Active</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Road Corridors</span>
            <Compass className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-mono">{activeRoadsCount}</div>
          <div className="text-[11px] text-cyan-400 mt-1 flex items-center space-x-1">
            <span>Weighted Edges |E|</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Congested Roads</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-2 font-mono">{congestedRoadsCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span>High/Critical bottleneck</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Emergencies</span>
            <Siren className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-rose-400 mt-2 font-mono">{activeEmergenciesCount}</div>
          <div className="text-[11px] text-rose-300/80 mt-1">
            <span>Min-Heap Scheduled</span>
          </div>
        </div>

        {/* Metric 5 */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Avg Response Time</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-mono">5.2 min</div>
          <div className="text-[11px] text-emerald-400 mt-1">
            <span>34% faster via Dijkstra</span>
          </div>
        </div>

        {/* Metric 6 */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Current Traffic Level</span>
            <Activity className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-yellow-400 mt-2 font-mono">Moderate (54%)</div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span>Average city density</span>
          </div>
        </div>

        {/* Metric 7 */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Traffic Incidents</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-orange-400 mt-2 font-mono">2 Reported</div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span>Stalls on Sector 4 & D-F</span>
          </div>
        </div>

        {/* Metric 8 */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>System Efficiency</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2 font-mono">94.8%</div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span>Adaptive signal optimization</span>
          </div>
        </div>
      </div>

      {/* MAIN VISUALIZATION CARD (GRAPH VS GIS MAP TOGGLE) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              <span>City Road Network & Real-Time Traffic Conditions</span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive visualization of intersections (vertices) and road segments (weighted edges).
            </p>
          </div>

          {/* Toggle Button */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('graph')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'graph'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Graph View (ADS)
            </button>
            <button
              onClick={() => setViewMode('gis')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'gis'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              GIS Map (Leaflet)
            </button>
          </div>
        </div>

        {/* Active View */}
        {viewMode === 'graph' ? (
          <InteractiveNetworkGraph
            intersections={intersections}
            roads={roads}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
            selectedEdge={selectedEdge}
            onSelectEdge={setSelectedEdge}
          />
        ) : (
          <LeafletCityMap
            intersections={intersections}
            roads={roads}
            onSelectNode={setSelectedNode}
          />
        )}
      </div>

      {/* CHARTS ROW (TRAFFIC VOLUME OVERVIEW & DENSITY DISTRIBUTION) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line / Area Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <span>Urban Traffic Flow & Speed Telemetry</span>
              </h3>
              <p className="text-xs text-slate-400">Hourly vehicle count vs average corridor speed (km/h)</p>
            </div>
            <span className="text-[10px] font-mono bg-slate-800 text-cyan-400 px-2 py-1 rounded">24H CYCLE</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficTrendData}>
                <defs>
                  <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#06b6d4" fillOpacity={1} fill="url(#volumeGrad)" name="Vehicle Count" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie / Donut Chart */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center space-x-2 mb-1">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Corridor Congestion Status</span>
            </h3>
            <p className="text-xs text-slate-400">Classification of active road segments</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {trafficDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {trafficDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <div className="flex-1">
                  <p className="text-[11px] text-slate-400">{item.name}</p>
                  <p className="font-bold text-white font-mono">{item.value} Roads</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* LOWER SECTION: ACTIVE INCIDENTS & TOP PRIORITY EMERGENCY QUEUE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Emergency Requests Panel */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <Siren className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Priority Queue: Emergency Dispatch</h3>
                <p className="text-xs text-slate-400">Sorted dynamically via Min-Heap algorithm</p>
              </div>
            </div>
            <button
              onClick={() => setActivePage('emergency')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Open Dispatcher &rarr;
            </button>
          </div>

          <div className="space-y-2.5">
            {activeEmergencies.slice(0, 3).map((er) => (
              <div
                key={er.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition"
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                      er.priority === 1
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : er.priority === 2
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    P{er.priority} {er.priorityLabel}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">{er.vehicleId} ({er.type})</h4>
                    <p className="text-[11px] text-slate-400">
                      Route: {er.source} &rarr; {er.destination} | {er.patientCondition}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-1 rounded border border-cyan-800">
                  {er.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Traffic Incidents & Road Status */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Active Urban Bottlenecks</h3>
                <p className="text-xs text-slate-400">Live congestion alerts affecting Dijkstra weights</p>
              </div>
            </div>
            <button
              onClick={() => setActivePage('traffic')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              View Traffic Map &rarr;
            </button>
          </div>

          <div className="space-y-2.5">
            {roads.filter(r => r.trafficStatus === 'High' || r.trafficStatus === 'Critical' || r.incidents).map((road) => (
              <div
                key={road.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-white">{road.name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      road.trafficStatus === 'Critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {road.trafficStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {road.incidents || 'Heavy flow detected by inductive loop sensors'}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-cyan-400">{road.currentSpeed} km/h</div>
                  <div className="text-[10px] text-slate-500">{road.density}% density</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
