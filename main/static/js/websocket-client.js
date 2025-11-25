/**
 * WebSocket Client Module
 * Handles realtime communication with server
 */

const WebSocketClient = {
    socket: null,
    isConnected: false,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5,
    reconnectDelay: 2000,

    // Event callbacks
    callbacks: {
        onConnect: null,
        onDisconnect: null,
        onProgress: null,
        onBinStatus: null,
        onError: null,
        onScriptComplete: null,
        onPrediction: null
    },

    /**
     * Initialize WebSocket connection
     */
    init() {
        // Load Socket.IO client
        if (typeof io === 'undefined') {
            console.error('Socket.IO client not loaded!');
            this._loadSocketIO();
            return;
        }

        this._connect();
    },

    /**
     * Load Socket.IO script dynamically
     */
    _loadSocketIO() {
        const script = document.createElement('script');
        script.src = 'https://cdn.socket.io/4.6.0/socket.io.min.js';
        script.onload = () => {
            console.log('Socket.IO loaded');
            this._connect();
        };
        document.head.appendChild(script);
    },

    /**
     * Establish WebSocket connection
     */
    _connect() {
        const url = window.location.origin;
        
        this.socket = io(url, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: this.maxReconnectAttempts,
            reconnectionDelay: this.reconnectDelay
        });

        this._setupEventHandlers();
        Logger.log('🔌 Connecting to WebSocket...');
    },

    /**
     * Setup all event handlers
     */
    _setupEventHandlers() {
        const socket = this.socket;

        // Connection events
        socket.on('connect', () => {
            this.isConnected = true;
            this.reconnectAttempts = 0;
            Logger.success('WebSocket connected');
            
            if (this.callbacks.onConnect) {
                this.callbacks.onConnect();
            }
        });

        socket.on('disconnect', (reason) => {
            this.isConnected = false;
            Logger.warn(`WebSocket disconnected: ${reason}`);
            
            if (this.callbacks.onDisconnect) {
                this.callbacks.onDisconnect(reason);
            }
        });

        socket.on('connect_error', (error) => {
            Logger.error(`Connection error: ${error.message}`);
            this.reconnectAttempts++;
        });

        // Status events
        socket.on('status', (data) => {
            console.log('Status:', data);
            this._handleStatus(data);
        });

        // Script execution events
        socket.on('script_queued', (data) => {
            Logger.log(`📋 Script queued (position: ${data.position}, queue size: ${data.queue_size})`);
        });

        socket.on('script_started', (data) => {
            Logger.log(`▶ Script started: ${data.task_id} (${data.total_steps} steps)`);
            ProgressBar.show(data.total_steps);
        });

        socket.on('script_progress', (data) => {
            ProgressBar.update(data.current_step, data.total_steps, data.block_type);
            
            if (this.callbacks.onProgress) {
                this.callbacks.onProgress(data);
            }
        });

        socket.on('script_completed', (data) => {
            Logger.success(`Script ${data.task_id} completed`);
            ProgressBar.complete();
            
            if (this.callbacks.onScriptComplete) {
                this.callbacks.onScriptComplete(data);
            }
        });

        socket.on('script_stopped', (data) => {
            Logger.warn('Script stopped by user');
            ProgressBar.hide();
        });

        socket.on('script_error', (data) => {
            Logger.error(`Script error: ${data.error}`);
            ProgressBar.error(data.error);
            
            if (this.callbacks.onError) {
                this.callbacks.onError(data);
            }
        });

        // Execution events
        socket.on('executing', (data) => {
            const action = data.action;
            let msg = '';
            
            switch (action) {
                case 'move':
                    msg = `Moving: X=${data.params.x}, Y=${data.params.y}, Z=${data.params.z}`;
                    break;
                case 'relay':
                    msg = `Relay: ${data.state ? 'ON' : 'OFF'}`;
                    break;
                case 'wait':
                    msg = `Waiting ${data.duration}s...`;
                    break;
                case 'check_label':
                    msg = `Checking for: ${data.target}`;
                    break;
                case 'repeat':
                    msg = `Loop ${data.iteration}/${data.total}`;
                    break;
                default:
                    msg = `Executing: ${action}`;
            }
            
            Logger.log(`⚡ ${msg}`);
        });

        // Prediction events
        socket.on('prediction', (data) => {
            Logger.log(`🏷 Detected: ${data.label} (${data.confidence}%)`);
            
            if (this.callbacks.onPrediction) {
                this.callbacks.onPrediction(data);
            }
        });

        // Bin status events
        socket.on('bin_status', (data) => {
            this._handleBinStatus(data);
        });

        socket.on('bin_full_warning', (data) => {
            Logger.warn(`⚠️ Bin full for ${data.label}!`);
            Notifications.processBinStatus(data.bin_status);
        });

        socket.on('bins_reset', (data) => {
            Logger.success('Bins reset');
            Notifications.processBinStatus(data);
        });

        // ML events
        socket.on('ml_loading', () => {
            Logger.log('🧠 Loading ML model...');
        });

        socket.on('ml_ready', () => {
            Logger.success('ML model ready');
        });

        // Command response
        socket.on('command_response', (data) => {
            Logger.log(`Arduino: ${data.response}`);
        });
    },

    /**
     * Handle status update
     */
    _handleStatus(data) {
        if (data.bins) {
            this._handleBinStatus(data.bins);
        }
        
        if (data.script_running) {
            ProgressBar.show();
        }
    },

    /**
     * Handle bin status update
     */
    _handleBinStatus(data) {
        Notifications.processBinStatus(data);
        
        if (this.callbacks.onBinStatus) {
            this.callbacks.onBinStatus(data);
        }
    },

    // ============ API Methods ============

    /**
     * Execute script via WebSocket
     */
    executeScript(script, priority = false) {
        if (!this.isConnected) {
            Logger.error('Not connected to server');
            return false;
        }

        this.socket.emit('execute_script', {
            script: script,
            priority: priority
        });
        
        return true;
    },

    /**
     * Stop current script
     */
    stopScript() {
        this.socket.emit('stop_script');
    },

    /**
     * Clear script queue
     */
    clearQueue() {
        this.socket.emit('clear_queue');
    },

    /**
     * Get current status
     */
    getStatus() {
        this.socket.emit('get_status');
    },

    /**
     * Reset bins
     */
    resetBins() {
        this.socket.emit('reset_bins');
    },

    /**
     * Send manual command
     */
    sendCommand(cmd) {
        this.socket.emit('manual_command', { command: cmd });
    },

    /**
     * Set callback function
     */
    on(event, callback) {
        if (this.callbacks.hasOwnProperty('on' + event.charAt(0).toUpperCase() + event.slice(1))) {
            this.callbacks['on' + event.charAt(0).toUpperCase() + event.slice(1)] = callback;
        }
    }
};

/**
 * Progress Bar UI Component
 */
const ProgressBar = {
    container: null,
    bar: null,
    text: null,
    isVisible: false,

    /**
     * Create progress bar element
     */
    _create() {
        if (this.container) return;

        this.container = document.createElement('div');
        this.container.id = 'progress-container';
        this.container.innerHTML = `
            <div class="progress-wrapper">
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <div class="progress-text">0%</div>
                <button class="progress-cancel" onclick="WebSocketClient.stopScript()">✕ Stop</button>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #progress-container {
                position: fixed;
                bottom: 120px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--bg-panel, #252526);
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                z-index: 9999;
                display: none;
                min-width: 300px;
            }
            #progress-container.visible {
                display: block;
                animation: slideUp 0.3s ease-out;
            }
            @keyframes slideUp {
                from { transform: translateX(-50%) translateY(20px); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
            .progress-wrapper {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            .progress-bar {
                flex: 1;
                height: 8px;
                background: #333;
                border-radius: 4px;
                overflow: hidden;
            }
            .progress-fill {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #4caf50, #8bc34a);
                border-radius: 4px;
                transition: width 0.3s ease;
            }
            .progress-fill.error {
                background: linear-gradient(90deg, #f44336, #e91e63);
            }
            .progress-text {
                min-width: 50px;
                text-align: right;
                font-weight: bold;
                color: #fff;
            }
            .progress-cancel {
                background: #c62828;
                color: white;
                border: none;
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }
            .progress-cancel:hover {
                background: #d32f2f;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(this.container);

        this.bar = this.container.querySelector('.progress-fill');
        this.text = this.container.querySelector('.progress-text');
    },

    /**
     * Show progress bar
     */
    show(totalSteps = 0) {
        this._create();
        this.container.classList.add('visible');
        this.bar.classList.remove('error');
        this.bar.style.width = '0%';
        this.text.textContent = totalSteps > 0 ? `0/${totalSteps}` : '0%';
        this.isVisible = true;
    },

    /**
     * Update progress
     */
    update(current, total, blockType = '') {
        if (!this.isVisible) this.show(total);
        
        const percent = Math.round((current / total) * 100);
        this.bar.style.width = `${percent}%`;
        this.text.textContent = `${current}/${total}`;
    },

    /**
     * Mark as complete
     */
    complete() {
        this.bar.style.width = '100%';
        this.text.textContent = '✓ Done';
        
        setTimeout(() => this.hide(), 2000);
    },

    /**
     * Show error state
     */
    error(message) {
        this.bar.classList.add('error');
        this.bar.style.width = '100%';
        this.text.textContent = '✗ Error';
        
        setTimeout(() => this.hide(), 3000);
    },

    /**
     * Hide progress bar
     */
    hide() {
        if (this.container) {
            this.container.classList.remove('visible');
        }
        this.isVisible = false;
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WebSocketClient, ProgressBar };
} else {
    window.WebSocketClient = WebSocketClient;
    window.ProgressBar = ProgressBar;
}
