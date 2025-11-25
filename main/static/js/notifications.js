/**
 * Notifications Module
 * Smart notification system with dismiss functionality
 * Prevents spam by tracking dismissed states
 */

const Notifications = {
    // Storage key for persistent state
    STORAGE_KEY: 'bin_notification_state',

    // Notification states
    state: {
        bin1: {
            previouslyFull: false,  // Was it full in last check?
            dismissed: false,       // Has user dismissed this?
            lastAlertTime: null     // When was last alert shown?
        },
        bin2: {
            previouslyFull: false,
            dismissed: false,
            lastAlertTime: null
        }
    },

    // Minimum time between alerts (ms) - prevents rapid re-alerts
    MIN_ALERT_INTERVAL: 5000,

    /**
     * Initialize notification system
     */
    init() {
        this.loadState();
        Logger.log('🔔 Notification system initialized');
    },

    /**
     * Load state from localStorage
     */
    loadState() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with default state to ensure all properties exist
                this.state = {
                    bin1: { ...this.state.bin1, ...parsed.bin1 },
                    bin2: { ...this.state.bin2, ...parsed.bin2 }
                };
            }
        } catch (e) {
            console.error('Failed to load notification state:', e);
        }
    },

    /**
     * Save state to localStorage
     */
    saveState() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
        } catch (e) {
            console.error('Failed to save notification state:', e);
        }
    },

    /**
     * Check if we should show notification for a bin
     * @param {string} binKey - 'bin1' or 'bin2'
     * @param {boolean} isFull - Current full status
     * @returns {boolean} - Should show notification?
     */
    shouldNotify(binKey, isFull) {
        const binState = this.state[binKey];
        
        // Case 1: Bin was not full before, now it is → NEW violation → SHOW
        if (isFull && !binState.previouslyFull) {
            return true;
        }

        // Case 2: Bin is full AND was full before
        if (isFull && binState.previouslyFull) {
            // If user dismissed → DON'T show
            if (binState.dismissed) {
                return false;
            }
            // If not dismissed → show (but respect interval)
            const now = Date.now();
            if (binState.lastAlertTime && (now - binState.lastAlertTime) < this.MIN_ALERT_INTERVAL) {
                return false; // Too soon
            }
            return true;
        }

        // Case 3: Bin is not full → No notification needed
        return false;
    },

    /**
     * Process bin status update and show notifications if needed
     * @param {Object} data - { bin1_full: bool, bin2_full: bool }
     */
    processBinStatus(data) {
        const bin1Full = data.bin1_full;
        const bin2Full = data.bin2_full;
        
        // Reset dismissed state if bin was emptied and is now full again (new violation)
        if (bin1Full && !this.state.bin1.previouslyFull) {
            this.state.bin1.dismissed = false;
        }
        if (bin2Full && !this.state.bin2.previouslyFull) {
            this.state.bin2.dismissed = false;
        }

        // If bin is emptied, reset all states for that bin
        if (!bin1Full) {
            this.state.bin1.dismissed = false;
        }
        if (!bin2Full) {
            this.state.bin2.dismissed = false;
        }

        // Determine what to show
        const shouldNotifyBin1 = this.shouldNotify('bin1', bin1Full);
        const shouldNotifyBin2 = this.shouldNotify('bin2', bin2Full);

        // Update previous states
        this.state.bin1.previouslyFull = bin1Full;
        this.state.bin2.previouslyFull = bin2Full;

        // Build notification message
        let message = '';
        let shouldShow = false;
        let affectedBins = [];

        if (shouldNotifyBin1 && shouldNotifyBin2) {
            message = '⚠️ CẢ 2 HỐ ĐÃ ĐẦY! Vui lòng dọn rác.';
            shouldShow = true;
            affectedBins = ['bin1', 'bin2'];
        } else if (shouldNotifyBin1) {
            message = '⚠️ HỐ PREMIUM ĐÃ ĐẦY! Vui lòng dọn rác.';
            shouldShow = true;
            affectedBins = ['bin1'];
        } else if (shouldNotifyBin2) {
            message = '⚠️ HỐ SECOND-GRADE ĐÃ ĐẦY! Vui lòng dọn rác.';
            shouldShow = true;
            affectedBins = ['bin2'];
        }

        // Show or hide notification
        if (shouldShow) {
            this.showAlert(message, affectedBins);
            // Update last alert time
            affectedBins.forEach(bin => {
                this.state[bin].lastAlertTime = Date.now();
            });
        } else if (!bin1Full && !bin2Full) {
            // Both bins are empty → hide notification
            this.hideAlert();
        } else if ((bin1Full && this.state.bin1.dismissed) || (bin2Full && this.state.bin2.dismissed)) {
            // Bins are full but user dismissed → keep banner hidden
            // Check if ALL full bins are dismissed
            const allDismissed = 
                (!bin1Full || this.state.bin1.dismissed) && 
                (!bin2Full || this.state.bin2.dismissed);
            if (allDismissed) {
                this.hideAlert();
            }
        }

        this.saveState();
    },

    /**
     * Show alert banner
     * @param {string} message - Alert message
     * @param {Array} affectedBins - Which bins triggered this alert
     */
    showAlert(message, affectedBins = []) {
        const banner = document.getElementById('alert-banner');
        const messageEl = document.getElementById('alert-message');
        
        if (!banner || !messageEl) return;

        // Build message with buttons
        let html = `<span class="alert-text">${message}</span>`;
        html += '<div class="alert-actions">';
        
        // Dismiss button
        html += `<button class="btn-dismiss" onclick="Notifications.dismissCurrent()">
            ✕ Đã biết
        </button>`;
        
        // Reset button (cleaned trash)
        html += `<button class="btn-reset" onclick="Notifications.resetBins()">
            🗑 Đã dọn rác
        </button>`;
        
        html += '</div>';

        messageEl.innerHTML = html;
        banner.style.display = 'block';
        banner.dataset.affectedBins = affectedBins.join(',');
        
        Logger.warn(message);
    },

    /**
     * Dismiss current notification (user acknowledges but hasn't cleaned)
     */
    dismissCurrent() {
        const banner = document.getElementById('alert-banner');
        if (!banner) return;

        const affectedBins = (banner.dataset.affectedBins || '').split(',').filter(b => b);
        
        // Mark affected bins as dismissed
        affectedBins.forEach(bin => {
            if (this.state[bin]) {
                this.state[bin].dismissed = true;
            }
        });

        this.saveState();
        this.hideAlert();
        Logger.log('🔕 Đã tắt thông báo (sẽ không hiện lại cho đến khi có vi phạm mới)');
    },

    /**
     * Reset bins (user has cleaned the trash)
     */
    async resetBins() {
        try {
            await API.resetBins();
            
            // Reset all states
            this.state.bin1 = { previouslyFull: false, dismissed: false, lastAlertTime: null };
            this.state.bin2 = { previouslyFull: false, dismissed: false, lastAlertTime: null };
            this.saveState();
            
            this.hideAlert();
            Logger.success('Đã reset trạng thái hố');
        } catch (e) {
            Logger.error('Không thể reset bins: ' + e);
        }
    },

    /**
     * Hide alert banner
     */
    hideAlert() {
        const banner = document.getElementById('alert-banner');
        if (banner) {
            banner.style.display = 'none';
        }
    },

    /**
     * Force show notification (for testing/manual trigger)
     * @param {string} message - Custom message
     */
    forceShow(message) {
        this.showAlert(message, []);
    },

    /**
     * Get current state (for debugging)
     * @returns {Object}
     */
    getState() {
        return { ...this.state };
    },

    /**
     * Clear all state (for debugging/reset)
     */
    clearState() {
        this.state = {
            bin1: { previouslyFull: false, dismissed: false, lastAlertTime: null },
            bin2: { previouslyFull: false, dismissed: false, lastAlertTime: null }
        };
        this.saveState();
        Logger.log('🔄 Notification state cleared');
    },
    
    /**
     * Show a toast notification (general purpose)
     * @param {string} message - Message to display
     * @param {string} type - 'success', 'error', 'info', 'warning'
     */
    show(message, type = 'info') {
        // Create toast container if not exists
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(container);
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️',
            warning: '⚠️'
        };
        
        const colors = {
            success: '#4caf50',
            error: '#f44336',
            info: '#2196f3',
            warning: '#ff9800'
        };
        
        toast.style.cssText = `
            padding: 12px 20px;
            background: ${colors[type] || colors.info};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            animation: slideIn 0.3s ease;
            max-width: 350px;
        `;
        
        toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${message}</span>`;
        container.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// Export for module use or attach to window for global use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Notifications;
} else {
    window.Notifications = Notifications;
}
