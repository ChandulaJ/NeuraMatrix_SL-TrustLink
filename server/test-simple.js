const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test data without phone number
const testUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'SecurePass123!',
  gender: 'MALE',
  dateOfBirth: '1990-01-01',
  role: 'CITIZEN',
  nationalId: '123456789012'
};

let authToken = '';

async function testAuth() {
  console.log('🧪 Testing Authentication System (Simplified)\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/auth/health`);
    console.log('✅ Health Check:', healthResponse.data.message);

    // Test 2: User Registration
    console.log('\n2. Testing User Registration...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
    console.log('✅ Registration:', registerResponse.data.message);
    authToken = registerResponse.data.data.token;
    console.log('📝 Token received:', authToken.substring(0, 20) + '...');

    // Test 3: Login (should work immediately after registration)
    console.log('\n3. Testing Login (should work immediately after registration)...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login successful:', loginResponse.data.message);

    // Test 4: Get Profile with token
    console.log('\n4. Testing Get Profile with token...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('✅ Profile retrieved:', profileResponse.data.data.user.firstName);

    console.log('\n🎉 All authentication tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- User registration works (without email verification)');
    console.log('- Login works immediately after registration');
    console.log('- JWT token authentication works');
    console.log('- Profile management works');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the tests
testAuth();
