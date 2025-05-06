interface AttendanceStats {
  averagePercentage: number;
  lowAttendanceCount: number;
  totalStudents: number;
}

// This is a mock implementation for now
// In a real app, this would make an API call to fetch actual data
export const fetchAttendanceStats = async (): Promise<AttendanceStats> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data
  return {
    averagePercentage: 85,
    lowAttendanceCount: 7,
    totalStudents: 42
  };
};