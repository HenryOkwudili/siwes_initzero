// src/App.js
import React, { useEffect, useState } from 'react';
import { getAccessToken, getProcesses } from './apiService';

console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);


function App() {
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProcesses = async () => {
            try {
                const accessToken = await getAccessToken();
                const processesData = await getProcesses(accessToken);
                setProcesses(processesData);
            } catch (error) {
                setError('Failed to fetch processes.');
            } finally {
                setLoading(false);
            }
        };

        fetchProcesses();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>ProcessMaker Processes</h1>
            <ul>
                {processes.map((process) => (
                    <li key={process.uid}>{process.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
