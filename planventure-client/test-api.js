// Simple API test script - run this in browser console to test connectivity
const testAPI = async () => {
  try {
    console.log('Testing API connectivity...');
    
    // Test basic connectivity
    const response = await fetch('https://playventure-backed-psbhodpxc-samit-saleems-projects.vercel.app/api', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const text = await response.text();
      console.log('✅ API is accessible:', text);
      return true;
    } else {
      console.error('❌ API responded with error:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to connect to API:', error.message);
    
    if (error.message === 'Failed to fetch') {
      console.log('🔍 This is likely a CORS issue. The backend may not allow requests from your domain.');
    }
    return false;
  }
};

// Run the test
testAPI();
