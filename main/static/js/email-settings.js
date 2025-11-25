/**
 * Email Settings Module
 * Manages email notification configuration
 */

const EmailSettings = {
    config: {},
    
    /**
     * Initialize - load current config
     */
    async init() {
        await this.loadConfig();
    },
    
    /**
     * Open settings modal
     */
    async open() {
        await this.loadConfig();
        this.renderRecipients();
        document.getElementById('emailSettingsModal').style.display = 'flex';
    },
    
    /**
     * Close settings modal
     */
    close() {
        document.getElementById('emailSettingsModal').style.display = 'none';
    },
    
    /**
     * Load config from server
     */
    async loadConfig() {
        try {
            const response = await fetch('/api/email/config');
            this.config = await response.json();
            this.applyConfigToUI();
        } catch (e) {
            console.error('Error loading email config:', e);
        }
    },
    
    /**
     * Apply config to form fields
     */
    applyConfigToUI() {
        const enabledCheckbox = document.getElementById('emailEnabled');
        enabledCheckbox.checked = this.config.enabled || false;
        document.getElementById('notifyBin1').checked = this.config.notify_bin1_full !== false;
        document.getElementById('notifyBin2').checked = this.config.notify_bin2_full !== false;
        
        // Update toggle card active state
        this.updateToggleCardState(enabledCheckbox.checked);
        
        // Add event listener for toggle changes
        enabledCheckbox.addEventListener('change', (e) => {
            this.updateToggleCardState(e.target.checked);
        });
    },
    
    /**
     * Update toggle card active state
     */
    updateToggleCardState(isActive) {
        const card = document.getElementById('masterToggleCard');
        if (isActive) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    },
    
    /**
     * Render recipient list
     */
    renderRecipients() {
        const list = document.getElementById('recipientList');
        const countEl = document.getElementById('recipientCount');
        const emptyEl = document.getElementById('emptyRecipients');
        const recipients = this.config.recipient_emails || [];
        
        // Update count
        countEl.textContent = `${recipients.length} email`;
        
        // Show/hide empty state
        if (recipients.length === 0) {
            list.innerHTML = '';
            emptyEl.style.display = 'block';
            return;
        }
        
        emptyEl.style.display = 'none';
        
        // Render recipient items with avatar
        list.innerHTML = recipients.map(email => {
            const initial = email.charAt(0).toUpperCase();
            return `
                <div class="recipient-item">
                    <div class="recipient-info">
                        <div class="recipient-avatar">${initial}</div>
                        <span class="recipient-email">${email}</span>
                    </div>
                    <button class="btn-remove" onclick="EmailSettings.removeRecipient('${email}')" title="Xóa">×</button>
                </div>
            `;
        }).join('');
    },
    
    /**
     * Add recipient
     */
    async addRecipient() {
        const input = document.getElementById('newRecipient');
        const email = input.value.trim();
        
        if (!email || !email.includes('@')) {
            Notifications.show('Vui lòng nhập email hợp lệ', 'error');
            return;
        }
        
        try {
            const response = await fetch('/api/email/recipients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.config.recipient_emails = result.recipients;
                this.renderRecipients();
                input.value = '';
                Notifications.show(`Đã thêm ${email}`, 'success');
            } else {
                Notifications.show(result.message || 'Lỗi thêm email', 'error');
            }
        } catch (e) {
            console.error('Error adding recipient:', e);
            Notifications.show('Lỗi kết nối', 'error');
        }
    },
    
    /**
     * Remove recipient
     */
    async removeRecipient(email) {
        try {
            const response = await fetch('/api/email/recipients', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.config.recipient_emails = result.recipients;
                this.renderRecipients();
                Notifications.show(`Đã xóa ${email}`, 'info');
            }
        } catch (e) {
            console.error('Error removing recipient:', e);
        }
    },
    
    /**
     * Toggle email enabled
     */
    toggleEnabled() {
        // Will be saved when user clicks save
    },
    
    /**
     * Save configuration
     */
    async save() {
        const config = {
            enabled: document.getElementById('emailEnabled').checked,
            notify_bin1_full: document.getElementById('notifyBin1').checked,
            notify_bin2_full: document.getElementById('notifyBin2').checked
        };
        
        try {
            const response = await fetch('/api/email/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(config)
            });
            
            const result = await response.json();
            
            if (result.success) {
                Notifications.show('Đã lưu cài đặt email', 'success');
                this.close();
            } else {
                Notifications.show('Lỗi lưu cài đặt', 'error');
            }
        } catch (e) {
            console.error('Error saving email config:', e);
            Notifications.show('Lỗi kết nối', 'error');
        }
    },
    
    /**
     * Test email
     */
    async testEmail() {
        // First save current config
        await this.save();
        
        Notifications.show('Đang gửi email test...', 'info');
        
        try {
            const response = await fetch('/api/email/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            
            const result = await response.json();
            
            if (result.success) {
                Notifications.show(result.message, 'success');
            } else {
                Notifications.show(result.message, 'error');
            }
        } catch (e) {
            console.error('Error testing email:', e);
            Notifications.show('Lỗi gửi email test', 'error');
        }
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    EmailSettings.init();
});
