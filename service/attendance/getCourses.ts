// getCourses.ts
import { EXPO_TEACHER_API_URL } from '@env';

export const getCourses = async (email: string) => {
  console.log(EXPO_TEACHER_API_URL);
  try {
    const response = await fetch(`${EXPO_TEACHER_API_URL}/api/teacher/courses?email=${encodeURIComponent(email)}`);
    
    
    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.status}`);
    }
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};