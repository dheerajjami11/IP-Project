/**
 * Advanced Data Structures: Priority Queue / Min-Heap Implementation
 * Used for Dijkstra's Shortest Path Algorithm & Emergency Vehicle Prioritization
 * 
 * Time Complexities:
 * - push / insert: O(log N)
 * - pop / extractMin: O(log N)
 * - peek: O(1)
 */

export class MinHeap {
  constructor(compareFunction = (a, b) => a.priority - b.priority) {
    this.heap = [];
    this.compare = compareFunction;
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  peek() {
    return this.heap[0] || null;
  }

  push(item) {
    this.heap.push(item);
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.isEmpty()) return null;
    const min = this.heap[0];
    const end = this.heap.pop();
    if (!this.isEmpty()) {
      this.heap[0] = end;
      this._bubbleDown(0);
    }
    return min;
  }

  _bubbleUp(index) {
    const item = this.heap[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      const parent = this.heap[parentIndex];
      if (this.compare(item, parent) >= 0) break;
      this.heap[index] = parent;
      index = parentIndex;
    }
    this.heap[index] = item;
  }

  _bubbleDown(index) {
    const length = this.heap.length;
    const item = this.heap[index];

    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let leftChild, rightChild;
      let swap = null;

      if (leftChildIndex < length) {
        leftChild = this.heap[leftChildIndex];
        if (this.compare(leftChild, item) < 0) {
          swap = leftChildIndex;
        }
      }

      if (rightChildIndex < length) {
        rightChild = this.heap[rightChildIndex];
        if (
          (swap === null && this.compare(rightChild, item) < 0) ||
          (swap !== null && this.compare(rightChild, leftChild) < 0)
        ) {
          swap = rightChildIndex;
        }
      }

      if (swap === null) break;
      this.heap[index] = this.heap[swap];
      index = swap;
    }
    this.heap[index] = item;
  }

  toArray() {
    // Return sorted elements according to priority
    const copy = [...this.heap];
    return copy.sort(this.compare);
  }
}
