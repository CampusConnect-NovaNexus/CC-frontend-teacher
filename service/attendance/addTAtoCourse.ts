import { EXPO_TEACHER_API_URL } from '@env';

export const addTAtoCourse = async (courseCode: string, taEmail: string) => {
    c
    
  try {
    const response = await fetch(`${EXPO_TEACHER_API_URL}/api/teacher/courses/${courseCode}/ta`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ta_email: taEmail }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add TA: ${response.status} ${errorText}`);
    }

    const data =await response.json();
    
    
    return data;
  } catch (error) {
    console.error('Error adding TA to course:', error);
    throw error;
  }
};