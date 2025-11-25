/**
 * Main Application Entry Point
 * Initializes all modules and binds global functions
 * Now with WebSocket support!
 */

// ================= APP INITIALIZATION =================
const App = {
    // Use WebSocket if available
    useWebSocket: true,
    
    /**
     * Initialize the application
     */
    init() {
        console.log('🚀 Initializing Application...');

        // Initialize modules in order
        BlocklyConfig.init();
        BlocklyWorkspace.init();
        Notifications.init();
        
        // Try WebSocket first, fallback to polling
        if (this.useWebSocket && typeof WebSocketClient !== 'undefined') {
            this._initWebSocket();
        } else {
            // Fallback to polling
            Sensors.init();
        }

        // Bind global functions for HTML onclick handlers
        this.bindGlobalFunctions();

        Logger.success('Application initialized successfully!');
    },

    /**
     * Initialize WebSocket connection
     */
    _initWebSocket() {
        WebSocketClient.init();
        
        // Set up callbacks
        WebSocketClient.on('connect', () => {
            Logger.success('Realtime connection established');
        });
        
        WebSocketClient.on('disconnect', () => {
            Logger.warn('Realtime connection lost, falling back to polling');
            Sensors.init();
        });
        
        // Start periodic status check (less frequent than polling)
        setInterval(() => {
            if (WebSocketClient.isConnected) {
                WebSocketClient.getStatus();
            }
        }, 5000);
    },

    /**
     * Bind functions to window for HTML onclick compatibility
     */
    bindGlobalFunctions() {
        // Legacy function aliases for HTML onclick handlers
        window.log = Logger.log.bind(Logger);
        
        // Command sending - use WebSocket if available
        window.sendCommand = (cmd) => {
            if (this.useWebSocket && WebSocketClient.isConnected) {
                WebSocketClient.sendCommand(cmd);
            } else {
                API.sendCommand(cmd);
            }
        };
        
        // Script execution - use WebSocket for better feedback
        window.runBlocklyCode = () => {
            if (this.useWebSocket && WebSocketClient.isConnected) {
                this._runBlocklyCodeWS();
            } else {
                BlocklyWorkspace.run();
            }
        };
        
        window.clearWorkspace = () => BlocklyWorkspace.clear();
        window.saveScenario = () => BlocklyWorkspace.save();
        window.loadScenario = (input) => BlocklyWorkspace.load(input);
        
        // Notification functions - use WebSocket if available
        window.dismissAlert = () => Notifications.hideAlert();
        window.resetBinFlags = () => {
            if (this.useWebSocket && WebSocketClient.isConnected) {
                WebSocketClient.resetBins();
            } else {
                Notifications.resetBins();
            }
        };
        
        // Stop script
        window.stopScript = () => {
            if (WebSocketClient.isConnected) {
                WebSocketClient.stopScript();
            }
        };

        // Expose workspace for external access if needed
        window.workspace = BlocklyWorkspace.getWorkspace();
    },
    
    /**
     * Run Blockly code via WebSocket (better feedback)
     */
    _runBlocklyCodeWS() {
        const workspace = BlocklyWorkspace.getWorkspace();
        
        // Use the correct generator
        var generator = (typeof javascript !== 'undefined' && javascript.javascriptGenerator) ?
            javascript.javascriptGenerator : Blockly.JavaScript;

        generator.init(workspace);
        var code = generator.workspaceToCode(workspace);

        // Clean up to valid JSON
        code = code.trim();
        if (code.endsWith(',')) code = code.slice(0, -1);
        code = `[${code}]`;

        try {
            var commands = JSON.parse(code);
            
            if (commands.length === 0) {
                Logger.warn("Empty script.");
                return;
            }

            Logger.log(`Generated ${commands.length} steps, sending via WebSocket...`);
            WebSocketClient.executeScript(commands);
            
        } catch (e) {
            Logger.error(`Parse error: ${e}`);
            console.error(e);
        }
    }
};

// ================= DOM READY =================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    // DOM already loaded
    App.init();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
} else {
    window.App = App;
}
