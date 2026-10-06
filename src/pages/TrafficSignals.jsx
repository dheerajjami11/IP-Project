import React, { useState, useEffect } from 'react';
import {
  TrafficCone,
  Zap,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Siren,
  Sliders,
  Clock,
  Car,
  Activity,
  ShieldAlert
} from 'lucide-react';
import { useCity } from '../context/CityContext';
import { ConceptExplainer } from '../components/ConceptExplainer';

export const TrafficSignals = () => {
  const {
    signals,
    emergencyOverrideActive,
    overriddenSignalId,
    triggerEmergencySignalOverride,
    resetEmergencySignalOverride
  } = useCity();

  // Local simulated countdown tick for realistic control room aesthetics
  const [signalStates, setSignalStates] = useState(signals);
  const [activeSimulationInter, setActiveSimulationInter] = useState('E');

  useEffect(() => {
    setSignalStates(signals);
  }, [signals]);

  // Simulation step: cycle active lights
  useEffect(() => {
    const interval = setInterval(() => {
      setSignalStates((prev) =>
        prev.map((sig) => {
          if (sig.emergencyPriority) return sig; // lock to green during emergency
          // Toggle or decrement
          return {
            ...sig,
            greenTime: sig.status === 'Green' ? Math.max(5, sig.greenTime - 1) : sig.greenTime
          };
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate vehicle approach override
  const handleSimulateEmergencyApproach = (intersectionId) => {
    triggerEmergencySignalOverride(intersectionId);
    setActiveSimulationInter(intersectionId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <TrafficCone className="w-5 h-5 text-amber-400" />
            <span>Smart Traffic Signal Management & Preemption</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time adaptive split-phase traffic signal controllers with automated emergency vehicle preemption (EVP).
          </p>
        </div>

        {emergencyOverrideActive ? (
          <button
            onClick={resetEmergencySignalOverride}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition flex items-center space-x-2 border border-slate-700 shadow-md"
          >
            <RotateCcw className="w-4 h-4 text-cyan-400" />
            <span>Reset Preemption Override</span>
          </button>
        ) : (
          <button
            onClick={() => handleSimulateEmergencyApproach('E')}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition flex items-center space-x-2 shadow-lg shadow-rose-600/30"
          >
            <Siren className="w-4 h-4 animate-pulse" />
            <span>Simulate Approaching Ambulance</span>
          </button>
        )}
      </div>

      <ConceptExplainer title="Traffic Signal Preemption Algorithms" concept="Priority State Transitions" defaultOpen={true}>
        <p>
          Conventional fixed-time signals cause catastrophic delays for emergency responders trapped at red lights.
        </p>
        <p className="mt-1">
          Our <strong>Smart Signal Preemption System</strong> introduces an algorithmic interrupt cycle:
        </p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li><strong>Detection:</strong> When an emergency vehicle is detected within a 500-meter radius of vertex \( v \).</li>
          <li><strong>Preemption:</strong> Conflicting traffic phases are truncated through an immediate yellow clearance phase.</li>
          <li><strong>Green Wave Extension:</strong> The approaching direction is awarded an extended Green phase until optical/GPS transponder signals verify intersection clearance.</li>
        </ul>
      </ConceptExplainer>

      {/* EMERGENCY PRIORITY ACTIVE BANNER */}
      {emergencyOverrideActive && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border-2 border-rose-500 animate-pulse flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center">
              <Siren className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">EMERGENCY PRIORITY ACTIVE &bull; SIGNAL PREEMPTION ENGAGED</h3>
              <p className="text-xs text-rose-200">
                Green corridor established for Intersection {activeSimulationInter}. Cross traffic signals safely locked to RED.
              </p>
            </div>
          </div>
          <button
            onClick={resetEmergencySignalOverride}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs"
          >
            Clear Override
          </button>
        </div>
      )}

      {/* SIGNAL GRIDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {signalStates.map((sig) => {
          const isOverridden = sig.emergencyPriority || (emergencyOverrideActive && sig.intersectionId === activeSimulationInter);

          return (
            <div
              key={sig.id}
              className={`p-4 rounded-2xl border transition shadow-lg ${
                isOverridden
                  ? 'bg-rose-950/40 border-rose-500/80 ring-2 ring-rose-500/30'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400">Intersection {sig.intersectionId}</span>
                  <h3 className="font-bold text-xs text-white">{sig.name}</h3>
                </div>

                {isOverridden ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500 text-white animate-pulse">
                    PRIORITY ON
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-400">
                    Cycle: {sig.cycleTime}s
                  </span>
                )}
              </div>

              {/* Physical Traffic Light Graphic */}
              <div className="flex items-center justify-center py-2">
                <div className="bg-slate-950 p-2 rounded-2xl border border-slate-800 flex items-center space-x-3 shadow-inner">
                  {/* Red Lamp */}
                  <div
                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                      sig.status === 'Red' && !isOverridden
                        ? 'bg-rose-500 border-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.8)]'
                        : 'bg-rose-950/40 border-rose-900 opacity-40'
                    }`}
                  />
                  {/* Yellow Lamp */}
                  <div
                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                      sig.status === 'Yellow' && !isOverridden
                        ? 'bg-amber-400 border-amber-200 shadow-[0_0_12px_rgba(251,191,36,0.8)]'
                        : 'bg-amber-950/40 border-amber-900 opacity-40'
                    }`}
                  />
                  {/* Green Lamp */}
                  <div
                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                      sig.status === 'Green' || isOverridden
                        ? 'bg-emerald-400 border-emerald-200 shadow-[0_0_14px_rgba(52,211,153,0.9)]'
                        : 'bg-emerald-950/40 border-emerald-900 opacity-40'
                    }`}
                  />
                </div>
              </div>

              {/* Status details */}
              <div className="space-y-2 mt-3 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Current Phase:</span>
                  <span className="font-bold text-white font-mono">{sig.activeDirection}</span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span>Vehicle Density:</span>
                  <span className={`font-bold font-mono ${
                    sig.vehicleDensity === 'Critical' ? 'text-rose-400' : sig.vehicleDensity === 'High' ? 'text-orange-400' : 'text-emerald-400'
                  }`}>
                    {sig.vehicleDensity} ({sig.waitingVehicles} queued)
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                  <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-center">
                    <span className="text-slate-500 text-[10px] block">Green Split</span>
                    <span className="text-emerald-400 font-bold">{sig.greenTime}s</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-center">
                    <span className="text-slate-500 text-[10px] block">Red Split</span>
                    <span className="text-rose-400 font-bold">{sig.redTime}s</span>
                  </div>
                </div>

                {/* Preempt trigger per intersection */}
                <button
                  onClick={() => handleSimulateEmergencyApproach(sig.intersectionId)}
                  className="w-full mt-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold transition border border-slate-700"
                >
                  Test Priority Preempt
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
