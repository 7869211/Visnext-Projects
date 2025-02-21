import axios from 'axios';

export const handleApiError = (error:unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Handle different status codes
      switch (error.response.status) {
        case 400:
          throw new Error('Bad Request');
        case 401:
          throw new Error('Unauthorized');
        case 403:
          throw new Error('Forbidden');
        case 404:
          throw new Error('Not Found');
        case 500:
          throw new Error('Internal Server Error');
        default:
          throw new Error(`Unhandled error status: ${error.response.status}`);
      }
    } else if (error.request) {
      // No response received
      throw new Error('No response received from the server');
    }
  } else {
    // Non-Axios error
    throw new Error('An unknown error occurred');
  }
};
