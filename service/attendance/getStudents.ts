import { EXPO_TEACHER_API_URL } from '@env';

export const getStudents = async (courseCode: string) => {
  try {
    console.log('Fetching students for course code:', courseCode);
    
    const response = await fetch(`${EXPO_TEACHER_API_URL}/api/teacher/courses/${courseCode}/students`);
    if (!response.ok) {
      throw new Error(`Failed to fetch students: ${response.status}`);
    }

    const data = await response.json();
    
    return data
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};
