import axios from 'axios';

const API_URL = 'https://bkuteam.site/upload';

const client = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

export const getStats = async () => {
    try {
        const response = await client.get('/get_stats.php');
        return response.data;
    } catch (error) {
        console.error('Error fetching stats:', error);
        return null;
    }
};

export const getLogs = async () => {
    try {
        const response = await client.get('/get_logs.php');
        return response.data;
    } catch (error) {
        console.error('Error fetching logs:', error);
        return [];
    }
};

export default client;
