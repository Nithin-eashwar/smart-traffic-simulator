from typing import Dict, List, Optional
from .models import IntersectionNode, Road

class TrafficGraph:
    """Graph representation of the traffic network"""
    
    def __init__(self):
        self.intersections: Dict[str, IntersectionNode] = {}
        self.adjacency_list: Dict[str, List[str]] = {}
        self.road_map: Dict[str, Road] = {}
    
    def add_intersection(self, intersection: IntersectionNode):
        """Add an intersection to the graph"""
        self.intersections[intersection.id] = intersection
        self.adjacency_list[intersection.id] = []
    
    def add_road(self, road: Road, from_intersection: str, to_intersection: str):
        """Add a road connecting two intersections"""
        self.road_map[road.id] = road
        
        # Add to adjacency list
        if from_intersection in self.intersections and to_intersection in self.intersections:
            if to_intersection not in self.adjacency_list[from_intersection]:
                self.adjacency_list[from_intersection].append(to_intersection)
            if from_intersection not in self.adjacency_list[to_intersection]:
                self.adjacency_list[to_intersection].append(from_intersection)
            
            # Add road to intersections
            self.intersections[from_intersection].roads[road.direction] = road
            # For the opposite direction at the other intersection
            opposite_direction = self._get_opposite_direction(road.direction)
            self.intersections[to_intersection].roads[opposite_direction] = road
    
    def _get_opposite_direction(self, direction):
        """Get opposite direction for a road"""
        opposite_angles = {
            0: 180,    # North -> South
            45: 225,   # Northeast -> Southwest
            90: 270,   # East -> West
            135: 315,  # Southeast -> Northwest
            180: 0,    # South -> North
            225: 45,   # Southwest -> Northeast
            270: 90,   # West -> East
            315: 135   # Northwest -> Southeast
        }
        from .models import RoadDirection
        return RoadDirection(opposite_angles.get(direction.value, direction.value))
    
    def get_neighbors(self, intersection_id: str) -> List[str]:
        """Get neighboring intersections"""
        return self.adjacency_list.get(intersection_id, [])
    
    def get_connecting_road(self, from_id: str, to_id: str) -> Optional[Road]:
        """Get the road connecting two intersections"""
        if from_id in self.intersections and to_id in self.intersections:
            for road in self.intersections[from_id].roads.values():
                # Check if this road connects to the target intersection
                # This is a simplified check - in real implementation you'd need road metadata
                pass
        return None
    
    def find_shortest_path(self, start_id: str, end_id: str) -> List[str]:
        """Find shortest path between two intersections using BFS"""
        if start_id not in self.intersections or end_id not in self.intersections:
            return []
        
        visited = {start_id}
        queue = [(start_id, [start_id])]
        
        while queue:
            current, path = queue.pop(0)
            
            if current == end_id:
                return path
            
            for neighbor in self.get_neighbors(current):
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, path + [neighbor]))
        
        return []  # No path found
    
    def get_congestion_level(self) -> float:
        """Calculate overall congestion level of the network"""
        if not self.intersections:
            return 0.0
        
        total_density = 0.0
        road_count = 0
        
        for intersection in self.intersections.values():
            for road in intersection.roads.values():
                total_density += road.traffic_density
                road_count += 1
        
        return total_density / road_count if road_count > 0 else 0.0
    
    def get_intersection_with_highest_congestion(self) -> Optional[str]:
        """Find intersection with highest average road congestion"""
        if not self.intersections:
            return None
        
        max_congestion = -1.0
        max_intersection = None
        
        for intersection_id, intersection in self.intersections.items():
            if not intersection.roads:
                continue
            
            avg_congestion = sum(road.traffic_density for road in intersection.roads.values()) / len(intersection.roads)
            
            if avg_congestion > max_congestion:
                max_congestion = avg_congestion
                max_intersection = intersection_id
        
        return max_intersection