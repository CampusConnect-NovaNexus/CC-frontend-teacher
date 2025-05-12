import { EXPO_TEACHER_API_URL } from '@env';

export const getAttendanceStatsOfClass = async (
  course_code: string,
  startDate?: string,
  endDate?: string
) => {
  const params = new URLSearchParams();
  console.log("Course Code:", course_code);
  console.log("Start Date:", startDate);
  console.log("End Date:", endDate);
  
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);

  try {
    const response = await fetch(`${EXPO_TEACHER_API_URL}/api/teacher/attendance/stats/course/${course_code}?${params}`);
    console.log("Response:", response);
    console.log("URL:", `${EXPO_TEACHER_API_URL}/api/teacher/attendance/stats/course/${course_code}?${params}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get attendance stats: ${response.status}`);
    }
    const data = await response.json();
    console.log('Attendance stats of Class :', data);
    
    return data;
  } catch (error) {
    console.error('Error getting attendance stats of Class :', error);
    throw error;
  }
};