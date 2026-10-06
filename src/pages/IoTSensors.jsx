import React, { useState } from 'react';
import {
  Radio,
  Activity,
  Gauge,
  Wind,
  ShieldAlert,
  Car,
  Camera,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Cpu,
  Wifi,
  Sparkles
} from 'lucide-react';
import { useCity } from '../context/CityContext';
import { ConceptExplainer } from '../components/ConceptExplainer';

export const IoTSensors = () => {
  const { sensors } = useCity();
  const [sensorList, setSensorList] = useState(sensors);
  const [filter, setFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtered sensors
  const filtered = sensorList.filter((s) => {
    if (filter === 'All') return true;
    return s.status === filter;
  });

  // Simulate refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSensorList((prev) =>
        prev.map((s) => ({
          ...s,
          lastUpdate: 'Just now',
          health: s.status === 'Offline' ? 0 : Math.min(100, Math.floor(88 + Math.random() * 12))
        }))
      );
      setIsRefreshing(false);
    }, 600);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Online':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Warning':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Offline':
      default:
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Online':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'Warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'Offline':
      default:
        return <XCircle className="w-4 h-4 text-rose-400" />;
    }
  };

  const getSensorIcon = (iconName) => {
    switch (iconName) {
      case 'Car': return <Car className="w-5 h-5 text-cyan-400" />;
      case 'Gauge': return <Gauge className="w-5 h-5 text-blue-400" />;
      case 'Wind': return <Wind className="w-5 h-5 text-teal-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-amber-400" />;
      case 'Camera': return <Camera className="w-5 h-5 text-purple-400" />;
      case 'Activity':
      default:
        return <Activity className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-white flex items-center space-x-2">
              <Radio className="w-5 h-5 text-cyan-400" />
              <span>IoT Edge Telemetry & Urban Sensor Infrastructure</span>
            </h1>
            <span className="text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 px-2 py-0.5 rounded-full">
              Simulated Telemetry Feed
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time urban telemetry ingest pipeline: Inductive loops, Doppler radar, optical sensors, and environmental nodes.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition flex items-center space-x-2 border border-slate-700 shadow-md self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Sync Edge Gateways</span>
        </button>
      </div>

      <ConceptExplainer title="IoT Sensor Data Integration in Algorithmic Routing" concept="Edge Telemetry to Graph Weights" defaultOpen={true}>
        <p>
          "IoT sensors provide the empirical ground-truth telemetry required to dynamically calculate edge weights in graph-based routing."
        </p>
        <p className="mt-1">
          Each sensor node captures physical environmental variables (such as vehicle velocity via Doppler radar, occupancy percentage via inductive loops, or visibility). These continuous sensor readings are ingested at the edge and mapped directly to dynamic weight multipliers W(u, v) used by Dijkstra's shortest-path algorithm.
        </p>
      </ConceptExplainer>

      {/* FILTER TABS & SENSOR COUNTS */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          {['All', 'Online', 'Warning', 'Offline'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                filter === st
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              {st}
              <span className="ml-1.5 opacity-70 font-mono">
                ({st === 'All' ? sensorList.length : sensorList.filter((s) => s.status === st).length})
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span>Gateway Protocol: MQTT / CoAP over 5G-V2X</span>
        </div>
      </div>

      {/* SENSORS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((sensor) => (
          <div
            key={sensor.id}
            className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition space-y-4 shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                  {getSensorIcon(sensor.icon)}
                </div>
                <div>
                  <h3 className="font-bold text-xs text-white">{sensor.type}</h3>
                  <span className="text-[10px] font-mono text-cyan-400 block">{sensor.id}</span>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase font-mono flex items-center space-x-1 ${getStatusBadge(sensor.status)}`}>
                {getStatusIcon(sensor.status)}
                <span>{sensor.status}</span>
              </span>
            </div>

            {/* Reading Display */}
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400">Live Reading</span>
                <div className="text-lg font-bold text-white font-mono">{sensor.reading}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400">Metric Unit</span>
                <div className="text-xs font-semibold text-slate-300 font-mono">{sensor.unit}</div>
              </div>
            </div>

            {/* Telemetry metadata */}
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span>Deployment Site:</span>
                <span className="font-medium text-slate-200">{sensor.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Last Telemetry Heartbeat:</span>
                <span className="font-mono text-slate-300">{sensor.lastUpdate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Node Battery / Hardware Health:</span>
                <span className={`font-mono font-bold ${
                  sensor.health > 80 ? 'text-emerald-400' : sensor.health > 0 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {sensor.health}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
