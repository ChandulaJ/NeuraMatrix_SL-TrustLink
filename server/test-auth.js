const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test data
const testUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'SecurePass123!',
  phoneNumber: '+1234567890',
  gender: 'MALE',
  dateOfBirth: '1990-01-01',
  role: 'CITIZEN',
  nationalId: '123456789012'
};

let authToken = '';

async function testAuth() {
  console.log('🧪 Testing Authentication System\n');

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

    // Test 4: Get Profile (should fail without valid token)
    console.log('\n4. Testing Get Profile (should fail without valid token)...');
    try {
      await axios.get(`${BASE_URL}/auth/profile`);
    } catch (error) {
      console.log('✅ Profile access correctly failed:', error.response.data.message);
    }

    // Test 5: Get Profile with token
    console.log('\n5. Testing Get Profile with token...');
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('✅ Profile retrieved:', profileResponse.data.data.user.firstName);

    // Test 6: Update Profile
    console.log('\n6. Testing Update Profile...');
    const updateResponse = await axios.put(`${BASE_URL}/auth/profile`, {
      firstName: 'Johnny',
      lastName: 'Smith'
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('✅ Profile updated:', updateResponse.data.message);

    // Test 7: Change Password
    console.log('\n7. Testing Change Password...');
    const changePasswordResponse = await axios.post(`${BASE_URL}/auth/change-password`, {
      currentPassword: testUser.password,
      newPassword: 'NewSecurePass123!'
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('✅ Password changed:', changePasswordResponse.data.message);

    // Test 8: Forgot Password
    console.log('\n8. Testing Forgot Password...');
    const forgotPasswordResponse = await axios.post(`${BASE_URL}/auth/forgot-password`, {
      email: testUser.email
    });
    console.log('✅ Forgot password:', forgotPasswordResponse.data.message);

    // Test 9: Logout
    console.log('\n9. Testing Logout...');
    const logoutResponse = await axios.post(`${BASE_URL}/auth/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('✅ Logout:', logoutResponse.data.message);

    console.log('\n🎉 All authentication tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- User registration works');
    console.log('- Login works immediately after registration (no email verification required)');
    console.log('- JWT token authentication works');
    console.log('- Profile management works');
    console.log('- Password change works');
    console.log('- Forgot password works');
    console.log('- Logout works');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the tests
testAuth();
