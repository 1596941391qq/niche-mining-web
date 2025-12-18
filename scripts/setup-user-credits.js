#!/usr/bin/env node

const userId = '7e23b466-4c18-455a-97fa-cb5290a5000a';
const apiUrl = process.argv[2] || 'https://niche-mining-web.vercel.app';

const setupCredits = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/test/setup-credits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        plan: 'pro',
        credits: 10000
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Credits setup successfully!');
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.error('❌ Failed to setup credits');
      console.error(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

setupCredits();
