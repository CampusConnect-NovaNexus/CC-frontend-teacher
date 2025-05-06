interface GrievanceStats {
  pending: number;
  resolved: number;
  total: number;
}

// This is a mock implementation for now
// In a real app, this would make an API call to fetch actual data
export const fetchGrievanceStats = async (): Promise<GrievanceStats> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data
  return {
    pending: 5,
    resolved: 12,
    total: 17
  };
};