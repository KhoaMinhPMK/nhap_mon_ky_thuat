/**
 * API Module
 * Handles all fetch requests to the server
 */

const API = {
    BASE_URL: '',

    /**
     * Generic fetch wrapper with error handling
     * @param {string} url - API endpoint
     * @param {Object} options - Fetch options
     * @returns {Promise<Object>} - Response data
     */
    async request(url, options = {}) {
        try {
            const res = await fetch(this.BASE_URL + url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            return await res.json();
        } catch (error) {
            console.error(`API Error [${url}]:`, error);
            throw error;
        }
    },

    /**
     * Send control command to Arduino
     * @param {string} cmd - Command string
     * @returns {Promise<Object>}
     */
    async sendCommand(cmd) {
        Logger.log(`Cmd: ${cmd}`);
        const data = await this.request('/api/control', {
            method: 'POST',
            body: JSON.stringify({ command: cmd })
        });
        if (data.status !== "Sent") {
            Logger.error(`${data.status}`);
        }
        return data;
    },

    /**
     * Execute Blockly script
     * @param {Array} commands - Array of command objects
     * @returns {Promise<Object>}
     */
    async executeScript(commands) {
        return await this.request('/api/execute_script', {
            method: 'POST',
            body: JSON.stringify({ script: commands })
        });
    },

    /**
     * Get sensor data
     * @returns {Promise<Object>}
     */
    async getSensors() {
        return await this.request('/api/sensors');
    },

    /**
     * Get bin status
     * @returns {Promise<Object>}
     */
    async getBinStatus() {
        return await this.request('/api/bin_status');
    },

    /**
     * Reset bin flags
     * @returns {Promise<Object>}
     */
    async resetBins() {
        return await this.request('/api/reset_bins', { method: 'POST' });
    }
};

// Export for module use or attach to window for global use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
} else {
    window.API = API;
}
