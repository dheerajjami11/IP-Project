import { MinHeap } from './MinHeap';

/**
 * Emergency Vehicle Priority Queue Manager
 * 
 * Manages dispatch queue ordered strictly by priority:
 * 1 = Critical (Ambulance - Cardiac / Severe Trauma)
 * 2 = High (Fire Service - Commercial / Structural Fire)
 * 3 = Medium (Police Patrol - Incident Support)
 * 4 = Low (Routine Medical Transport / Non-emergency escort)
 * 
 * For identical priority, orders by arrival timestamp (FIFO within same tier)
 */
export class EmergencyPriorityQueue {
  constructor() {
    this.heap = new MinHeap((a, b) => {
      if (a.priority === b.priority) {
        return a.timestamp - b.timestamp;
      }
      return a.priority - b.priority;
    });
  }

  // Enqueue new request
  enqueue(emergencyRequest) {
    const item = {
      ...emergencyRequest,
      id: emergencyRequest.id || `ER-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: emergencyRequest.timestamp || Date.now(),
      status: emergencyRequest.status || 'Dispatched'
    };
    this.heap.push(item);
    return item;
  }

  // Dequeue highest priority request
  dequeue() {
    return this.heap.pop();
  }

  // Peek highest priority without removing
  peek() {
    return this.heap.peek();
  }

  // Get size
  size() {
    return this.heap.size();
  }

  // Check if empty
  isEmpty() {
    return this.heap.isEmpty();
  }

  // Return all items ordered by priority
  getAllOrdered() {
    return this.heap.toArray();
  }
}
