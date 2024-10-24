// src/apiService.js
import axios from 'axios';

// Define your ProcessMaker instance URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Function to get access token
export const getAccessToken = async () => {
    const authUrl = `${API_BASE_URL}/oauth/token`;
    const authPayload = {
        grant_type: 'password',
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.REACT_APP_CLIENT_SECRET,
        scope: '*',
    };

    try {
        const response = await axios.post(authUrl, authPayload, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token', error);
        throw error;
    }
};

// Function to get list of processes
export const getProcesses = async (accessToken) => {
    const apiUrl = `${API_BASE_URL}/api/1.0/workflow/process`;
    try {
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching processes', error);
        throw error;
    }
};
