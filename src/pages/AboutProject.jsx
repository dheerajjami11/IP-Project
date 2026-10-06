import React from 'react';
import {
  GitFork,
  Cpu,
  Layers,
  Sparkles,
  Radio,
  TrafficCone,
  Code2,
  BookOpen,
  Award,
  CheckCircle2
} from 'lucide-react';

export const AboutProject = () => {
  return (
    <div className="space-y-6 max-w-5xl">
      {/* Title Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/50 via-slate-900 to-slate-900 border border-cyan-500/30 space-y-3">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>Advanced Data Structures & Algorithms College Project</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          IP Project – SmartCity Traffic & Emergency Response System
        </h1>
        <p className="text-slate-300 text-xs leading-relaxed max-w-3xl">
          An interactive Intelligent Transportation System (ITS) control platform engineered to demonstrate real-world applications of Graph Theory, Dijkstra's Shortest Path Algorithm, and Min-Heap Priority Queues in urban emergency dispatch and dynamic congestion management.
        </p>
      </div>

      {/* CORE OBJECTIVES */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Project Objectives & Pedagogical Goals</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start space-x-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Graph-Based Road Network Modeling</span>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Represent city intersections as vertices (V) and roadway corridors as weighted edges (E) via dynamic Adjacency Lists.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start space-x-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Dijkstra's Shortest Path Algorithm</span>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Determine the lowest-cost travel trajectory incorporating real-time congestion multipliers: Effective Cost = Distance &times; Multiplier.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start space-x-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Min-Heap Emergency Vehicle Prioritization</span>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Ensure multi-tier emergency triage (Critical Cardiac vs Routine Escort) using O(log N) heap operations to prevent priority inversion.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start space-x-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Smart Signal Preemption Simulation</span>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Demonstrate automated Green Wave Corridors preempting conflicting phases when ambulances approach vertices.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start space-x-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">Performance & Asymptotic Scalability</span>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Benchmark O((V+E) log V) execution across Low (15 nodes), Medium (250 nodes), and High (1,500+ nodes) scale networks.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start space-x-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">IoT & AI Integration Roadmaps</span>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Simulate Doppler radar, inductive loops, and Spatial-Temporal Graph Neural Networks for predictive pre-allocation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CORE TECHNOLOGIES & DATA STRUCTURES MATRIX */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center space-x-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span>Core ADS Concepts & Engineering Stack</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-2">
              <GitFork className="w-4 h-4" />
            </div>
            <span className="font-bold text-white block">Graphs (V, E)</span>
            <span className="text-[10px] text-slate-400">Adjacency List</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-2">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-bold text-white block">Min-Heap</span>
            <span className="text-[10px] text-slate-400">Priority Queue</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-2">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="font-bold text-white block">Dijkstra's Algo</span>
            <span className="text-[10px] text-slate-400">O((V+E) log V)</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2">
              <TrafficCone className="w-4 h-4" />
            </div>
            <span className="font-bold text-white block">Smart Signals</span>
            <span className="text-[10px] text-slate-400">Preemption FSM</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-white block">Temporal AI</span>
            <span className="text-[10px] text-slate-400">Traffic Forecasting</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto mb-2">
              <Radio className="w-4 h-4" />
            </div>
            <span className="font-bold text-white block">IoT Telemetry</span>
            <span className="text-[10px] text-slate-400">Doppler & Loops</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-bold text-white block">Leaflet GIS</span>
            <span className="text-[10px] text-slate-400">CartoDB Dark Tiles</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto mb-2">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="font-bold text-white block">React + Vite</span>
            <span className="text-[10px] text-slate-400">Tailwind CSS v4</span>
          </div>
        </div>
      </div>

      {/* HOW TO RUN & EVALUATION NOTES */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <h3 className="font-bold text-sm text-white">Faculty Evaluation Guide</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          This web application was engineered for VS Code demonstration and viva defense. When showcasing to faculty, use the built-in <strong>"How it works"</strong> badges across the navigation bar. You can add custom vertices and edges in the <em>Road Network</em> tab, trigger Dijkstra's algorithm dynamically in <em>Route Optimization</em>, and execute priority extracts from the binary heap in <em>Emergency Response</em>.
        </p>
      </div>
    </div>
  );
};
