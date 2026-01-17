import asyncio
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import numpy as np
from .models import *
from .priority_queue import SmartPriorityQueue

class TrafficSimulationEngine:
    def __init__(self):
        self.intersection = IntersectionNode(
            id="center",
            name="8-Way Central Intersection"
        )
        self.priority_queue = SmartPriorityQueue()
        self.simulation_time = 0  # in simulation minutes
        self.is_running = False
        self.real_time_factor = 60  # 1 real second = 60 simulation minutes
        
        self.metrics = {
            "total_vehicles_generated": 0,
            "vehicles_processed": 0,
            "total_wait_time": 0.0,
            "avg_wait_time": 0.0,
            "max_wait_time": 0.0,
            "emergency_vehicles": 0,
            "signal_changes": 0,
            "congestion_level": 0.0,
            "co2_saved": 0.0,  # in kg
            "fuel_saved": 0.0,  # in liters
            "throughput": 0.0,  # vehicles per hour
            "queue_size": 0,
            "system_efficiency": 0.0
        }
        
        # Simulation parameters
        self.vehicle_generation_rate = 5  # vehicles per minute
        self.green_signal_duration = 30  # seconds
        self.emergency_probability = 0.02  # 2% chance
        
        # Vehicle type probabilities
        self.vehicle_type_probs = [
            (VehicleType.CAR, 0.55),
            (VehicleType.MOTORCYCLE, 0.15),
            (VehicleType.TRUCK, 0.10),
            (VehicleType.BUS, 0.08),
            (VehicleType.BICYCLE, 0.10),
            (VehicleType.EMERGENCY, 0.02)
        ]
        
        # Initialize the 8-way intersection
        self.initialize_roads()
        
        # Historical data
        self.history: List[Dict] = []
        self.max_history = 100
    
    def initialize_roads(self):
        """Create 8 roads for the intersection"""
        directions = [
            (0, "NORTH", 3),
            (45, "NORTHEAST", 2),
            (90, "EAST", 3),
            (135, "SOUTHEAST", 2),
            (180, "SOUTH", 3),
            (225, "SOUTHWEST", 2),
            (270, "WEST", 3),
            (315, "NORTHWEST", 2)
        ]
        
        for angle, name, lanes in directions:
            road = Road(
                id=f"road_{angle}",
                name=name,
                direction=RoadDirection(angle),
                lane_count=lanes,
                max_capacity=lanes * 20
            )
            self.intersection.roads[road.direction] = road
            self.priority_queue.push(road)
    
    def generate_vehicle(self) -> Vehicle:
        """Generate random vehicle with realistic probabilities"""
        # Weighted random selection
        rand = random.random()
        cumulative = 0
        vehicle_type = VehicleType.CAR
        
        for vtype, prob in self.vehicle_type_probs:
            cumulative += prob
            if rand <= cumulative:
                vehicle_type = vtype
                break
        
        # Check for emergency vehicle
        is_emergency = (vehicle_type == VehicleType.EMERGENCY)
        if is_emergency:
            self.metrics["emergency_vehicles"] += 1
        
        return Vehicle(
            id=f"v_{self.metrics['total_vehicles_generated']}_{datetime.now().timestamp()}",
            vehicle_type=vehicle_type,
            emergency=is_emergency
        )
    
    def add_vehicles(self):
        """Add vehicles to random roads based on rate"""
        roads = list(self.intersection.roads.values())
        
        # Calculate vehicles to add based on rate
        vehicles_to_add = int(self.vehicle_generation_rate * (self.real_time_factor / 60))
        vehicles_to_add = max(0, vehicles_to_add + random.randint(-2, 2))  # Add some randomness
        
        for _ in range(vehicles_to_add):
            if random.random() < 0.7:  # 70% chance to add to a road
                road = random.choice(roads)
                if len(road.vehicles) < road.max_capacity:
                    vehicle = self.generate_vehicle()
                    road.vehicles.append(vehicle)
                    self.metrics["total_vehicles_generated"] += 1
        
        # Update all road densities and priority queue
        for road in roads:
            road.update_density()
            self.priority_queue.update_road(road)
    
    def process_green_signal(self) -> List[Vehicle]:
        """Process vehicles through current green signal"""
        if not self.intersection.current_green:
            return []
        
        road = self.intersection.roads[self.intersection.current_green]
        if not road.vehicles:
            return []
        
        # Calculate vehicles that can pass (based on lanes and time)
        vehicles_per_minute = road.lane_count * 2  # Approximate capacity
        max_vehicles = int(vehicles_per_minute * (self.green_signal_duration / 60))
        vehicles_to_process = min(max_vehicles, len(road.vehicles))
        
        processed_vehicles = []
        for _ in range(vehicles_to_process):
            if road.vehicles:
                vehicle = road.vehicles.pop(0)
                processed_vehicles.append(vehicle)
                
                # Update metrics
                self.metrics["vehicles_processed"] += 1
                self.metrics["total_wait_time"] += vehicle.waiting_time
                self.metrics["max_wait_time"] = max(
                    self.metrics["max_wait_time"],
                    vehicle.waiting_time
                )
                
                # Calculate environmental benefits
                if vehicle.waiting_time > 1:  # Only count if waited more than 1 minute
                    self.metrics["co2_saved"] += vehicle.waiting_time * 0.025  # kg CO2
                    self.metrics["fuel_saved"] += vehicle.waiting_time * 0.01   # liters
        
        # Update road density after processing
        road.update_density()
        if road.vehicles:
            self.priority_queue.push(road)
        
        return processed_vehicles
    
    def update_signal(self):
        """Update traffic signal based on priority queue"""
        current_time = datetime.now()
        
        # Check if current green signal should end
        if self.intersection.current_green:
            elapsed = (current_time - self.intersection.last_switch).seconds
            if elapsed >= self.green_signal_duration:
                self.intersection.current_green = None
                self.metrics["signal_changes"] += 1
        
        # Assign new green signal
        if not self.intersection.current_green and not self.priority_queue.is_empty():
            next_road = self.priority_queue.pop()
            if next_road and next_road.vehicles:
                self.intersection.current_green = next_road.direction
                self.intersection.last_switch = current_time
                self.metrics["signal_changes"] += 1
    
    def update_metrics(self):
        """Update all simulation metrics"""
        # Update all vehicle wait times
        for road in self.intersection.roads.values():
            for vehicle in road.vehicles:
                vehicle.waiting_time += 1  # 1 simulation minute
                vehicle.priority = vehicle.calculate_priority()
            road.update_density()
        
        # Calculate overall congestion
        total_vehicles = sum(len(r.vehicles) for r in self.intersection.roads.values())
        total_capacity = sum(r.max_capacity for r in self.intersection.roads.values())
        self.metrics["congestion_level"] = (total_vehicles / total_capacity) * 100 if total_capacity > 0 else 0
        
        # Calculate average wait time
        if self.metrics["vehicles_processed"] > 0:
            self.metrics["avg_wait_time"] = (
                self.metrics["total_wait_time"] / self.metrics["vehicles_processed"]
            )
        
        # Calculate throughput (vehicles per hour)
        if self.simulation_time > 0:
            self.metrics["throughput"] = (
                self.metrics["vehicles_processed"] / self.simulation_time
            ) * 60  # Convert to per hour
        
        # Queue size
        self.metrics["queue_size"] = self.priority_queue.size()
        
        # System efficiency calculation
        congestion_factor = max(0, 100 - self.metrics["congestion_level"])
        wait_factor = max(0, 10 - min(self.metrics["avg_wait_time"], 10)) * 10
        throughput_factor = min(self.metrics["throughput"] / 500 * 100, 100)
        
        self.metrics["system_efficiency"] = (
            congestion_factor * 0.4 +
            wait_factor * 0.4 +
            throughput_factor * 0.2
        )
        
        # Store history
        self.history.append({
            "timestamp": datetime.now().isoformat(),
            **self.metrics.copy()
        })
        if len(self.history) > self.max_history:
            self.history.pop(0)
    
    async def run_step(self):
        """Run one simulation step"""
        if not self.is_running:
            return
        
        try:
            # Add new vehicles
            self.add_vehicles()
            
            # Process current green signal
            self.process_green_signal()
            
            # Update traffic signal if needed
            self.update_signal()
            
            # Update metrics
            self.update_metrics()
            
            self.simulation_time += 1
            
        except Exception as e:
            print(f"Simulation error: {e}")
    
    def get_state(self) -> Dict:
        """Get current simulation state for frontend"""
        roads_state = {}
        for direction, road in self.intersection.roads.items():
            roads_state[direction.value] = {
                "name": road.name,
                "vehicle_count": len(road.vehicles),
                "density": road.traffic_density,
                "vehicles": [
                    {
                        "type": v.vehicle_type.value,
                        "waiting_time": v.waiting_time,
                        "emergency": v.emergency,
                        "priority": v.priority
                    } for v in road.vehicles[:15]  # Limit for performance
                ],
                "capacity_used": f"{(len(road.vehicles) / road.max_capacity * 100):.1f}%"
            }
        
        return {
            "simulation_time": self.simulation_time,
            "current_green": self.intersection.current_green.value if self.intersection.current_green else None,
            "green_duration": self.green_signal_duration,
            "roads": roads_state,
            "metrics": self.metrics.copy(),
            "queue_size": self.metrics["queue_size"],
            "is_running": self.is_running
        }
    
    def add_emergency_vehicle(self, direction_angle: int) -> bool:
        """Manually add emergency vehicle to specific direction"""
        try:
            direction = RoadDirection(direction_angle)
            road = self.intersection.roads.get(direction)
            
            if road and len(road.vehicles) < road.max_capacity:
                emergency_vehicle = Vehicle(
                    id=f"emergency_{datetime.now().timestamp()}",
                    vehicle_type=VehicleType.EMERGENCY,
                    emergency=True
                )
                road.vehicles.insert(0, emergency_vehicle)  # Add to front
                road.update_density()
                self.priority_queue.update_road(road)
                return True
        except Exception as e:
            print(f"Error adding emergency vehicle: {e}")
        return False
    
    def update_config(self, green_duration: Optional[int] = None, 
                     vehicle_rate: Optional[int] = None,
                     emergency_prob: Optional[float] = None):
        """Update simulation configuration"""
        if green_duration is not None and 10 <= green_duration <= 60:
            self.green_signal_duration = green_duration
        
        if vehicle_rate is not None and 1 <= vehicle_rate <= 20:
            self.vehicle_generation_rate = vehicle_rate
        
        if emergency_prob is not None and 0 <= emergency_prob <= 10:
            self.emergency_probability = emergency_prob / 100
        
        # Update vehicle type probabilities
        self.vehicle_type_probs = [
            (VehicleType.CAR, 0.55),
            (VehicleType.MOTORCYCLE, 0.15),
            (VehicleType.TRUCK, 0.10),
            (VehicleType.BUS, 0.08),
            (VehicleType.BICYCLE, 0.10),
            (VehicleType.EMERGENCY, self.emergency_probability)
        ]
    
    def start(self):
        """Start the simulation"""
        self.is_running = True
    
    def stop(self):
        """Stop the simulation"""
        self.is_running = False
    
    def reset(self):
        """Reset simulation to initial state"""
        self.stop()
        self.simulation_time = 0
        self.metrics = {
            "total_vehicles_generated": 0,
            "vehicles_processed": 0,
            "total_wait_time": 0.0,
            "avg_wait_time": 0.0,
            "max_wait_time": 0.0,
            "emergency_vehicles": 0,
            "signal_changes": 0,
            "congestion_level": 0.0,
            "co2_saved": 0.0,
            "fuel_saved": 0.0,
            "throughput": 0.0,
            "queue_size": 0,
            "system_efficiency": 0.0
        }
        self.history = []
        
        # Clear all roads
        for road in self.intersection.roads.values():
            road.vehicles.clear()
            road.traffic_density = 0.0
            self.priority_queue.update_road(road)
        
        self.intersection.current_green = None