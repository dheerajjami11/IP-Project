import React, { useState } from 'react';
import {
  Activity,
  AlertOctagon,
  AlertTriangle,
  Car,
  Compass,
  Filter,
  Flame,
  Gauge,
  Info,
  MapPin,
  Sliders,
  TrendingDown,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useCity } from '../context/CityContext';
import { ConceptExplainer } from '../components/ConceptExplainer';
import { InteractiveNetworkGraph } from '../components/InteractiveNetworkGraph';
import { LeafletCityMap } from '../components/LeafletCityMap';

export const LiveTraffic = () => {
  const { intersections, roads, updateRoadTraffic } = useCity();
  const [filter, setFilter] = useState('All'); // All, Low, Medium, High, Critical
  const [viewMode, setViewMode] = useState('graph'); // graph | gis
  const [selectedRoad, setSelectedRoad] = useState(roads[0] || null);
  const [selectedNode, setSelectedNode] = useState(null);

  // Filtered roads
  const filteredRoads = roads.filter((r) => {
    if (filter === 'All') return true;
    return r.trafficStatus.toLowerCase() === filter.toLowerCase();
  });

  const getTrafficBadge = (status) => {
    switch (status) {
      case 'Critical':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'High':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'Low':
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>Live Traffic & Congestion Monitoring</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time urban road network density, sensor velocity tracking, and congestion status filtering
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('graph')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'graph' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Network Graph View
          </button>
          <button
            onClick={() => setViewMode('gis')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'gis' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            GIS Map View
          </button>
        </div>
      </div>

      <ConceptExplainer title="Dynamic Edge Cost Weighting" concept="Edge Weights in Graphs">
        <p>
          In advanced graph data structures, edge weights don't remain static physical distances. They fluctuate dynamically based on traffic congestion:
          <span className="block my-1 font-mono font-bold text-cyan-300">Effective Weight = Distance &times; Multiplier</span>
          Where <strong>Low = 1.0x</strong>, <strong>Medium = 1.4x</strong>, <strong>High = 2.0x</strong>, and <strong>Critical = 3.5x</strong>. When traffic intensifies on an edge, Dijkstra's algorithm automatically routes traffic around the bottleneck.
        </p>
      </ConceptExplainer>

      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center space-x-1.5 text-xs text-slate-400 mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter by Status:</span>
        </div>
        {['All', 'Low', 'Medium', 'High', 'Critical'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
              filter === status
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700'
            }`}
          >
            {status}
            {status !== 'All' && (
              <span className="ml-1.5 opacity-70 font-mono">
                ({roads.filter((r) => r.trafficStatus.toLowerCase() === status.toLowerCase()).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT GRID: MAP/GRAPH & DETAIL INSPECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Visual Map / Graph */}
        <div className="lg:col-span-2 space-y-4">
          {viewMode === 'graph' ? (
            <InteractiveNetworkGraph
              intersections={intersections}
              roads={filteredRoads}
              selectedNode={selectedNode}
              onSelectNode={setSelectedNode}
              selectedEdge={selectedRoad}
              onSelectEdge={(edge) => setSelectedRoad(edge)}
            />
          ) : (
            <LeafletCityMap
              intersections={intersections}
              roads={filteredRoads}
              onSelectNode={setSelectedNode}
            />
          )}

          {/* Quick Simulation Bar: Change Traffic on selected road */}
          {selectedRoad && (
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono text-cyan-400">SIMULATE DYNAMIC CONGESTION:</span>
                <p className="text-xs text-white font-bold">{selectedRoad.name} ({selectedRoad.from} &rarr; {selectedRoad.to})</p>
              </div>

              <div className="flex items-center gap-1.5">
                {['Low', 'Medium', 'High', 'Critical'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => updateRoadTraffic(selectedRoad.id, lvl)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition ${
                      selectedRoad.trafficStatus === lvl
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Selected Road / Intersection Inspector */}
        <div className="space-y-4">
          {selectedRoad ? (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">Road Corridor Inspector</span>
                  <h3 className="font-bold text-sm text-white">{selectedRoad.name}</h3>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono ${getTrafficBadge(selectedRoad.trafficStatus)}`}>
                  {selectedRoad.trafficStatus}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400">Connected Intersections</span>
                  <p className="font-bold text-cyan-400 text-sm mt-0.5">{selectedRoad.from} &harr; {selectedRoad.to}</p>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400">Segment Distance</span>
                  <p className="font-bold text-white text-sm mt-0.5 font-mono">{selectedRoad.weight} km</p>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400">Traffic Density</span>
                  <p className="font-bold text-amber-400 text-sm mt-0.5 font-mono">{selectedRoad.density}%</p>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400">Average Velocity</span>
                  <p className="font-bold text-emerald-400 text-sm mt-0.5 font-mono">{selectedRoad.currentSpeed} km/h</p>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 col-span-2">
                  <span className="text-[10px] text-slate-400">Est. Travel Time</span>
                  <p className="font-bold text-white text-sm mt-0.5 font-mono">
                    {((selectedRoad.weight / Math.max(selectedRoad.currentSpeed, 5)) * 60).toFixed(1)} minutes
                  </p>
                </div>
              </div>

              {/* Incidents Note */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                <span className="font-semibold text-slate-200 block mb-1">Status & Incident Telemetry:</span>
                <p className="text-[11px] text-slate-400">
                  {selectedRoad.incidents || 'Normal traffic flow. No bottlenecks or lane obstructions.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-xs">
              <Compass className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <span>Select any road segment to inspect live velocity and density metrics</span>
            </div>
          )}

          {/* Connected Roads Quick List */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center justify-between">
              <span>All Roads ({filteredRoads.length})</span>
              <span className="text-[10px] text-slate-400">Click to focus</span>
            </h4>

            <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
              {filteredRoads.map((road) => (
                <button
                  key={road.id}
                  onClick={() => setSelectedRoad(road)}
                  className={`w-full p-2 rounded-lg text-left text-xs flex items-center justify-between border transition ${
                    selectedRoad?.id === road.id
                      ? 'bg-slate-800 text-cyan-300 border-cyan-500/50'
                      : 'bg-slate-950/50 text-slate-300 border-slate-800/80 hover:bg-slate-800/40'
                  }`}
                >
                  <div>
                    <span className="font-semibold">{road.name}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {road.from} &rarr; {road.to} ({road.weight} km)
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${getTrafficBadge(road.trafficStatus)}`}>
                    {road.trafficStatus}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
