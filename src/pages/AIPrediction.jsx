import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  Brain
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useCity } from '../context/CityContext';
import { ConceptExplainer } from '../components/ConceptExplainer';

export const AIPrediction = () => {
  const { predictions } = useCity();
  const [selectedInterval, setSelectedInterval] = useState(predictions[2]); // 10:00

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>AI Traffic Prediction & Proactive Congestion Modeling</span>
            </h1>
            <span className="text-[10px] font-mono bg-purple-950/80 text-purple-300 border border-purple-800/80 px-2 py-0.5 rounded-full">
              Simulated AI Inference
            </span>
          </div>
          <p className="text-xs text-slate-400">
            LSTM & Temporal Graph Neural Network (GNN) simulation anticipating urban congestion surges 30-180 minutes in advance.
          </p>
        </div>
      </div>

      <ConceptExplainer title="Machine Learning & Graph Neural Networks (GNNs)" concept="Spatial-Temporal Traffic Prediction" defaultOpen={true}>
        <p>
          "AI-based traffic prediction can help anticipate congestion and improve route optimization before gridlocks materialize."
        </p>
        <p className="mt-1">
          By combining historical inductive sensor telemetry with <strong>Spatial-Temporal Graph Convolutional Networks (ST-GCN)</strong>, the model forecasts dynamic edge weights across future time windows. Dijkstra's algorithm can then route emergency fleets proactively through corridors that are projected to stay fluid.
        </p>
      </ConceptExplainer>

      {/* FORECAST METRICS SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400">Selected Horizon</span>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {selectedInterval.time} HRS
          </div>
          <span className="text-[11px] text-purple-400">Peak Surge Window</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400">Predicted Congestion Level</span>
          <div className={`text-2xl font-bold font-mono mt-1 ${
            selectedInterval.level === 'Critical' ? 'text-rose-400' : selectedInterval.level === 'High' ? 'text-orange-400' : 'text-emerald-400'
          }`}>
            {selectedInterval.level} ({selectedInterval.predicted}%)
          </div>
          <span className="text-[11px] text-slate-400">Ground truth: {selectedInterval.actual}%</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400">AI Confidence Score</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {selectedInterval.confidence}%
          </div>
          <span className="text-[11px] text-slate-400">R² = 0.941 on validation set</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400">Expected Corridor Delay</span>
          <div className="text-2xl font-bold text-amber-400 font-mono mt-1">
            +{selectedInterval.expectedDelaysMin} min
          </div>
          <span className="text-[11px] text-slate-400">Recommend early bypass routing</span>
        </div>
      </div>

      {/* AI PREDICTION TIMELINE CHART */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span>Multi-Hour Traffic Congestion Forecast (Actual vs Predicted Density %)</span>
            </h3>
            <p className="text-xs text-slate-400">Continuous simulated GNN inference output across peak city operating cycles</p>
          </div>
          <span className="text-[11px] text-purple-300 font-mono bg-purple-950/60 px-2 py-1 rounded border border-purple-800">
            Model: SpatioTemporal-GNN-v3
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={predictions}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
              />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#06b6d4" strokeWidth={2.5} name="Observed Density (%)" />
              <Line type="monotone" dataKey="predicted" stroke="#a855f7" strokeWidth={2.5} strokeDasharray="5 5" name="AI Predicted (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* HOURLY INTERVAL CARDS */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-white">Select Hourly Prediction Interval</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {predictions.map((p) => {
            const isSelected = selectedInterval.time === p.time;
            return (
              <button
                key={p.time}
                onClick={() => setSelectedInterval(p)}
                className={`p-3 rounded-xl border text-left transition ${
                  isSelected
                    ? 'bg-purple-950/60 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="font-bold text-white">{p.time}</span>
                  <span className="text-[10px] text-purple-400">{p.confidence}%</span>
                </div>
                <div className={`text-xs font-bold ${
                  p.level === 'Critical' ? 'text-rose-400' : p.level === 'High' ? 'text-orange-400' : 'text-emerald-400'
                }`}>
                  {p.level}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Delay: +{p.expectedDelaysMin}m
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI RECOMMENDATION / PROACTIVE DISPATCH CARD */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/40 space-y-3">
        <div className="flex items-center space-x-2 text-purple-400">
          <Brain className="w-5 h-5" />
          <h3 className="font-bold text-sm text-white">AI Predictive Dispatch Recommendation</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          At <strong>{selectedInterval.time}</strong>, anticipated congestion reaches <strong>{selectedInterval.predicted}% ({selectedInterval.level})</strong>. 
          The AI engine recommends pre-configuring traffic signals at Intersection F (Downtown Plaza) to add +15s green extension for North-South corridors and redirecting non-emergency logistics through Central Bypass C-D.
        </p>
      </div>
    </div>
  );
};
