# 🚦 Smart Traffic System

A real-time traffic simulation and management system featuring an interactive 3D visualization, intelligent traffic signal control, and comprehensive analytics dashboard.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009688?logo=fastapi)
![Three.js](https://img.shields.io/badge/Three.js-0.161.0-000000?logo=three.js)
![Python](https://img.shields.io/badge/Python-3.8+-3776AB?logo=python)

## ✨ Features

- **3D Traffic Visualization** - Real-time 3D simulation of vehicles and traffic flow using React Three Fiber
- **Intelligent Traffic Control** - Adaptive traffic signal management with priority queue algorithms
- **Real-time Analytics** - Live traffic density monitoring and flow analysis
- **Emergency Vehicle Priority** - Special handling for emergency vehicles with dynamic signal preemption
- **Interactive Dashboard** - Comprehensive control panel with simulation controls and statistics

## 🏗️ Project Structure

```
smart-traffic-system/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API and WebSocket services
│   │   └── utils/           # Utility functions
│   └── public/              # Static assets
│
└── backend/                  # FastAPI backend server
    ├── app/
    │   ├── main.py          # FastAPI application entry
    │   ├── simulation_engine.py  # Traffic simulation logic
    │   ├── graph.py         # Road network graph
    │   ├── models.py        # Pydantic data models
    │   └── priority_queue.py # Vehicle priority management
    └── requirements.txt     # Python dependencies
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the server:
   ```bash
   python run.py
   ```
   The backend will be running at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The frontend will be running at `http://localhost:3000`

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **React Three Fiber** - 3D rendering with Three.js
- **@react-three/drei** - Useful helpers for R3F
- **Framer Motion** - Animations
- **Recharts** - Data visualization charts
- **Socket.IO Client** - Real-time WebSocket communication

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **WebSockets** - Real-time bidirectional communication
- **Pydantic** - Data validation
- **NumPy** - Numerical computations

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/api/simulation/status` | Get current simulation status |
| `POST` | `/api/simulation/start` | Start the simulation |
| `POST` | `/api/simulation/pause` | Pause the simulation |
| `POST` | `/api/simulation/reset` | Reset the simulation |
| `WS` | `/ws` | WebSocket for real-time updates |

## 🎮 Usage

1. **Start the Simulation**: Click the play button or use the control panel to begin the traffic simulation
2. **Add Emergency Vehicles**: Use the "Add Emergency" button to introduce priority vehicles
3. **Monitor Analytics**: View real-time traffic flow and density metrics in the dashboard
4. **Control Signals**: Observe adaptive traffic signal behavior based on traffic conditions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Nithin**

---

⭐ Star this repository if you find it helpful!
