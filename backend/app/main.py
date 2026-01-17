from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio
import json
from typing import List, Dict
import time

from .simulation_engine import TrafficSimulationEngine
from .models import RoadDirection

# Global variables
simulation: TrafficSimulationEngine = None
connections: List[WebSocket] = []
simulation_task = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global simulation, simulation_task
    simulation = TrafficSimulationEngine()
    simulation.start()
    
    # Start background simulation task
    simulation_task = asyncio.create_task(run_simulation_background())
    
    yield
    
    # Shutdown
    if simulation_task:
        simulation_task.cancel()
        try:
            await simulation_task
        except asyncio.CancelledError:
            pass
    
    simulation.stop()
    simulation = None
    connections.clear()

app = FastAPI(title="Smart Traffic Signal System", lifespan=lifespan)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def run_simulation_background():
    """Background task to run simulation and broadcast updates"""
    global simulation, connections
    
    while True:
        try:
            if simulation:
                # Run simulation step
                await simulation.run_step()
                
                # Get current state
                state = simulation.get_state()
                
                # Broadcast to all connected WebSocket clients
                for connection in connections[:]:  # Create a copy to avoid modification during iteration
                    try:
                        await connection.send_json(state)
                    except:
                        # Remove disconnected clients
                        try:
                            connections.remove(connection)
                        except ValueError:
                            pass
            
            # Sleep for 1 second (real time)
            await asyncio.sleep(1)
            
        except asyncio.CancelledError:
            break
        except Exception as e:
            print(f"Background task error: {e}")
            await asyncio.sleep(1)

@app.get("/")
async def root():
    return {
        "message": "Smart Traffic Signal Control System",
        "version": "1.0.0",
        "status": "running" if simulation and simulation.is_running else "stopped",
        "intersection": "8-way complex intersection",
        "endpoints": {
            "state": "/state",
            "emergency": "/emergency/{direction}",
            "config": "/config",
            "control": "/control/{action}",
            "websocket": "/ws"
        }
    }

@app.get("/state")
async def get_state():
    if simulation:
        return simulation.get_state()
    raise HTTPException(status_code=404, detail="Simulation not initialized")

@app.post("/emergency/{direction}")
async def add_emergency(direction: int):
    """Add emergency vehicle to specific direction (0-315 in 45-degree increments)"""
    if simulation:
        success = simulation.add_emergency_vehicle(direction)
        return {
            "success": success,
            "direction": direction,
            "message": "Emergency vehicle added successfully" if success else "Failed to add emergency vehicle"
        }
    raise HTTPException(status_code=404, detail="Simulation not initialized")

@app.post("/config")
async def update_config(
    green_duration: int = None,
    vehicle_rate: int = None,
    emergency_prob: float = None
):
    """Update simulation configuration"""
    if simulation:
        simulation.update_config(green_duration, vehicle_rate, emergency_prob)
        
        current_config = {
            "green_duration": simulation.green_signal_duration,
            "vehicle_rate": simulation.vehicle_generation_rate,
            "emergency_probability": simulation.emergency_probability * 100
        }
        
        return {
            "success": True,
            "message": "Configuration updated",
            "config": current_config
        }
    raise HTTPException(status_code=404, detail="Simulation not initialized")

@app.post("/control/{action}")
async def control_simulation(action: str):
    """Control simulation actions: start, stop, reset"""
    if not simulation:
        raise HTTPException(status_code=404, detail="Simulation not initialized")
    
    action = action.lower()
    
    if action == "start":
        simulation.start()
        return {"success": True, "message": "Simulation started"}
    
    elif action == "stop":
        simulation.stop()
        return {"success": True, "message": "Simulation stopped"}
    
    elif action == "reset":
        simulation.reset()
        simulation.start()
        return {"success": True, "message": "Simulation reset and started"}
    
    elif action == "pause":
        simulation.stop()
        return {"success": True, "message": "Simulation paused"}
    
    else:
        raise HTTPException(status_code=400, detail=f"Unknown action: {action}")

@app.get("/history")
async def get_history(limit: int = 50):
    """Get simulation history data"""
    if simulation:
        return {
            "history": simulation.history[-limit:] if limit > 0 else simulation.history,
            "count": len(simulation.history)
        }
    raise HTTPException(status_code=404, detail="Simulation not initialized")

@app.get("/road/{direction}")
async def get_road_state(direction: int):
    """Get detailed state of a specific road"""
    if simulation:
        try:
            road_dir = RoadDirection(direction)
            road = simulation.intersection.roads.get(road_dir)
            
            if road:
                return {
                    "direction": direction,
                    "name": road.name,
                    "vehicle_count": len(road.vehicles),
                    "density": road.traffic_density,
                    "capacity": road.max_capacity,
                    "capacity_used": f"{(len(road.vehicles) / road.max_capacity * 100):.1f}%",
                    "lanes": road.lane_count,
                    "is_green": simulation.intersection.current_green == road_dir
                }
            else:
                raise HTTPException(status_code=404, detail=f"Road direction {direction} not found")
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid direction: {direction}")
    raise HTTPException(status_code=404, detail="Simulation not initialized")

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connections.append(websocket)
    
    try:
        # Send initial state
        if simulation:
            await websocket.send_json(simulation.get_state())
        
        # Keep connection alive
        while True:
            data = await websocket.receive_text()
            # Handle client messages if needed
            try:
                message = json.loads(data)
                if message.get("type") == "ping":
                    await websocket.send_json({"type": "pong", "timestamp": time.time()})
            except:
                pass
                
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        # Clean up connection
        if websocket in connections:
            connections.remove(websocket)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "simulation_running": simulation.is_running if simulation else False,
        "active_connections": len(connections)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)