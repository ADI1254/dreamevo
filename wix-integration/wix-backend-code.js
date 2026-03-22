// Wix Velo Backend Code (backend/http-functions.js)
// This file enables Wix to call your FastAPI backend

import { fetch } from 'wix-fetch';

const BACKEND_URL = 'https://your-backend-url.com'; // Replace with your deployed backend URL

export async function get_getStory(request) {
  const { world, mood } = request.query;
  
  try {
    const response = await fetch(`${BACKEND_URL}/story/${world}/${mood}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    return {
      status: 200,
      body: data,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    return {
      status: 500,
      body: { error: error.message },
      headers: { 'Content-Type': 'application/json' }
    };
  }
}
