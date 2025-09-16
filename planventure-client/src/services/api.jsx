const BASE_URL = import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL;

console.log('API Base URL:', BASE_URL, 'DEV mode:', import.meta.env.DEV); // Debug log

const makeRequest = async (url, options, retries = 1) => {
  for (let i = 0; i <= retries; i++) {
    try {
      console.log(`Making request to: ${url}`, options); // Debug log
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      console.error(`Request attempt ${i + 1} failed:`, error);
      
      if (error.message === 'Failed to fetch') {
        if (i === retries) {
          // Check if it might be a CORS issue
          const corsError = new Error(
            'Network error: Unable to connect to server. This might be due to:\n' +
            '1. CORS policy blocking the request\n' +
            '2. Backend server is down\n' +
            '3. Network connectivity issues\n' +
            '4. Firewall blocking the request\n\n' +
            'Try refreshing the page or contact support.'
          );
          corsError.name = 'NetworkError';
          throw corsError;
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Session expired. Please login again.');
  }

  if (response.status === 404) {
    throw new Error('Trip not found');
  }

  // Handle CORS or network errors
  if (!response.ok && response.status === 0) {
    throw new Error('Network error: CORS policy or connection issue');
  }

  let data;
  try {
    data = await response.json();
  } catch (jsonError) {
    console.error('Failed to parse JSON response:', jsonError);
    throw new Error('Invalid response format from server');
  }

  if (!response.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
  }

  console.log('API Response:', data); // Debug log
  return data;
};

export const api = {
  get: async (endpoint) => {
    try {
      const response = await makeRequest(`${BASE_URL}${endpoint}`, {
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('GET request failed:', error);
      throw error;
    }
  },
  
  post: async (endpoint, data) => {
    try {
      const response = await makeRequest(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  },

  put: async (endpoint, data) => {
    try {
      const response = await makeRequest(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('PUT request failed:', error);
      throw error;
    }
  },

  delete: async (endpoint) => {
    try {
      const response = await makeRequest(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('DELETE request failed:', error);
      throw error;
    }
  },

  auth: {
    login: async (credentials) => {
      return api.post('/api/auth/login', credentials);
    },

    register: async (userData) => {
      return api.post('/api/auth/register', userData);
    }
  },

  // Health check function
  healthCheck: async () => {
    try {
      const response = await fetch(`${BASE_URL}/api`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      
      const text = await response.text();
      console.log('API Health Check:', text);
      return { status: 'healthy', message: text };
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error(`API is not accessible: ${error.message}`);
    }
  }
};

export default api;