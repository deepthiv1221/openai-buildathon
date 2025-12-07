#!/usr/bin/env node

/**
 * QUICK DEBUGGING TEST
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testBasicConnection() {
  try {
    console.log('🔍 Testing connection to backend...');
    console.log(`   URL: ${BASE_URL}`);
    
    // Test basic connection
    const response = await axios.post(`${BASE_URL}/api/submit-case`, {
      patientName: 'Test Patient',
      age: 25,
      gender: 'Male',
      symptoms: 'Headache',
      diagnosis: 'Migraine',
      medications: ['Aspirin'],
      submissionType: 'text'
    }, {
      timeout: 5000
    });
    
    console.log('✅ Connection successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (err) {
    console.log('❌ Connection failed!');
    console.log('Error message:', err.message);
    
    if (err.response) {
      console.log('Status code:', err.response.status);
      console.log('Response data:', JSON.stringify(err.response.data, null, 2));
    } else if (err.request) {
      console.log('No response received');
      console.log('Request:', err.request);
    } else {
      console.log('Error:', err);
    }
  }
  
  // Check port
  console.log('\n🔍 Checking if port 5000 is listening...');
  const net = require('net');
  const server = net.createConnection({
    host: 'localhost',
    port: 5000,
    timeout: 2000
  });
  
  server.on('connect', () => {
    console.log('✅ Port 5000 is listening');
    server.end();
  });
  
  server.on('error', (err) => {
    console.log('❌ Cannot connect to port 5000:', err.message);
  });
}

testBasicConnection();
