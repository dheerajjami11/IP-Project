import React, { useState } from 'react';
import {
  Siren,
  Plus,
  Play,
  Trash2,
  CheckCircle2,
  Layers,
  Flame,
  Shield,
  Radio
} from 'lucide-react';
import { useCity } from '../context/CityContext';
import { dijkstra } from '../algorithms/Dijkstra';
import { ConceptExplainer } from '../components/ConceptExplainer';
import { InteractiveNetworkGraph } from '../components/InteractiveNetworkGraph';
import { LeafletCityMap } from '../components/LeafletCityMap';

export const EmergencyResponse = () => {
  const {
    intersections,
    roads,
    activeEmergencies,
    selectedEmergency,
    setSelectedEmergency,
    addEmergencyRequest,
    processHighestPriorityEmergency,
    removeEmergency,
    triggerEmergencySignalOverride
  } = useCity();

  // Form input state
  const [vehicleId, setVehicleId] = useState('');
  const [vehicleType, setVehicleType] = useState('Ambulance');
  const [priority, setPriority] = useState(1);
  const [source, setSource] = useState('A');
  const [destination, setDestination] = useState('E');
  const [condition, setCondition] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [viewMode, setViewMode] = useState('graph');

  // Calculate live emergency route for selected emergency
  const activeRoute = selectedEmergency
    ? dijkstra(intersections, roads, selectedEmergency.source, selectedEmergency.destination, true)
    : null;

  // Handle Add Request
  const handleAddEmergency = (e) => {
    e.preventDefault();
    const res = addEmergencyRequest({
      vehicleId: vehicleId.trim() || undefined,
      type: vehicleType,
      priority: Number(priority),
      source,
      destination,
      patientCondition: condition.trim() || undefined
    });

    if (res.success) {
      setFeedbackMsg({
        type: 'success',
        text: `New Emergency [${res.item.vehicleId}] enqueued with Priority ${priority} (${res.item.priorityLabel})!`
      });
      setVehicleId('');
      setCondition('');
    } else {
      setFeedbackMsg({ type: 'error', text: res.error });
    }
  };

  // Handle Dequeue / Process
  const handleProcessHighest = () => {
    const res = processHighestPriorityEmergency();
    if (res.success) {
      // Trigger signal override on the destination or source intersection
      triggerEmergencySignalOverride(res.processed.destination);
      setFeedbackMsg({
        type: 'success',
        text: `PROCESSED HIGHEST PRIORITY: [${res.processed.vehicleId} - ${res.processed.priorityLabel}] dispatched with green corridor clearance!`
      });
    } else {
      setFeedbackMsg({ type: 'error', text: res.error });
    }
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 1:
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 2:
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 3:
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 4:
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    }
  };

  const getVehicleIcon = (type) => {
    switch (type) {
      case 'Fire Service':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'Police':
        return <Shield className="w-4 h-4 text-blue-400" />;
      case 'Ambulance':
      default:
        return <Siren className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <Siren className="w-5 h-5 text-rose-500 animate-pulse" />
            <span>Emergency Vehicle Priority Queue & Routing Dispatch</span>
          </h1>
          <p className="text-xs text-slate-400">
            Min-Heap priority scheduler for multi-tier emergency dispatch, traffic preemption & green corridor routing.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('graph')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'graph' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Graph View
          </button>
          <button
            onClick={() => setViewMode('gis')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'gis' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            GIS Map View
          </button>
        </div>
      </div>

      <ConceptExplainer title="Min-Heap Priority Queue in Emergency Management" concept="Min-Heap & Priority Queues" defaultOpen={true}>
        <p>
          Emergency response cannot use a basic First-In-First-Out (FIFO) queue. A critical cardiac trauma call must always preempt a routine low-priority police escort regardless of call order.
        </p>
        <p className="mt-1">
          Our scheduling engine implements a <strong>Binary Min-Heap</strong>:
        </p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li><strong>Priority Levels:</strong> 1 = Critical, 2 = High, 3 = Medium, 4 = Low.</li>
          <li><strong>Insert (Enqueue):</strong> O(log N) bubble-up operation.</li>
          <li><strong>Extract-Min (Dequeue):</strong> O(log N) bubble-down operation guaranteeing the most critical vehicle is immediately processed.</li>
        </ul>
      </ConceptExplainer>

      {/* FEEDBACK BANNER */}
      {feedbackMsg && (
        <div
          className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
            feedbackMsg.type === 'success'
              ? 'bg-rose-950/60 border-rose-500/50 text-rose-200'
              : 'bg-amber-950/60 border-amber-500/50 text-amber-200'
          }`}
        >
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-rose-400" />
            <span>{feedbackMsg.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-xs font-bold opacity-70 hover:opacity-100"
          >
            &times;
          </button>
        </div>
      )}

      {/* QUEUE ACTIONS BAR & ACTIVE EMERGENCY SUMMARY */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Total Enqueued Requests</div>
            <div className="text-lg font-bold text-white font-mono">
              {activeEmergencies.length} Units In Min-Heap
            </div>
          </div>
        </div>

        <button
          onClick={handleProcessHighest}
          disabled={activeEmergencies.length === 0}
          className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/30"
        >
          <Play className="w-4 h-4" />
          <span>Process Highest-Priority Request (Extract-Min)</span>
        </button>
      </div>

      {/* MAIN TWO-COLUMN WORKBENCH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Priority Queue List & Enqueue Form */}
        <div className="space-y-6">
          {/* Active Priority Queue List */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-rose-400" />
                <span>Priority-Ordered Queue (Min-Heap Order)</span>
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">O(1) Peek Top</span>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {activeEmergencies.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs italic">
                  Priority queue is empty. Enqueue a new request below.
                </div>
              ) : (
                activeEmergencies.map((er) => {
                  const isSelected = selectedEmergency?.id === er.id;
                  return (
                    <div
                      key={er.id}
                      onClick={() => setSelectedEmergency(er)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                        isSelected
                          ? 'bg-rose-950/40 border-rose-500 text-white shadow-md'
                          : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center space-x-2">
                          {getVehicleIcon(er.type)}
                          <span className="font-bold">{er.vehicleId}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase font-mono ${getPriorityBadge(er.priority)}`}>
                            P{er.priority} {er.priorityLabel}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeEmergency(er.id);
                            }}
                            className="p-1 rounded text-slate-500 hover:text-rose-400"
                            title="Remove request"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>
                          {er.source} &rarr; {er.destination} ({er.type})
                        </span>
                        <span className="font-mono text-cyan-400">{er.status}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Enqueue New Emergency Request Form */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center space-x-2 text-rose-400">
              <Plus className="w-4 h-4" />
              <h3 className="font-bold text-sm text-white">Enqueue Emergency Request</h3>
            </div>

            <form onSubmit={handleAddEmergency} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Vehicle Call Sign
                  </label>
                  <input
                    type="text"
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    placeholder="e.g. AMB-99"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="Ambulance">Ambulance</option>
                    <option value="Fire Service">Fire Service</option>
                    <option value="Police">Police Escort</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Priority Level (Min-Heap Key)
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                >
                  <option value={1}>1 - Critical (Trauma, Cardiac, 3-Alarm Fire)</option>
                  <option value={2}>2 - High (Structural Fire, Armed Police)</option>
                  <option value={3}>3 - Medium (Medical Transfer, Traffic Assist)</option>
                  <option value={4}>4 - Low (Non-urgent escort / Patrol)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Source Node
                  </label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                  >
                    {intersections.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.id} - {n.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Target Destination
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
                  >
                    {intersections.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.id} - {n.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Incident Nature / Condition
                </label>
                <input
                  type="text"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  placeholder="e.g. Major accident casualty dispatch"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs transition shadow-md"
              >
                Insert into Priority Queue
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Selected Emergency Telemetry & Visual Route */}
        <div className="lg:col-span-2 space-y-4">
          {selectedEmergency ? (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-rose-500/40 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center">
                    {getVehicleIcon(selectedEmergency.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      {selectedEmergency.vehicleId} &bull; {selectedEmergency.type}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Incident: {selectedEmergency.patientCondition}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono ${getPriorityBadge(selectedEmergency.priority)}`}>
                    Priority Level {selectedEmergency.priority}
                  </span>
                  <button
                    onClick={() => triggerEmergencySignalOverride(selectedEmergency.destination)}
                    className="px-2.5 py-1 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 text-xs rounded-lg font-medium transition"
                  >
                    Activate Green Corridor
                  </button>
                </div>
              </div>

              {/* Dynamic Dijkstra Metrics for this vehicle */}
              {activeRoute?.success && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400">Dijkstra Fast Route</span>
                    <p className="font-bold text-cyan-400 text-xs mt-0.5 font-mono">
                      {activeRoute.path.join(' \u2192 ')}
                    </p>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400">Distance</span>
                    <p className="font-bold text-white text-xs mt-0.5 font-mono">
                      {activeRoute.totalDistance} km
                    </p>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400">Est. Response ETA</span>
                    <p className="font-bold text-rose-400 text-xs mt-0.5 font-mono">
                      {(activeRoute.totalTravelTime * 0.7).toFixed(1)} min (Sirens Active)
                    </p>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400">Signal Priority</span>
                    <p className="font-bold text-emerald-400 text-xs mt-0.5">
                      Preemption Armed
                    </p>
                  </div>
                </div>
              )}

              {/* Map or Graph */}
              {viewMode === 'graph' ? (
                <InteractiveNetworkGraph
                  intersections={intersections}
                  roads={roads}
                  highlightedPath={activeRoute?.path || []}
                  highlightedEdges={activeRoute?.edgePath || []}
                  isEmergencyActive={true}
                />
              ) : (
                <LeafletCityMap
                  intersections={intersections}
                  roads={roads}
                  highlightedPath={activeRoute?.path || []}
                  isEmergencyActive={true}
                />
              )}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-slate-400 text-xs">
              Select an emergency call sign from the Priority Queue to display its real-time Dijkstra green route.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
