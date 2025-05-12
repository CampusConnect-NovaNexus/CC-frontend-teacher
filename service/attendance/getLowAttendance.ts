import { EXPO_TEACHER_API_URL } from '@env';

export const getLowAttendanceStudents = async (
  courseCode: string,
  startDate?: string,
  endDate?: string
) => {
  try {
    let url = `${EXPO_TEACHER_API_URL}/api/teacher/attendance/${courseCode}/low`;

    const queryParams = [];
    if (startDate) queryParams.push(`start_date=${encodeURIComponent(startDate)}`);
    if (endDate) queryParams.push(`end_date=${encodeURIComponent(endDate)}`);

    if (queryParams.length > 1) {
      url += `?${queryParams.join('&')}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch low attendance students: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching low attendance students:', error);
    throw error;
  }
};
