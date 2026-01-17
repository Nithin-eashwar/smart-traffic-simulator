from enum import Enum
from typing import List, Dict, Optional
from dataclasses import dataclass, field
from datetime import datetime
import random

class VehicleType(Enum):
    CAR = "car"
    MOTORCYCLE = "motorcycle"
    TRUCK = "truck"
    BUS = "bus"
    EMERGENCY = "emergency"
    BICYCLE = "bicycle"

class RoadDirection(Enum):
    NORTH = 0
    NORTHEAST = 45
    EAST = 90
    SOUTHEAST = 135
    SOUTH = 180
    SOUTHWEST = 225
    WEST = 270
    NORTHWEST = 315

@dataclass(order=True)
class Vehicle:
    id: str
    vehicle_type: VehicleType
    waiting_time: float = 0.0  # in simulation minutes
    entered_at: datetime = field(default_factory=datetime.now)
    emergency: bool = False
    priority: float = field(default=0.0, init=False)
    
    def __post_init__(self):
        self.priority = self.calculate_priority()
    
    def calculate_priority(self):
        # Higher number = higher priority
        base_priority = {
            VehicleType.EMERGENCY: 100.0,
            VehicleType.TRUCK: 3.0,
            VehicleType.BUS: 3.0,
            VehicleType.CAR: 2.0,
            VehicleType.MOTORCYCLE: 1.0,
            VehicleType.BICYCLE: 1.0
        }
        
        priority = base_priority.get(self.vehicle_type, 2.0)
        
        # Increase priority with waiting time (every 2 minutes)
        priority += self.waiting_time * 0.5
        
        if self.emergency:
            priority += 50.0
        
        return min(priority, 100.0)

@dataclass
class Road:
    id: str
    name: str
    direction: RoadDirection
    lane_count: int = 2
    max_capacity: int = 50
    vehicles: List[Vehicle] = field(default_factory=list)
    traffic_density: float = 0.0
    
    def update_density(self):
        if not self.vehicles:
            self.traffic_density = 0.0
            return
        
        # Base density from vehicle count
        base_density = len(self.vehicles) / self.max_capacity
        
        # Weighted density based on vehicle types
        type_weights = {
            VehicleType.EMERGENCY: 5.0,
            VehicleType.TRUCK: 1.5,
            VehicleType.BUS: 1.5,
            VehicleType.CAR: 1.0,
            VehicleType.MOTORCYCLE: 0.7,
            VehicleType.BICYCLE: 0.5
        }
        
        weighted_sum = sum(type_weights.get(v.vehicle_type, 1.0) for v in self.vehicles)
        type_density = weighted_sum / (self.max_capacity * 2)  # Max weight per vehicle is 5
        
        # Wait time contribution
        total_wait_time = sum(v.waiting_time for v in self.vehicles)
        wait_density = min(total_wait_time / 100, 0.3)  # Up to 30% contribution
        
        self.traffic_density = (base_density + type_density + wait_density) * 100
        return self.traffic_density

@dataclass
class IntersectionNode:
    id: str
    name: str
    roads: Dict[RoadDirection, Road] = field(default_factory=dict)
    current_green: Optional[RoadDirection] = None
    green_duration: float = 30.0  # seconds (30 simulation minutes)
    last_switch: datetime = field(default_factory=datetime.now)

class TrafficGraph:
    def __init__(self):
        self.intersections: Dict[str, IntersectionNode] = {}
        self.adjacency_list: Dict[str, List[str]] = {}
    
    def add_intersection(self, intersection: IntersectionNode):
        self.intersections[intersection.id] = intersection
        self.adjacency_list[intersection.id] = []
    
    def connect_intersections(self, id1: str, id2: str, road1: Road, road2: Road):
        if id1 in self.intersections and id2 in self.intersections:
            self.intersections[id1].roads[road1.direction] = road1
            self.intersections[id2].roads[road2.direction] = road2
            self.adjacency_list[id1].append(id2)
            self.adjacency_list[id2].append(id1)
    
    def get_neighbors(self, intersection_id: str) -> List[str]:
        return self.adjacency_list.get(intersection_id, [])