import { MinHeap } from './MinHeap';

/**
 * Dijkstra's Shortest Path Algorithm
 * 
 * Concept:
 * Computes the minimum cost / shortest travel distance path from a source node
 * to all other nodes in a weighted graph using a Min-Heap Priority Queue.
 * 
 * Time Complexity: O((V + E) log V) with Min-Heap
 * Space Complexity: O(V)
 * 
 * @param {Array} nodes - List of vertices { id, name, ... }
 * @param {Array} edges - List of roads { id, from, to, weight, trafficMultiplier, ... }
 * @param {string} sourceId - ID of start intersection
 * @param {string} targetId - ID of destination intersection
 * @param {boolean} considerTraffic - Whether to factor in road traffic congestion multiplier
 * @returns {Object} { path, totalDistance, totalTravelTime, visitedNodesCount, visitedOrder, distances }
 */
export function dijkstra(nodes, edges, sourceId, targetId, considerTraffic = true) {
  const startTime = performance.now();

  // 1. Build Adjacency List for Graph
  // Graph: nodeID -> [ { neighbor, weight, effectiveTime, edgeId, originalEdge } ]
  const adj = {};
  nodes.forEach(node => {
    adj[node.id] = [];
  });

  edges.forEach(edge => {
    // If road is closed, skip or infinite weight
    if (edge.status === 'Closed') return;

    // Traffic congestion penalty factor:
    // Low = 1.0x, Medium = 1.4x, High = 2.0x, Critical = 3.5x
    let congestionMultiplier = 1.0;
    if (considerTraffic) {
      switch (edge.trafficStatus) {
        case 'Medium': congestionMultiplier = 1.4; break;
        case 'High': congestionMultiplier = 2.0; break;
        case 'Critical': congestionMultiplier = 3.5; break;
        case 'Low':
        default: congestionMultiplier = 1.0; break;
      }
    }

    const effectiveWeight = edge.weight * congestionMultiplier;

    if (adj[edge.from]) {
      adj[edge.from].push({
        neighbor: edge.to,
        distance: edge.weight,
        cost: effectiveWeight,
        edgeId: edge.id,
        edge: edge,
      });
    }

    // Bidirectional roads
    if (adj[edge.to]) {
      adj[edge.to].push({
        neighbor: edge.from,
        distance: edge.weight,
        cost: effectiveWeight,
        edgeId: edge.id,
        edge: edge,
      });
    }
  });

  // 2. Initialize Distances, Previous map, and Min-Heap
  const distances = {};
  const actualDistances = {};
  const previous = {};
  const visitedOrder = [];

  nodes.forEach(node => {
    distances[node.id] = Infinity;
    actualDistances[node.id] = Infinity;
    previous[node.id] = null;
  });

  if (!adj[sourceId] || !adj[targetId]) {
    return {
      success: false,
      error: 'Source or target intersection not found in the graph network.',
      path: [],
      totalDistance: 0,
      totalTravelTime: 0,
      visitedNodesCount: 0,
      visitedOrder: [],
      executionTimeMs: 0
    };
  }

  distances[sourceId] = 0;
  actualDistances[sourceId] = 0;

  // Min-Heap ordered by cost
  const pq = new MinHeap((a, b) => a.cost - b.cost);
  pq.push({ id: sourceId, cost: 0 });

  const visitedSet = new Set();

  while (!pq.isEmpty()) {
    const current = pq.pop();
    const currId = current.id;
    const currCost = current.cost;

    if (visitedSet.has(currId)) continue;
    visitedSet.add(currId);
    visitedOrder.push(currId);

    // If reached destination, can break early or continue
    if (currId === targetId) {
      break;
    }

    if (currCost > distances[currId]) continue;

    const neighbors = adj[currId] || [];
    for (const edge of neighbors) {
      const neighborId = edge.neighbor;
      if (visitedSet.has(neighborId)) continue;

      const newCost = distances[currId] + edge.cost;
      if (newCost < distances[neighborId]) {
        distances[neighborId] = newCost;
        actualDistances[neighborId] = actualDistances[currId] + edge.distance;
        previous[neighborId] = {
          from: currId,
          edgeId: edge.edgeId,
          edge: edge.edge
        };
        pq.push({ id: neighborId, cost: newCost });
      }
    }
  }

  // 3. Reconstruct Shortest Path
  const path = [];
  const edgePath = [];
  let curr = targetId;

  if (distances[targetId] === Infinity) {
    return {
      success: false,
      error: `No viable path found between ${sourceId} and ${targetId}. Roads might be closed or disconnected.`,
      path: [],
      edgePath: [],
      totalDistance: 0,
      totalTravelTime: 0,
      visitedNodesCount: visitedSet.size,
      visitedOrder,
      executionTimeMs: Number((performance.now() - startTime).toFixed(3))
    };
  }

  while (curr) {
    path.unshift(curr);
    if (previous[curr]) {
      edgePath.unshift(previous[curr].edgeId);
      curr = previous[curr].from;
    } else {
      break;
    }
  }

  const endTime = performance.now();
  const rawDist = actualDistances[targetId];
  // Calculate estimated travel time: avg 35 km/h base speed
  const baseTimeMinutes = (rawDist / 35) * 60;
  // Cost represents congestion-weighted travel time factor
  const estimatedTravelTimeMinutes = (distances[targetId] / 35) * 60;

  return {
    success: true,
    sourceId,
    targetId,
    path, // Array of node IDs: ['A', 'C', 'E', 'F']
    edgePath, // Array of edge IDs
    totalDistance: Number(rawDist.toFixed(2)), // in km
    totalTravelTime: Number(estimatedTravelTimeMinutes.toFixed(1)), // in minutes
    baseTravelTime: Number(baseTimeMinutes.toFixed(1)),
    cost: Number(distances[targetId].toFixed(2)),
    visitedNodesCount: visitedSet.size,
    visitedOrder,
    executionTimeMs: Number((endTime - startTime).toFixed(3)),
    stepByStep: path.map((nodeId, idx) => ({
      step: idx + 1,
      intersection: nodeId,
      cumulativeDistance: Number(actualDistances[nodeId].toFixed(2)),
      cumulativeCost: Number(distances[nodeId].toFixed(2))
    }))
  };
}

/**
 * Find alternative routes (up to k shortest paths or different heuristic bypass)
 */
export function findAlternativeRoutes(nodes, edges, sourceId, targetId) {
  const primaryRoute = dijkstra(nodes, edges, sourceId, targetId, true);
  if (!primaryRoute.success) return [primaryRoute];

  const results = [{ ...primaryRoute, label: 'Optimal Smart Route (Traffic-Aware)' }];

  // Alternative 1: Shortest distance without traffic congestion factor
  const distanceOnly = dijkstra(nodes, edges, sourceId, targetId, false);
  if (distanceOnly.success && distanceOnly.path.join('-') !== primaryRoute.path.join('-')) {
    results.push({ ...distanceOnly, label: 'Shortest Distance Route (High Congestion Potential)' });
  }

  // Alternative 2: Route avoiding the highest congested edge on primary path
  if (primaryRoute.edgePath && primaryRoute.edgePath.length > 0) {
    const edgeToAvoid = primaryRoute.edgePath[0];
    const filteredEdges = edges.filter(e => e.id !== edgeToAvoid);
    const bypassRoute = dijkstra(nodes, filteredEdges, sourceId, targetId, true);
    if (bypassRoute.success && bypassRoute.path.join('-') !== primaryRoute.path.join('-')) {
      results.push({ ...bypassRoute, label: 'Bypass / Secondary Arterial Route' });
    }
  }

  return results;
}
