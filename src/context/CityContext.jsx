import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_INTERSECTIONS,
  INITIAL_ROADS,
  INITIAL_EMERGENCY_REQUESTS,
  INITIAL_SIGNALS,
  INITIAL_IOT_SENSORS,
  INITIAL_AI_PREDICTIONS
} from '../data/cityData';
import { EmergencyPriorityQueue } from '../algorithms/EmergencyQueue';
import { dijkstra } from '../algorithms/Dijkstra';

const CityContext = createContext(null);

export const CityProvider = ({ children }) => {
  const [intersections, setIntersections] = useState(INITIAL_INTERSECTIONS);
  const [roads, setRoads] = useState(INITIAL_ROADS);
  const [signals, setSignals] = useState(INITIAL_SIGNALS);
  const [sensors, setSensors] = useState(INITIAL_IOT_SENSORS);
  const [predictions] = useState(INITIAL_AI_PREDICTIONS);

  // Initialize Emergency Priority Queue state
  const [emergencyQueue, setEmergencyQueue] = useState(() => {
    const eq = new EmergencyPriorityQueue();
    INITIAL_EMERGENCY_REQUESTS.forEach(req => eq.enqueue(req));
    return eq;
  });

  const [activeEmergencies, setActiveEmergencies] = useState(
    INITIAL_EMERGENCY_REQUESTS.sort((a, b) => a.priority - b.priority)
  );

  const [selectedEmergency, setSelectedEmergency] = useState(
    INITIAL_EMERGENCY_REQUESTS[0] || null
  );

  // Signal priority override state
  const [emergencyOverrideActive, setEmergencyOverrideActive] = useState(false);
  const [overriddenSignalId, setOverriddenSignalId] = useState('SIG-E');

  // Interactive functions for Road Network
  const addIntersection = (newInter) => {
    // Validation
    if (intersections.some(i => i.id.toUpperCase() === newInter.id.toUpperCase())) {
      return { success: false, error: `Intersection with ID "${newInter.id}" already exists.` };
    }
    const node = {
      id: newInter.id.toUpperCase(),
      name: newInter.name || `Junction ${newInter.id.toUpperCase()}`,
      x: Number(newInter.x) || Math.floor(100 + Math.random() * 600),
      y: Number(newInter.y) || Math.floor(100 + Math.random() * 300),
      lat: Number(newInter.lat) || (17.40 + (Math.random() - 0.5) * 0.1),
      lng: Number(newInter.lng) || (78.48 + (Math.random() - 0.5) * 0.1),
      type: newInter.type || 'Standard',
      activeSignals: 4
    };
    setIntersections(prev => [...prev, node]);
    return { success: true };
  };

  const addRoad = (newRoad) => {
    const { from, to, weight, name } = newRoad;
    if (!from || !to || from === to) {
      return { success: false, error: 'Source and destination must be distinct intersections.' };
    }
    if (!intersections.some(i => i.id === from) || !intersections.some(i => i.id === to)) {
      return { success: false, error: 'One or both intersections do not exist.' };
    }
    // Check duplicate
    const exists = roads.some(r => 
      (r.from === from && r.to === to) || (r.from === to && r.to === from)
    );
    if (exists) {
      return { success: false, error: `Road between ${from} and ${to} already exists.` };
    }

    const road = {
      id: `R${roads.length + 1}`,
      from,
      to,
      name: name || `Corridor ${from}-${to}`,
      weight: parseFloat(weight) || 4.0,
      lanes: 4,
      trafficStatus: newRoad.trafficStatus || 'Low',
      density: 25,
      currentSpeed: 50,
      status: 'Open',
      incidents: null
    };

    setRoads(prev => [...prev, road]);
    return { success: true };
  };

  const removeRoad = (roadId) => {
    setRoads(prev => prev.filter(r => r.id !== roadId));
    return { success: true };
  };

  const updateRoadTraffic = (roadId, newTrafficStatus) => {
    setRoads(prev => prev.map(r => {
      if (r.id === roadId) {
        let density = 25;
        let speed = 55;
        if (newTrafficStatus === 'Medium') { density = 50; speed = 38; }
        if (newTrafficStatus === 'High') { density = 78; speed = 22; }
        if (newTrafficStatus === 'Critical') { density = 92; speed = 10; }
        return { ...r, trafficStatus: newTrafficStatus, density, currentSpeed: speed };
      }
      return r;
    }));
  };

  // Emergency Queue Actions
  const addEmergencyRequest = (req) => {
    if (!req.source || !req.destination) {
      return { success: false, error: 'Source and destination are mandatory.' };
    }
    if (req.source === req.destination) {
      return { success: false, error: 'Source and destination must be different.' };
    }

    const newReq = {
      id: `ER-${Math.floor(200 + Math.random() * 800)}`,
      vehicleId: req.vehicleId || `UNIT-${Math.floor(10 + Math.random() * 90)}`,
      type: req.type || 'Ambulance',
      priority: Number(req.priority) || 1,
      priorityLabel: req.priority === 1 ? 'Critical' : req.priority === 2 ? 'High' : req.priority === 3 ? 'Medium' : 'Low',
      source: req.source,
      destination: req.destination,
      patientCondition: req.patientCondition || 'Emergency Dispatch Alert',
      status: 'En Route',
      assignedSignalClearance: req.priority <= 2,
      timestamp: Date.now()
    };

    emergencyQueue.enqueue(newReq);
    const updatedList = emergencyQueue.getAllOrdered();
    setActiveEmergencies(updatedList);
    setSelectedEmergency(newReq);
    return { success: true, item: newReq };
  };

  const processHighestPriorityEmergency = () => {
    const highest = emergencyQueue.dequeue();
    if (highest) {
      const remaining = emergencyQueue.getAllOrdered();
      setActiveEmergencies(remaining);
      setSelectedEmergency(remaining[0] || null);
      return { success: true, processed: highest };
    }
    return { success: false, error: 'Priority Queue is currently empty.' };
  };

  const removeEmergency = (id) => {
    // Reconstruct heap without this item
    const newQ = new EmergencyPriorityQueue();
    activeEmergencies.filter(e => e.id !== id).forEach(e => newQ.enqueue(e));
    setEmergencyQueue(newQ);
    const remaining = newQ.getAllOrdered();
    setActiveEmergencies(remaining);
    if (selectedEmergency?.id === id) {
      setSelectedEmergency(remaining[0] || null);
    }
  };

  // Smart Signal Priority Trigger
  const triggerEmergencySignalOverride = (intersectionId) => {
    setEmergencyOverrideActive(true);
    setOverriddenSignalId(`SIG-${intersectionId}`);
    setSignals(prev => prev.map(sig => {
      if (sig.intersectionId === intersectionId) {
        return {
          ...sig,
          status: 'Green',
          emergencyPriority: true,
          greenTime: 90,
          redTime: 10
        };
      }
      return sig;
    }));
  };

  const resetEmergencySignalOverride = () => {
    setEmergencyOverrideActive(false);
    setSignals(prev => prev.map(sig => ({
      ...sig,
      emergencyPriority: false,
      greenTime: 45,
      redTime: 35
    })));
  };

  // Global aggregate stats
  const totalIntersections = intersections.length;
  const activeRoadsCount = roads.length;
  const congestedRoadsCount = roads.filter(r => r.trafficStatus === 'High' || r.trafficStatus === 'Critical').length;
  const activeEmergenciesCount = activeEmergencies.length;

  return (
    <CityContext.Provider
      value={{
        intersections,
        roads,
        signals,
        sensors,
        predictions,
        activeEmergencies,
        selectedEmergency,
        setSelectedEmergency,
        emergencyOverrideActive,
        overriddenSignalId,
        addIntersection,
        addRoad,
        removeRoad,
        updateRoadTraffic,
        addEmergencyRequest,
        processHighestPriorityEmergency,
        removeEmergency,
        triggerEmergencySignalOverride,
        resetEmergencySignalOverride,
        totalIntersections,
        activeRoadsCount,
        congestedRoadsCount,
        activeEmergenciesCount
      }}
    >
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) throw new Error('useCity must be used within CityProvider');
  return context;
};
