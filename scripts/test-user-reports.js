// Simple test script for the user reports endpoint
const axios = require('axios');
require('dotenv').config();

// Get the base URL from environment or use default
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const TEST_USER_ID = process.env.TEST_USER_ID || '68ed3c00a1efba5e7b0f960b'; // Replace with a valid user ID from your database

async function testGetUserReports() {
  try {
    console.log(`Testing GET /api/reports/user/${TEST_USER_ID}`);
    
    const response = await axios.get(`${BASE_URL}/api/reports/user/${TEST_USER_ID}`);
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    if (response.data.success) {
      console.log('✅ Test passed!');
      console.log(`Found ${response.data.data.stats.totalReports} reports`);
      console.log(`Recycling rate: ${response.data.data.stats.recyclingRate}%`);
    } else {
      console.error('❌ Test failed - Unexpected response format');
    }
  } catch (error) {
    console.error('❌ Test failed with error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

// Run the test
testGetUserReports();
