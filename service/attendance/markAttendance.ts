import { EXPO_TEACHER_API_URL } from '@env';

interface AttendanceBody {
  course_code: string;
  roll_numbers: string[];
}

export const markAttendance = async (body: AttendanceBody) => {
  try {
    console.log('Marking attendance with body:', body);
    console.log(EXPO_TEACHER_API_URL);
    const response = await fetch(`${EXPO_TEACHER_API_URL}/api/teacher/attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    console.log('Attendance marked successfully:', data);

    return data;
  } catch (error) {
    console.error('Error marking attendance:', error);
    throw error;
  }
};
