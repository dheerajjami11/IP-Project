# IP Project – SmartCity Traffic & Emergency Response System

An interactive, modern Intelligent Transportation System (ITS) frontend dashboard built for an **Advanced Data Structures and Algorithms** college project. It demonstrates how graph theory, greedy routing algorithms, and priority heap structures are applied to real-world smart city traffic management and emergency vehicle preemption.

---

## 🌟 Key ADS Concepts & System Features

1. **Graph-Based Road Network Representation**
   - **Vertices (\(V\))**: Intersections, roundabouts, and key civic junctions.
   - **Edges (\(E\))**: Bidirectional roadways with dynamic congestion multipliers.
   - Built with an Adjacency List hash map model: space complexity \(O(V + E)\).

2. **Dijkstra's Shortest Path Algorithm**
   - Implemented with a custom **Binary Min-Heap** in JavaScript.
   - Computes minimum travel impedance routes in \(O((V + E) \log V)\) time.
   - Dynamically factors in real-time road congestion multipliers (Low = 1.0x, Medium = 1.4x, High = 2.0x, Critical = 3.5x).
   - Generates step-by-step node traversal unwrapping traces.
   - Provides alternative routes (e.g. arterial bypass vs distance-only).

3. **Priority Queue for Emergency Vehicle Prioritization**
   - Multi-tier emergency triage using a custom Min-Heap:
     - **Priority 1 (Critical)**: Ambulance (Cardiac/Severe Trauma), 3-Alarm Fire
     - **Priority 2 (High)**: Structural Fire, Armed Police Escort
     - **Priority 3 (Medium)**: Medical Transfer, Incident Clearance
     - **Priority 4 (Low)**: Routine Patrol / Escort
   - Guarantees \(O(\log N)\) enqueue and dequeue operations, preventing priority inversion.

4. **Smart Traffic Signal Preemption**
   - Simulates Emergency Vehicle Preemption (EVP) with automated "Green Wave Corridors".
   - Dynamically truncates conflicting phases and extends green splits for emergency responders.

5. **Performance & Scalability Analysis**
   - Benchmarks system runtime across Low (15 nodes), Medium (250 nodes), and High (1,500+ nodes) scale networks.
   - Compares \(O((V+E)\log V)\) Min-Heap against naive \(O(V^2)\) adjacency matrix complexity.

6. **Future Smart City Enhancements**
   - **AI Traffic Prediction**: Simulated Spatio-Temporal Graph Neural Network (ST-GCN) hourly congestion forecasting with confidence ratings.
   - **IoT Edge Telemetry**: Simulated inductive loops, Doppler speed radar, optical cameras, and environmental air quality sensors.
   - **GIS-Based Route Visualization**: Interactive Leaflet / OpenStreetMap (CartoDB dark matrix) alongside 2D SVG topological network graph.

---

## 📁 Project Architecture

```text
smartcity-traffic-system/
├── public/
├── src/
│   ├── algorithms/
│   │   ├── MinHeap.js            # Custom Binary Min-Heap Priority Queue implementation
│   │   ├── Dijkstra.js           # Real Dijkstra shortest path algorithm & alternative routing
│   │   └── EmergencyQueue.js     # Priority Queue manager for emergency vehicles
│   ├── components/
│   │   ├── Sidebar.jsx           # Responsive navigation drawer with ADS badges
│   │   ├── Header.jsx            # Top status bar with live bottleneck counters
│   │   ├── ConceptExplainer.jsx  # "How it works" educational accordion for faculty review
│   │   ├── InteractiveNetworkGraph.jsx # Interactive 2D SVG graph (Vertices, Edges, Weights)
│   │   └── LeafletCityMap.jsx    # Real-world OpenStreetMap GIS visualizer
│   ├── context/
│   │   └── CityContext.jsx       # State management for city roads, signals, queue, and sensors
│   ├── data/
│   │   └── cityData.js           # Realistic modular mock dataset (intersections, roads, signals, IoT, AI)
│   ├── pages/
│   │   ├── Dashboard.jsx         # Page 1: Central ITS overview & 8 core KPIs
│   │   ├── LiveTraffic.jsx       # Page 2: Real-time traffic monitoring & interactive mutators
│   │   ├── RoadNetwork.jsx       # Page 3: Graph builder (Add/remove vertex & weighted edge)
│   │   ├── RouteOptimization.jsx # Page 4: Dijkstra interactive pathfinder & trace table
│   │   ├── EmergencyResponse.jsx # Page 5: Min-Heap emergency dispatch & green corridor routing
│   │   ├── TrafficSignals.jsx    # Page 6: Signal phase management & preemption simulator
│   │   ├── PerformanceAnalysis.jsx # Page 7: Scalability benchmarks & asymptotic complexity curves
│   │   ├── AIPrediction.jsx      # Page 8: AI congestion forecasting & proactive dispatch
│   │   ├── IoTSensors.jsx        # Page 9: IoT sensor telemetry & node health monitoring
│   │   ├── Reports.jsx           # Page 10: Operational summaries & CSV audit report download
│   │   └── AboutProject.jsx      # Page 11: Pedagogical overview, objectives & viva evaluation guide
│   ├── App.jsx                   # Main application router and layout wrapper
│   ├── index.css                 # Dark theme ITS styling and animations
│   └── main.jsx                  # React application entry point
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 How to Run the Project

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- VS Code or your preferred IDE

### Step-by-Step Instructions

1. **Clone or Navigate to the Project Directory**:
   ```bash
   cd "smartcity-traffic-system"
   ```

2. **Install Dependencies** (already installed in workspace, but for fresh clones):
   ```bash
   npm install
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Navigate to the local URL displayed in the terminal (usually `http://localhost:5173/`).

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 🎓 Faculty Evaluation & Demonstration Walkthrough

When presenting this project to your college professors or external evaluators:

1. **Explain the Graph Abstraction (Road Network tab)**:
   - Point out that intersections are vertices \(V\) and roads are edges \(E\).
   - Demonstrate adding a new intersection vertex and connecting it with a weighted edge.
   - Show how the Adjacency List stores neighbors with weights in \(O(V + E)\) space.

2. **Demonstrate Dijkstra's Algorithm (Route Optimization tab)**:
   - Select Source `A` and Destination `G`.
   - Click **Execute Dijkstra**.
   - Show the step-by-step traversal order, the visited node count, and the calculation latency in milliseconds.
   - Toggle "Consider Congestion Multiplier" to demonstrate how traffic jams reroute vehicles away from shorter physical paths.

3. **Demonstrate Min-Heap Priority Queue (Emergency Response tab)**:
   - Highlight the queue of emergency calls sorted by priority (Critical P1, High P2, Medium P3, Low P4).
   - Click **Process Highest-Priority Request (Extract-Min)** to show \(O(\log N)\) extraction.
   - Point out that a Critical ambulance automatically preempts lower-priority units regardless of when it was enqueued.

4. **Demonstrate Traffic Preemption (Traffic Signals tab)**:
   - Click **Simulate Approaching Ambulance** to trigger emergency signal override and activate a Green Corridor.

5. **Present Complexity & Scalability (Performance Analysis tab)**:
   - Review the Low, Medium, and High scale scenarios.
   - Explain why the Min-Heap implementation outperforms naive \(O(V^2)\) approaches.

---

## 🔮 Future Enhancements
- Integration with live city OpenStreetMap Overpass API for real-time geographic data.
- Connecting real hardware IoT microcontrollers (ESP32 / Raspberry Pi) via MQTT WebSockets.
- Dynamic heuristic A* search algorithm comparison.
- Contraction Hierarchies (CH) for million-node continental graphs.

---

## 📜 License
This project was developed for academic and educational evaluation. Open source under the MIT License.
