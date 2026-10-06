import React, { useState } from 'react';
import {
  MapPin,
  AlertTriangle,
  Zap,
  Info,
  Car,
  ShieldCheck,
  Maximize2
} from 'lucide-react';

export const InteractiveNetworkGraph = ({
  intersections,
  roads,
  highlightedPath = [],
  highlightedEdges = [],
  selectedNode = null,
  onSelectNode = () => {},
  selectedEdge = null,
  onSelectEdge = () => {},
  isEmergencyActive = false
}) => {
  // SVG bounding box and coordinate scaling
  const viewBoxWidth = 840;
  const viewBoxHeight = 440;

  // Traffic status color scheme
  const getTrafficColor = (status) => {
    switch (status) {
      case 'Critical': return '#ef4444'; // Red
      case 'High': return '#f97316'; // Orange
      case 'Medium': return '#eab308'; // Yellow
      case 'Low':
      default: return '#10b981'; // Emerald
    }
  };

  return (
    <div className="relative w-full bg-slate-950/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-4">
      {/* Graph Toolbar / Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 text-xs border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 font-semibold text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>Vertices: {intersections.length} Intersections</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center space-x-1.5 font-semibold text-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
            <span>Edges: {roads.length} Weighted Roads</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-400">
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Low (1.0x)</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Medium (1.4x)</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            <span>High (2.0x)</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Critical (3.5x)</span>
          </div>
          {highlightedPath.length > 0 && (
            <div className="flex items-center space-x-1 text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/80">
              <Zap className="w-3 h-3 text-cyan-400" />
              <span>Dijkstra Path</span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive SVG Canvas */}
      <div className="relative w-full aspect-[21/11] bg-slate-900/60 rounded-xl overflow-hidden border border-slate-800/60 flex items-center justify-center">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-full select-none"
        >
          {/* DEFINITIONS FOR GLOWS AND MARKERS */}
          <defs>
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-emergency" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* EDGES (ROADS) */}
          {roads.map((road) => {
            const sourceNode = intersections.find(n => n.id === road.from);
            const targetNode = intersections.find(n => n.id === road.to);
            if (!sourceNode || !targetNode) return null;

            const isHighlighted = highlightedEdges.includes(road.id) || 
              (highlightedPath.includes(road.from) && highlightedPath.includes(road.to) &&
               Math.abs(highlightedPath.indexOf(road.from) - highlightedPath.indexOf(road.to)) === 1);
            
            const isSelected = selectedEdge?.id === road.id;
            const strokeColor = isEmergencyActive && isHighlighted 
              ? '#f43f5e' 
              : isHighlighted 
                ? '#06b6d4' 
                : getTrafficColor(road.trafficStatus);

            const midX = (sourceNode.x + targetNode.x) / 2;
            const midY = (sourceNode.y + targetNode.y) / 2;

            return (
              <g 
                key={road.id} 
                className="cursor-pointer group"
                onClick={() => onSelectEdge(road)}
              >
                {/* Wider invisible stroke for easy clicking */}
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke="transparent"
                  strokeWidth="20"
                />

                {/* Road Line Base */}
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={isSelected ? '#ffffff' : strokeColor}
                  strokeWidth={isHighlighted ? '5' : isSelected ? '4' : '2.5'}
                  strokeDasharray={road.status === 'Closed' ? '6,6' : 'none'}
                  strokeOpacity={isHighlighted ? 1 : 0.8}
                  filter={isHighlighted ? (isEmergencyActive ? 'url(#glow-emergency)' : 'url(#glow-cyan)') : 'none'}
                  className="transition-all duration-300"
                />

                {/* Animated pulse line for Dijkstra Route */}
                {isHighlighted && (
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeDasharray="8,8"
                    className="animate-pulse"
                  />
                )}

                {/* Road Weight Badge / Label */}
                <g transform={`translate(${midX}, ${midY})`}>
                  <rect
                    x="-24"
                    y="-11"
                    width="48"
                    height="22"
                    rx="6"
                    fill="#020617"
                    stroke={isSelected ? '#38bdf8' : '#334155'}
                    strokeWidth="1.5"
                    className="transition-all"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill={isHighlighted ? '#38bdf8' : '#cbd5e1'}
                    fontSize="10"
                    fontWeight="600"
                    fontFamily="monospace"
                  >
                    {road.weight}km
                  </text>
                </g>
              </g>
            );
          })}

          {/* VERTICES (INTERSECTIONS) */}
          {intersections.map((node) => {
            const isHighlighted = highlightedPath.includes(node.id);
            const isSelected = selectedNode?.id === node.id;
            const isStart = highlightedPath[0] === node.id;
            const isEnd = highlightedPath[highlightedPath.length - 1] === node.id;

            let circleFill = '#0f172a';
            let circleStroke = '#38bdf8';

            if (isSelected) {
              circleFill = '#0284c7';
              circleStroke = '#ffffff';
            } else if (isStart) {
              circleFill = '#10b981';
              circleStroke = '#34d399';
            } else if (isEnd) {
              circleFill = isEmergencyActive ? '#e11d48' : '#6366f1';
              circleStroke = '#f43f5e';
            } else if (isHighlighted) {
              circleFill = '#0e7490';
              circleStroke = '#22d3ee';
            }

            return (
              <g
                key={node.id}
                className="cursor-pointer group"
                onClick={() => onSelectNode(node)}
                transform={`translate(${node.x}, ${node.y})`}
              >
                {/* Node halo ring on highlight */}
                {isHighlighted && (
                  <circle
                    r="24"
                    fill="none"
                    stroke={isStart ? '#10b981' : isEnd ? '#f43f5e' : '#38bdf8'}
                    strokeWidth="2"
                    strokeDasharray="4,4"
                    className="animate-spin"
                    style={{ transformOrigin: '0 0', animationDuration: '8s' }}
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  r="18"
                  fill={circleFill}
                  stroke={circleStroke}
                  strokeWidth={isSelected ? '3' : '2'}
                  className="transition-all duration-300 drop-shadow-md group-hover:scale-110"
                />

                {/* Node ID label */}
                <text
                  x="0"
                  y="4.5"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {node.id}
                </text>

                {/* Node Name Sub-badge */}
                <text
                  x="0"
                  y="28"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="9.5"
                  fontWeight="500"
                  className="pointer-events-none drop-shadow-sm group-hover:fill-cyan-300"
                >
                  {node.name.length > 18 ? node.name.slice(0, 16) + '...' : node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
        <span>Click on any vertex (intersection) or edge (road) to inspect details</span>
        <span className="font-mono text-cyan-400">Adjacency Graph Engine Active</span>
      </div>
    </div>
  );
};
