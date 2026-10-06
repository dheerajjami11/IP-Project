import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Activity, AlertTriangle, Compass, Navigation, Radio } from 'lucide-react';

// Custom Map Marker icons
const createCustomIcon = (label, color = '#06b6d4') => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        color: white;
        border: 2px solid white;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-family: monospace;
        font-size: 13px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
      ">
        ${label}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
};

export const LeafletCityMap = ({
  intersections,
  roads,
  highlightedPath = [],
  onSelectNode = () => {},
  isEmergencyActive = false
}) => {
  // Center of city network
  const center = [17.4000, 78.4850];

  const getTrafficColor = (status) => {
    switch (status) {
      case 'Critical': return '#ef4444';
      case 'High': return '#f97316';
      case 'Medium': return '#eab308';
      case 'Low':
      default: return '#10b981';
    }
  };

  return (
    <div className="relative w-full h-[460px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
      >
        {/* Dark style OpenStreetMap CartoDB tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* ROADS (POLYLINES) */}
        {roads.map((road) => {
          const fromNode = intersections.find(n => n.id === road.from);
          const toNode = intersections.find(n => n.id === road.to);
          if (!fromNode || !toNode) return null;

          const isHighlighted = highlightedPath.length > 1 &&
            highlightedPath.includes(road.from) &&
            highlightedPath.includes(road.to) &&
            Math.abs(highlightedPath.indexOf(road.from) - highlightedPath.indexOf(road.to)) === 1;

          const positions = [
            [fromNode.lat, fromNode.lng],
            [toNode.lat, toNode.lng]
          ];

          const color = isHighlighted
            ? (isEmergencyActive ? '#f43f5e' : '#06b6d4')
            : getTrafficColor(road.trafficStatus);

          return (
            <Polyline
              key={road.id}
              positions={positions}
              pathOptions={{
                color: color,
                weight: isHighlighted ? 6 : 3.5,
                opacity: isHighlighted ? 1 : 0.75,
                dashArray: road.status === 'Closed' ? '5, 8' : undefined
              }}
            >
              <Tooltip sticky>
                <div className="text-xs p-1">
                  <p className="font-bold text-slate-900">{road.name}</p>
                  <p className="text-slate-700">Distance: {road.weight} km</p>
                  <p className="text-slate-700">Status: {road.trafficStatus} Congestion</p>
                  <p className="text-slate-700">Speed: {road.currentSpeed} km/h</p>
                </div>
              </Tooltip>
            </Polyline>
          );
        })}

        {/* INTERSECTIONS (MARKERS) */}
        {intersections.map((node) => {
          const isStart = highlightedPath[0] === node.id;
          const isEnd = highlightedPath[highlightedPath.length - 1] === node.id;
          const isPath = highlightedPath.includes(node.id);

          let markerColor = '#06b6d4';
          if (isStart) markerColor = '#10b981';
          else if (isEnd) markerColor = isEmergencyActive ? '#f43f5e' : '#6366f1';
          else if (isPath) markerColor = '#0284c7';

          return (
            <Marker
              key={node.id}
              position={[node.lat, node.lng]}
              icon={createCustomIcon(node.id, markerColor)}
              eventHandlers={{
                click: () => onSelectNode(node)
              }}
            >
              <Popup>
                <div className="text-xs p-1 text-slate-900">
                  <div className="font-bold border-b pb-1 mb-1 text-cyan-800">
                    [{node.id}] {node.name}
                  </div>
                  <p><strong>Type:</strong> {node.type}</p>
                  <p><strong>Active Signals:</strong> {node.activeSignals}</p>
                  <p><strong>Coordinates:</strong> {node.lat.toFixed(4)}, {node.lng.toFixed(4)}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Control Overlay */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700 text-xs text-slate-300 shadow-lg pointer-events-none">
        <div className="flex items-center space-x-2 font-semibold text-cyan-400 mb-0.5">
          <Compass className="w-3.5 h-3.5" />
          <span>GIS OpenStreetMap Layer</span>
        </div>
        <p className="text-[10px] text-slate-400">CartoDB Dark Tile Matrix</p>
      </div>
    </div>
  );
};
