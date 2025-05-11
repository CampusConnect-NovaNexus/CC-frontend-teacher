// getCourses.ts
import { EXPO_TEACHER_API_URL } from '@env';

export const getCourses = async (email: string) => {
  console.log(EXPO_TEACHER_API_URL);
  console.log(email);
  try {
    const response = await fetch(`${EXPO_TEACHER_API_URL}/api/teacher/courses?email=${encodeURIComponent(email)}`);
    console.log('response in fetching courses',response);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.status}`);
    }
    const data = await response.json();
    console.log('data in fetching courses',data);
    return data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};