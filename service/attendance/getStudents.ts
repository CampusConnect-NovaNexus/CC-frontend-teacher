import { EXPO_TEACHER_API_URL } from '@env';

export const getStudents = async (courseCode: string) => {
  try {
    const response = await fetch(`${EXPO_TEACHER_API_URL}/api/teacher/courses/${courseCode}/students`);
    if (!response.ok) {
      throw new Error(`Failed to fetch students: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};
