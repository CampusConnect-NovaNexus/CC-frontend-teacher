import { EXPO_TEACHER_API_URL } from '@env';

export const removeTAfromCourse = async (courseCode: string, taEmail: string) => {
    
    
  try {
    const response = await fetch(`${EXPO_TEACHER_API_URL}/api/teacher/courses/${courseCode}/ta`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ta_email: taEmail }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to remove TA: ${response.status} ${errorText}`);
    }

    const data= await response.json();
    
    return data;
  } catch (error) {
    console.error('Error removing TA from course:', error);
    throw error;
  }
};
