import heapq
from datetime import datetime, timedelta
from typing import List, Tuple, Dict
from .models import Road

class SmartPriorityQueue:
    def __init__(self):
        self.heap: List[Tuple[float, datetime, str, Road]] = []
        self.entry_finder: Dict[str, Tuple[float, datetime, str, Road]] = {}
        self.counter = 0
        self.last_served: Dict[str, datetime] = {}
    
    def push(self, road: Road):
        """Push road with priority based on density and wait time"""
        if road.id in self.entry_finder:
            self.remove(road.id)
        
        # Priority calculation (negative for max-heap via min-heap)
        priority = self.calculate_priority(road)
        
        entry = (priority, datetime.now(), road.id, road)
        self.entry_finder[road.id] = entry
        heapq.heappush(self.heap, entry)
        self.counter += 1
    
    def calculate_priority(self, road: Road) -> float:
        """Calculate priority score for a road"""
        # Base priority from density (higher density = higher priority)
        density_priority = road.traffic_density
        
        # Add penalty for recently served roads (starvation prevention)
        time_penalty = 0
        if road.id in self.last_served:
            time_since_served = (datetime.now() - self.last_served[road.id]).seconds
            if time_since_served < 60:  # Within 1 minute
                time_penalty = (60 - time_since_served) * 0.5
        
        # Emergency vehicle boost
        emergency_boost = 0
        if road.vehicles:
            emergency_count = sum(1 for v in road.vehicles if v.emergency)
            emergency_boost = emergency_count * 50.0
        
        # Wait time consideration
        wait_boost = 0
        if road.vehicles:
            max_wait = max(v.waiting_time for v in road.vehicles)
            wait_boost = max_wait * 0.5  # 0.5 priority per minute of wait
        
        # Calculate total priority (negative for heapq min-heap)
        total_priority = -(density_priority + emergency_boost + wait_boost - time_penalty)
        
        return total_priority
    
    def pop(self) -> Road:
        """Pop the road with highest priority"""
        while self.heap:
            priority, timestamp, road_id, road = heapq.heappop(self.heap)
            if road_id in self.entry_finder:
                del self.entry_finder[road_id]
                self.last_served[road_id] = datetime.now()
                return road
        return None
    
    def remove(self, road_id: str):
        """Remove a road from the queue"""
        if road_id in self.entry_finder:
            del self.entry_finder[road_id]
    
    def update_road(self, road: Road):
        """Update road's position in the queue"""
        self.push(road)
    
    def is_empty(self) -> bool:
        # Check entry_finder instead of heap since heap may contain stale entries
        return len(self.entry_finder) == 0
    
    def size(self) -> int:
        return len(self.heap)
    
    def get_road_priority(self, road_id: str) -> float:
        """Get current priority of a road"""
        if road_id in self.entry_finder:
            return -self.entry_finder[road_id][0]  # Convert back to positive
        return 0.0