/**
 * Sensors Module
 * Handles sensor polling and UI updates
 */

const Sensors = {
    // Polling intervals (ms)
    SENSOR_POLL_INTERVAL: 2000,
    BIN_STATUS_POLL_INTERVAL: 1000,

    // Interval IDs for cleanup
    _sensorIntervalId: null,
    _binStatusIntervalId: null,

    /**
     * Initialize sensor polling
     */
    init() {
        this.startSensorPolling();
        this.startBinStatusPolling();
        Logger.log('📡 Sensor monitoring started');
    },

    /**
     * Start polling sensors
     */
    startSensorPolling() {
        // Poll immediately
        this.pollSensors();
        // Then set interval
        this._sensorIntervalId = setInterval(() => this.pollSensors(), this.SENSOR_POLL_INTERVAL);
    },

    /**
     * Start polling bin status
     */
    startBinStatusPolling() {
        // Poll immediately
        this.checkBinStatus();
        // Then set interval
        this._binStatusIntervalId = setInterval(() => this.checkBinStatus(), this.BIN_STATUS_POLL_INTERVAL);
    },

    /**
     * Stop all polling
     */
    stopPolling() {
        if (this._sensorIntervalId) {
            clearInterval(this._sensorIntervalId);
            this._sensorIntervalId = null;
        }
        if (this._binStatusIntervalId) {
            clearInterval(this._binStatusIntervalId);
            this._binStatusIntervalId = null;
        }
        Logger.log('📡 Sensor monitoring stopped');
    },

    /**
     * Poll sensor data and update UI
     */
    async pollSensors() {
        try {
            const data = await API.getSensors();
            this.updateSensorUI(data);
        } catch (e) {
            console.error('Sensor Poll Error:', e);
        }
    },

    /**
     * Update sensor indicators in UI
     * @param {Object} data - { s1: number, s2: number }
     */
    updateSensorUI(data) {
        const s1 = document.getElementById('s1-indicator');
        const s2 = document.getElementById('s2-indicator');

        if (s1) {
            if (data.s1 === 0) {
                s1.style.background = '#2e7d32'; // Green
                s1.innerText = "S1: DETECT";
                s1.classList.add('detected');
                s1.classList.remove('clear');
            } else {
                s1.style.background = '#c62828'; // Red
                s1.innerText = "S1: CLEAR";
                s1.classList.add('clear');
                s1.classList.remove('detected');
            }
        }

        if (s2) {
            if (data.s2 === 0) {
                s2.style.background = '#2e7d32'; // Green
                s2.innerText = "S2: DETECT";
                s2.classList.add('detected');
                s2.classList.remove('clear');
            } else {
                s2.style.background = '#c62828'; // Red
                s2.innerText = "S2: CLEAR";
                s2.classList.add('clear');
                s2.classList.remove('detected');
            }
        }
    },

    /**
     * Check bin status and trigger notifications
     */
    async checkBinStatus() {
        try {
            const data = await API.getBinStatus();
            // Let Notifications module handle the logic
            Notifications.processBinStatus(data);
        } catch (e) {
            console.error('Error checking bin status:', e);
        }
    }
};

// Export for module use or attach to window for global use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Sensors;
} else {
    window.Sensors = Sensors;
}
