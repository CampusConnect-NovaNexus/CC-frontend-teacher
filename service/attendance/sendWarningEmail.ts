import { EXPO_AUTH_API_URL } from '@env';

interface SendWarningEmailParams {
  to: string;
  senderName: string;
  studentName: string;
  attendancePercentage: number;
}

export const sendWarningEmail = async ({
  to,
  senderName,
  studentName,
  attendancePercentage,
}: SendWarningEmailParams) => {
    console.log('Sending warning email to:', to, senderName, studentName, attendancePercentage);
    
  try {
    const response = await fetch(`${EXPO_AUTH_API_URL}/api/v1/notifications/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        senderName,
        studentName,
        attendancePercentage,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending warning email:', error);
    throw error;
  }
};
