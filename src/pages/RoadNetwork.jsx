import React, { useState } from 'react';
import {
  GitFork,
  Plus,
  Trash2,
  Search,
  CheckCircle,
  AlertCircle,
  Info,
  MapPin,
  ArrowRight,
  Sparkles,
  Layers,
  Network
} from 'lucide-react';
import { useCity } from '../context/CityContext';
import { ConceptExplainer } from '../components/ConceptExplainer';
import { InteractiveNetworkGraph } from '../components/InteractiveNetworkGraph';

export const RoadNetwork = () => {
  const {
    intersections,
    roads,
    addIntersection,
    addRoad,
    removeRoad
  } = useCity();

  // State for adding intersection
  const [newInterId, setNewInterId] = useState('');
  const [newInterName, setNewInterName] = useState('');
  const [newInterType, setNewInterType] = useState('Standard');

  // State for adding road
  const [fromNode, setFromNode] = useState('');
  const [toNode, setToNode] = useState('');
  const [roadWeight, setRoadWeight] = useState('');
  const [roadTraffic, setRoadTraffic] = useState('Low');

  // Search & inspect state
  const [searchNode, setSearchNode] = useState('A');
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedRoad, setSelectedRoad] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  // Handle Add Intersection
  const handleAddIntersection = (e) => {
    e.preventDefault();
    if (!newInterId.trim()) {
      setStatusMessage({ type: 'error', text: 'Intersection ID cannot be blank.' });
      return;
    }
    const res = addIntersection({
      id: newInterId.trim().toUpperCase(),
      name: newInterName.trim() || `Junction ${newInterId.trim().toUpperCase()}`,
      type: newInterType
    });
    if (res.success) {
      setStatusMessage({ type: 'success', text: `Vertex ${newInterId.toUpperCase()} successfully added to the graph!` });
      setNewInterId('');
      setNewInterName('');
    } else {
      setStatusMessage({ type: 'error', text: res.error });
    }
  };

  // Handle Add Road
  const handleAddRoad = (e) => {
    e.preventDefault();
    if (!fromNode || !toNode) {
      setStatusMessage({ type: 'error', text: 'Please select both source and destination intersections.' });
      return;
    }
    if (fromNode === toNode) {
      setStatusMessage({ type: 'error', text: 'Self-loops are not permitted in standard city networks.' });
      return;
    }
    const weightNum = parseFloat(roadWeight);
    if (isNaN(weightNum) || weightNum <= 0) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid positive road distance in km.' });
      return;
    }

    const res = addRoad({
      from: fromNode,
      to: toNode,
      name: `Corridor ${fromNode}-${toNode}`,
      weight: weightNum,
      trafficStatus: roadTraffic
    });

    if (res.success) {
      setStatusMessage({ type: 'success', text: `Edge ${fromNode}-${toNode} (${weightNum} km) added to the graph!` });
      setRoadWeight('');
    } else {
      setStatusMessage({ type: 'error', text: res.error });
    }
  };

  // Handle Remove Road
  const handleRemoveRoad = (roadId, roadLabel) => {
    removeRoad(roadId);
    setStatusMessage({ type: 'success', text: `Road edge ${roadLabel} removed from network graph.` });
  };

  // Connected roads for searched/selected node
  const activeFocusNode = selectedNode?.id || searchNode;
  const connectedRoads = roads.filter(
    (r) => r.from === activeFocusNode || r.to === activeFocusNode
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <GitFork className="w-5 h-5 text-cyan-400" />
            <span>Graph-Based Road Network Architecture</span>
          </h1>
          <p className="text-xs text-slate-400">
            Mathematical representation of urban topology: Vertices \( (V) \) as intersections and weighted Edges \( (E) \) as roads.
          </p>
        </div>
      </div>

      <ConceptExplainer title="Graph Data Structures in Intelligent Transportation" concept="Adjacency List & Graph Theory" defaultOpen={true}>
        <p>
          Urban road networks are naturally modeled as <strong>weighted graphs</strong>:
        </p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li><strong>Vertices (V):</strong> Traffic junctions, roundabouts, and key intersections where decisions/turns occur.</li>
          <li><strong>Edges (E):</strong> Roadways linking pairs of vertices. In this system, roads are bidirectional with non-negative edge weights representing distance (km) and congestion factor.</li>
          <li><strong>Adjacency List Representation:</strong> Stored as a hash map where each vertex maps to its incident edges (neighbor, weight, cost). Space complexity: O(V + E).</li>
        </ul>
      </ConceptExplainer>

      {/* STATUS MESSAGE ALERT */}
      {statusMessage && (
        <div
          className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
          }`}
        >
          <div className="flex items-center space-x-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs font-bold opacity-70 hover:opacity-100"
          >
            &times;
          </button>
        </div>
      )}

      {/* INTERACTIVE GRAPH CANVAS */}
      <InteractiveNetworkGraph
        intersections={intersections}
        roads={roads}
        selectedNode={selectedNode}
        onSelectNode={(node) => {
          setSelectedNode(node);
          setSearchNode(node.id);
        }}
        selectedEdge={selectedRoad}
        onSelectEdge={setSelectedRoad}
      />

      {/* OPERATIONS & CONTROLS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel 1: Add Intersection (Vertex) */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Plus className="w-4 h-4" />
            <h3 className="font-bold text-sm text-white">Add Vertex (Intersection)</h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Create a new node \( v \in V \) on the urban traffic plane.
          </p>

          <form onSubmit={handleAddIntersection} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Intersection ID (e.g. I, J, K)
              </label>
              <input
                type="text"
                maxLength={4}
                value={newInterId}
                onChange={(e) => setNewInterId(e.target.value)}
                placeholder="e.g. I"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 uppercase font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Junction Name
              </label>
              <input
                type="text"
                value={newInterName}
                onChange={(e) => setNewInterName(e.target.value)}
                placeholder="e.g. Cyber Hills Junction"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Zone Classification
              </label>
              <select
                value={newInterType}
                onChange={(e) => setNewInterType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Standard">Standard Intersection</option>
                <option value="Commercial">Commercial District</option>
                <option value="Healthcare Zone">Healthcare Zone</option>
                <option value="IT Corridor">IT Corridor</option>
                <option value="Transit Hub">Transit Hub</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs transition shadow-md"
            >
              Add Intersection Vertex
            </button>
          </form>
        </div>

        {/* Panel 2: Add Road (Edge) */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Plus className="w-4 h-4" />
            <h3 className="font-bold text-sm text-white">Add Weighted Edge (Road)</h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Connect two vertices with a weighted road segment \( (u, v) \in E \).
          </p>

          <form onSubmit={handleAddRoad} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  From Node (u)
                </label>
                <select
                  value={fromNode}
                  onChange={(e) => setFromNode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="">Select</option>
                  {intersections.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.id} - {node.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  To Node (v)
                </label>
                <select
                  value={toNode}
                  onChange={(e) => setToNode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="">Select</option>
                  {intersections.map((node) => (
                    <option key={node.id} value={node.id}>
                      {node.id} - {node.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Weight (km)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={roadWeight}
                  onChange={(e) => setRoadWeight(e.target.value)}
                  placeholder="e.g. 4.5"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Traffic Level
                </label>
                <select
                  value={roadTraffic}
                  onChange={(e) => setRoadTraffic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Low">Low (1.0x)</option>
                  <option value="Medium">Medium (1.4x)</option>
                  <option value="High">High (2.0x)</option>
                  <option value="Critical">Critical (3.5x)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition shadow-md"
            >
              Add Road Edge
            </button>
          </form>
        </div>

        {/* Panel 3: Node Search & Connected Degree Explorer */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-cyan-400">
            <Search className="w-4 h-4" />
            <h3 className="font-bold text-sm text-white">Search Connected Routes</h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Query vertex degree: inspect all incident edges entering or exiting node.
          </p>

          <div className="flex items-center space-x-2">
            <select
              value={activeFocusNode}
              onChange={(e) => {
                setSearchNode(e.target.value);
                setSelectedNode(intersections.find((n) => n.id === e.target.value) || null);
              }}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            >
              {intersections.map((node) => (
                <option key={node.id} value={node.id}>
                  Intersection {node.id}: {node.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Vertex Degree:</span>
              <span className="font-mono text-cyan-400 font-bold">
                {connectedRoads.length} Connected Roads
              </span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {connectedRoads.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No roads connected to this vertex.</p>
              ) : (
                connectedRoads.map((road) => {
                  const neighbor = road.from === activeFocusNode ? road.to : road.from;
                  return (
                    <div
                      key={road.id}
                      className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-white">
                          &harr; Node {neighbor}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {road.weight} km | {road.trafficStatus}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveRoad(road.id, `${road.from}-${road.to}`)}
                        className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 transition"
                        title="Delete road edge"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
