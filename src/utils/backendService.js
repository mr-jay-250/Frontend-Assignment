import axios from 'axios';

const API_URL = 'https://65c49822dae2304e92e2e387.mockapi.io/api/form-response';

export const submitFormData = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    console.log('Server response:', response.data);
    alert('Data submitted successfully');
  } catch (error) {
    console.error('Error submitting data to the backend:', error);
    throw error;
  }
};
