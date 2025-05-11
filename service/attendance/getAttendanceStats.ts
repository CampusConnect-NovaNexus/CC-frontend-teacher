import { EXPO_TEACHER_API_URL } from '@env';

export const getAttendanceStats = async (
  studentId: string,
  startDate?: string,
  endDate?: string
) => {
  const params = new URLSearchParams();
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);

  try {
    const response = await fetch(`${EXPO_TEACHER_API_URL}/api/teacher/attendance/stats/${studentId}?${params}`);

    if (!response.ok) {
      throw new Error(`Failed to get attendance stats: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting attendance stats:', error);
    throw error;
  }
};