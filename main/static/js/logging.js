/**
 * Logging Module
 * Handles console and UI logging
 */

const Logger = {
    /**
     * Log message to UI log box
     * @param {string} msg - Message to log
     */
    log(msg) {
        const logBox = document.getElementById('log');
        if (!logBox) {
            console.log(msg);
            return;
        }
        const time = new Date().toLocaleTimeString();
        logBox.innerHTML += `<div>[${time}] ${msg}</div>`;
        logBox.scrollTop = logBox.scrollHeight;
    },

    /**
     * Log error message
     * @param {string} msg - Error message
     */
    error(msg) {
        this.log(`❌ Error: ${msg}`);
        console.error(msg);
    },

    /**
     * Log success message
     * @param {string} msg - Success message
     */
    success(msg) {
        this.log(`✓ ${msg}`);
    },

    /**
     * Log warning message
     * @param {string} msg - Warning message
     */
    warn(msg) {
        this.log(`⚠️ ${msg}`);
        console.warn(msg);
    },

    /**
     * Clear log box
     */
    clear() {
        const logBox = document.getElementById('log');
        if (logBox) {
            logBox.innerHTML = '';
        }
    }
};

// Export for module use or attach to window for global use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Logger;
} else {
    window.Logger = Logger;
}
