import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Filter,
  CheckCircle,
  Calendar,
  Layers,
  Printer,
  Sparkles,
  Activity,
  Siren,
  Navigation
} from 'lucide-react';
import { useCity } from '../context/CityContext';
import { ConceptExplainer } from '../components/ConceptExplainer';

export const Reports = () => {
  const { roads, activeEmergencies, intersections } = useCity();

  const [dateFilter, setDateFilter] = useState('Today');
  const [trafficFilter, setTrafficFilter] = useState('All');
  const [emergencyTypeFilter, setEmergencyTypeFilter] = useState('All');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Filtered roads
  const filteredRoads = roads.filter((r) => {
    if (trafficFilter === 'All') return true;
    return r.trafficStatus === trafficFilter;
  });

  // Filtered emergencies
  const filteredEmergencies = activeEmergencies.filter((e) => {
    if (emergencyTypeFilter === 'All') return true;
    return e.type === emergencyTypeFilter;
  });

  // Export CSV report generator
  const handleExportCSV = () => {
    const headers = ['Record_Type', 'ID', 'Entity_Name', 'Status_Priority', 'Key_Metric', 'Timestamp'];
    const rows = [];

    // Add road rows
    filteredRoads.forEach((r) => {
      rows.push(['ROAD_CORRIDOR', r.id, `"${r.name}"`, r.trafficStatus, `${r.currentSpeed} km/h`, new Date().toISOString()]);
    });

    // Add emergency rows
    filteredEmergencies.forEach((e) => {
      rows.push(['EMERGENCY_DISPATCH', e.id, `"${e.vehicleId} (${e.type})"`, `P${e.priority}_${e.priorityLabel}`, `"${e.source} to ${e.destination}"`, new Date(e.timestamp).toISOString()]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartCity_Traffic_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
            <span>Urban Mobility Reports & Incident Audit Log</span>
          </h1>
          <p className="text-xs text-slate-400">
            Comprehensive operational summaries for city planning commissions, emergency audit compliance, and route efficiency.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs transition flex items-center space-x-2 shadow-lg shadow-cyan-500/20 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Analytics Report (CSV)</span>
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Report CSV generated and downloaded successfully!</span>
        </div>
      )}

      {/* FILTER BAR */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="text-slate-400 font-semibold block mb-1">Time Horizon</label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="Today">Today (Real-Time Ingest)</option>
            <option value="Yesterday">Yesterday Peak Hours</option>
            <option value="Last 7 Days">Last 7 Days (Consolidated)</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400 font-semibold block mb-1">Traffic Level Filter</label>
          <select
            value={trafficFilter}
            onChange={(e) => setTrafficFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Traffic Levels</option>
            <option value="Low">Low Flow Only</option>
            <option value="Medium">Medium Flow Only</option>
            <option value="High">High Flow Only</option>
            <option value="Critical">Critical Bottlenecks Only</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400 font-semibold block mb-1">Emergency Vehicle Filter</label>
          <select
            value={emergencyTypeFilter}
            onChange={(e) => setEmergencyTypeFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Emergency Types</option>
            <option value="Ambulance">Ambulances Only</option>
            <option value="Fire Service">Fire Service Only</option>
            <option value="Police">Police Escorts Only</option>
          </select>
        </div>
      </div>

      {/* SUMMARY KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400">Total Filtered Roads</span>
          <div className="text-2xl font-bold text-white font-mono mt-1">{filteredRoads.length}</div>
          <span className="text-[11px] text-cyan-400">Network segments inspected</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400">Emergencies in Audit Scope</span>
          <div className="text-2xl font-bold text-rose-400 font-mono mt-1">{filteredEmergencies.length}</div>
          <span className="text-[11px] text-rose-300">Min-Heap prioritized records</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400">Average Corridor Speed</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {(filteredRoads.reduce((acc, r) => acc + r.currentSpeed, 0) / Math.max(1, filteredRoads.length)).toFixed(1)} km/h
          </div>
          <span className="text-[11px] text-slate-400">Across monitored edges</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] text-slate-400">Network Health Score</span>
          <div className="text-2xl font-bold text-purple-400 font-mono mt-1">94.2%</div>
          <span className="text-[11px] text-slate-400">Based on throughput capacity</span>
        </div>
      </div>

      {/* REPORT AUDIT TABLES */}
      <div className="space-y-6">
        {/* Table 1: Emergency Response Audit Summary */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
            <Siren className="w-4 h-4" />
            <h3 className="text-white">Emergency Dispatch Audit Log</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[10px] uppercase font-mono text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Call Sign</th>
                  <th className="p-2.5">Vehicle Type</th>
                  <th className="p-2.5">Priority Level</th>
                  <th className="p-2.5">Route</th>
                  <th className="p-2.5">Patient / Incident Details</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredEmergencies.map((er) => (
                  <tr key={er.id} className="hover:bg-slate-800/40">
                    <td className="p-2.5 font-bold text-white">{er.vehicleId}</td>
                    <td className="p-2.5 text-slate-300 font-sans">{er.type}</td>
                    <td className="p-2.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        er.priority === 1 ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        P{er.priority} - {er.priorityLabel}
                      </span>
                    </td>
                    <td className="p-2.5 text-cyan-400">{er.source} &rarr; {er.destination}</td>
                    <td className="p-2.5 text-slate-400 font-sans">{er.patientCondition}</td>
                    <td className="p-2.5 text-emerald-400">{er.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Road Congestion & Velocity Audit */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm">
            <Activity className="w-4 h-4" />
            <h3 className="text-white">Road Segment Congestion Audit</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[10px] uppercase font-mono text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Edge ID</th>
                  <th className="p-2.5">Corridor Name</th>
                  <th className="p-2.5">Terminals</th>
                  <th className="p-2.5">Length (km)</th>
                  <th className="p-2.5">Density</th>
                  <th className="p-2.5">Velocity</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredRoads.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/40">
                    <td className="p-2.5 font-bold text-cyan-400">{r.id}</td>
                    <td className="p-2.5 text-white font-sans">{r.name}</td>
                    <td className="p-2.5 text-slate-300">{r.from} &harr; {r.to}</td>
                    <td className="p-2.5 text-slate-300">{r.weight} km</td>
                    <td className="p-2.5 text-amber-400">{r.density}%</td>
                    <td className="p-2.5 text-emerald-400">{r.currentSpeed} km/h</td>
                    <td className="p-2.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        r.trafficStatus === 'Critical' ? 'bg-rose-500/20 text-rose-400' : r.trafficStatus === 'High' ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {r.trafficStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
