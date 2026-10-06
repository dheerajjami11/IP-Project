import React, { useState } from 'react';
import {
  Navigation,
  ArrowRight,
  Clock,
  Compass,
  Zap,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Sparkles,
  Layers,
  MapPin
} from 'lucide-react';
import { useCity } from '../context/CityContext';
import { dijkstra, findAlternativeRoutes } from '../algorithms/Dijkstra';
import { ConceptExplainer } from '../components/ConceptExplainer';
import { InteractiveNetworkGraph } from '../components/InteractiveNetworkGraph';
import { LeafletCityMap } from '../components/LeafletCityMap';

export const RouteOptimization = () => {
  const { intersections, roads } = useCity();

  // Selected source & destination
  const [sourceNode, setSourceNode] = useState('A');
  const [destNode, setDestNode] = useState('G');
  const [considerTraffic, setConsiderTraffic] = useState(true);
  const [viewMode, setViewMode] = useState('graph'); // graph | gis

  // Calculation state
  const [routeResult, setRouteResult] = useState(() =>
    dijkstra(intersections, roads, 'A', 'G', true)
  );

  const [alternativeRoutes, setAlternativeRoutes] = useState(() =>
    findAlternativeRoutes(intersections, roads, 'A', 'G')
  );

  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

  // Trigger Dijkstra calculation
  const handleCalculateRoute = () => {
    if (sourceNode === destNode) {
      alert('Source and destination cannot be identical. Please pick distinct intersections.');
      return;
    }
    const primary = dijkstra(intersections, roads, sourceNode, destNode, considerTraffic);
    const alternatives = findAlternativeRoutes(intersections, roads, sourceNode, destNode);
    setRouteResult(primary);
    setAlternativeRoutes(alternatives);
    setSelectedRouteIndex(0);
  };

  const activeRoute = alternativeRoutes[selectedRouteIndex] || routeResult;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-cyan-400" />
            <span>Dijkstra Shortest Path Route Optimization</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time algorithmic route selection utilizing dynamic traffic impedance weights and priority heaps.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('graph')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'graph' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Graph View (ADS)
          </button>
          <button
            onClick={() => setViewMode('gis')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'gis' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            GIS Map (Leaflet)
          </button>
        </div>
      </div>

      <ConceptExplainer title="Dijkstra's Shortest Path Algorithm" concept="Greedy Algorithms & Priority Queue" defaultOpen={true}>
        <p>
          <strong>Dijkstra's Algorithm</strong> calculates the shortest path between a source vertex and all other vertices in a non-negative weighted graph:
        </p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li><strong>Min-Heap Priority Queue:</strong> Extracts the unsettled vertex with minimal tentative distance in O(log V) time.</li>
          <li><strong>Relaxation Step:</strong> For current node u and neighbor v, if dist[u] + weight(u, v) is less than dist[v], then dist[v] is updated and pushed into the Min-Heap.</li>
          <li><strong>Overall Complexity:</strong> O((V + E) log V) with a binary heap, making it optimal for city-scale routing.</li>
        </ul>
      </ConceptExplainer>

      {/* INPUT FORM CONTROLS */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {/* Source Selection */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Source Location (Start Vertex)
            </label>
            <select
              value={sourceNode}
              onChange={(e) => setSourceNode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            >
              {intersections.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.id} - {node.name}
                </option>
              ))}
            </select>
          </div>

          {/* Destination Selection */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Destination Location (Target Vertex)
            </label>
            <select
              value={destNode}
              onChange={(e) => setDestNode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            >
              {intersections.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.id} - {node.name}
                </option>
              ))}
            </select>
          </div>

          {/* Traffic Toggle */}
          <div className="flex flex-col justify-end">
            <label className="flex items-center space-x-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={considerTraffic}
                onChange={(e) => setConsiderTraffic(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span className="text-xs text-slate-300 font-medium">Consider Congestion Multiplier</span>
            </label>
          </div>
        </div>

        <button
          onClick={handleCalculateRoute}
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs transition flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20"
        >
          <Zap className="w-4 h-4" />
          <span>Execute Dijkstra</span>
        </button>
      </div>

      {/* COMPUTED RESULT SUMMARY CARDS */}
      {activeRoute?.success ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Optimal Route Path</span>
            <span className="text-sm font-bold text-cyan-400 font-mono">
              {activeRoute.path.join(' \u2192 ')}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Total Distance</span>
            <span className="text-sm font-bold text-white font-mono">
              {activeRoute.totalDistance} km
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Est. Travel Time</span>
            <span className="text-sm font-bold text-amber-400 font-mono">
              {activeRoute.totalTravelTime} mins
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Nodes Visited</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">
              {activeRoute.visitedNodesCount} of {intersections.length} vertices
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Algorithmic Exec Time</span>
            <span className="text-sm font-bold text-purple-400 font-mono">
              {activeRoute.executionTimeMs} ms
            </span>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{activeRoute?.error || 'Unable to compute path for selected vertices.'}</span>
        </div>
      )}

      {/* ALTERNATIVE ROUTES TABS */}
      {alternativeRoutes.length > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold mr-1">Generated Routes:</span>
          {alternativeRoutes.map((rt, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedRouteIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                selectedRouteIndex === idx
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {rt.label || `Route #${idx + 1}`} ({rt.totalDistance} km &bull; {rt.totalTravelTime} min)
            </button>
          ))}
        </div>
      )}

      {/* GRAPH / MAP WITH HIGHLIGHTED ROUTE */}
      <div className="space-y-4">
        {viewMode === 'graph' ? (
          <InteractiveNetworkGraph
            intersections={intersections}
            roads={roads}
            highlightedPath={activeRoute?.path || []}
            highlightedEdges={activeRoute?.edgePath || []}
          />
        ) : (
          <LeafletCityMap
            intersections={intersections}
            roads={roads}
            highlightedPath={activeRoute?.path || []}
          />
        )}
      </div>

      {/* STEP-BY-STEP DIJKSTRA EXECUTION TRACE TABLE */}
      {activeRoute?.stepByStep && activeRoute.stepByStep.length > 0 && (
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Dijkstra Traversal Trace (Step-by-Step Node Unwrapping)</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">Order: {activeRoute.visitedOrder.join(' \u2192 ')}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[10px] uppercase font-mono text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Step</th>
                  <th className="p-2.5">Intersection Vertex</th>
                  <th className="p-2.5">Junction Name</th>
                  <th className="p-2.5">Cumulative Distance (km)</th>
                  <th className="p-2.5">Effective Cost Score</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {activeRoute.stepByStep.map((step) => {
                  const nodeDetails = intersections.find(n => n.id === step.intersection);
                  return (
                    <tr key={step.step} className="hover:bg-slate-800/40">
                      <td className="p-2.5 text-cyan-400 font-bold">#{step.step}</td>
                      <td className="p-2.5 font-bold text-white">Vertex {step.intersection}</td>
                      <td className="p-2.5 font-sans text-slate-300">{nodeDetails?.name}</td>
                      <td className="p-2.5 text-slate-200">{step.cumulativeDistance} km</td>
                      <td className="p-2.5 text-amber-400">{step.cumulativeCost}</td>
                      <td className="p-2.5 font-sans">
                        <span className="inline-flex items-center text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                          Settled via Min-Heap
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
