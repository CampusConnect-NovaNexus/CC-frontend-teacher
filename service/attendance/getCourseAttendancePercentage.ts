import { EXPO_TEACHER_API_URL } from '@env';

export const getCourseAttendanceStats = async (
  courseCode: string,
  startDate?: string,
  endDate?: string
) => {
  try {
    let url = `${EXPO_TEACHER_API_URL}/api/teacher/attendance/stats/course/${courseCode}/percentage`;

    const queryParams = [];
    if (startDate) queryParams.push(`start_date=${startDate}`);
    if (endDate) queryParams.push(`end_date=${endDate}`);

    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    const response = await fetch(url);
    console.log('Fetching course attendance stats from:', url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch course attendance stats: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching course attendance stats:', error);
    throw error;
  }
};
