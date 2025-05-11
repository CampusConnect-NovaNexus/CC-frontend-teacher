import { EXPO_BASE_URL_GR } from '@env';

export const addResolver = async (c_id: string, user_id: string) => {
    const BASEURL=EXPO_BASE_URL_GR
    console.log('BASEURL in add resolver: ',BASEURL);
  console.log('Adding Resolver:', c_id, user_id);
    
    try {
    const response = await fetch(`${BASEURL}/add_resolver/${c_id}`, 
      { method:"PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        user_id,
        }),
      });
      console.log('Response:', response);
      
    const data= await response.json()
    console.log('Added Resolver:', data);
    return data;
  } catch (error) {
    console.error('Add Resolver Error:', error);
  }
};