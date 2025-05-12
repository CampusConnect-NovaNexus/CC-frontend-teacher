import { EXPO_TEACHER_API_URL } from '@env';

export const addStudentToCourse = async (courseCode:string, name: string, roll_no: string) => {
    
    
  try {
    const response = await fetch(`${EXPO_TEACHER_API_URL}/api/teacher/courses/${courseCode}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        roll_no: roll_no,
       }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add stuent : ${response.status} ${errorText}`);
    }

    const data= await response.json();
    
    return data;
  } catch (error) {
    console.error('Error adding student :', error);
    throw error;
  }
};