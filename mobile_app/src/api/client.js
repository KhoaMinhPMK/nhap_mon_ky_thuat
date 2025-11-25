import axios from 'axios';

const API_URL = 'https://bkuteam.site/upload';

const client = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

// ==================== BASIC APIs ====================

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

// ==================== INVENTORY APIs ====================

/**
 * Lấy trạng thái tồn kho
 * @param {string} deviceId - ID thiết bị (optional)
 * @returns {Object} { success, total_items, total_capacity, overall_fill_percentage, bins[] }
 */
export const getInventory = async (deviceId = null) => {
    try {
        const params = deviceId ? `?device_id=${deviceId}` : '';
        const response = await client.get(`/get_inventory.php${params}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching inventory:', error);
        return null;
    }
};

// ==================== ALERTS APIs ====================

/**
 * Lấy danh sách cảnh báo
 * @param {Object} options - { deviceId, limit, unreadOnly, severity }
 * @returns {Object} { success, unread_count, severity_breakdown, alerts[] }
 */
export const getAlerts = async (options = {}) => {
    try {
        const params = new URLSearchParams();
        if (options.deviceId) params.append('device_id', options.deviceId);
        if (options.limit) params.append('limit', options.limit);
        if (options.unreadOnly) params.append('unread_only', 'true');
        if (options.severity) params.append('severity', options.severity);
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const response = await client.get(`/get_alerts.php${queryString}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching alerts:', error);
        return null;
    }
};

// ==================== ANALYTICS APIs ====================

/**
 * Lấy thống kê nâng cao
 * @param {string} deviceId - ID thiết bị (optional)
 * @param {string} range - 'today' | 'week' | 'month' | 'year'
 * @returns {Object} { success, summary, breakdown_by_class, daily_trend, hourly_distribution, ... }
 */
export const getAnalytics = async (deviceId = null, range = 'today') => {
    try {
        const params = new URLSearchParams();
        if (deviceId) params.append('device_id', deviceId);
        params.append('range', range);
        
        const response = await client.get(`/get_analytics.php?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return null;
    }
};

// ==================== COMBINED DATA FOR CHATBOT ====================

/**
 * Lấy tất cả data context cho chatbot
 * @param {string} deviceId - ID thiết bị
 * @returns {Object} Combined data từ tất cả APIs
 */
export const getChatbotContext = async (deviceId) => {
    try {
        const [stats, inventory, alerts, analyticsToday, analyticsWeek] = await Promise.all([
            getStats(),
            getInventory(deviceId),
            getAlerts({ deviceId, limit: 10 }),
            getAnalytics(deviceId, 'today'),
            getAnalytics(deviceId, 'week')
        ]);

        return {
            success: true,
            fetchedAt: new Date().toISOString(),
            deviceId,
            stats,
            inventory,
            alerts,
            analytics: {
                today: analyticsToday,
                week: analyticsWeek
            }
        };
    } catch (error) {
        console.error('Error fetching chatbot context:', error);
        return { success: false, error: error.message };
    }
};

export default client;
