/**
 * Blockly Workspace Module
 * Handles workspace initialization, save/load functionality
 */

const BlocklyWorkspace = {
    // Reference to the Blockly workspace
    workspace: null,

    /**
     * Initialize Blockly workspace
     */
    init() {
        this.workspace = Blockly.inject('blocklyDiv', {
            toolbox: document.getElementById('toolbox'),
            scrollbars: true,
            trashcan: true,
            grid: {
                spacing: 20,
                length: 3,
                colour: '#333',
                snap: true
            },
            zoom: {
                controls: true,
                wheel: true,
                startScale: 1.0,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2
            },
            theme: Blockly.Themes.Dark
        });

        // Add default start block if workspace is empty
        if (this.workspace.getAllBlocks().length === 0) {
            this.addStartBlock();
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            Blockly.svgResize(this.workspace);
        });

        Logger.log('🎨 Blockly workspace initialized');
        return this.workspace;
    },

    /**
     * Add the default start block
     */
    addStartBlock() {
        var startBlock = this.workspace.newBlock('when_run');
        startBlock.initSvg();
        startBlock.render();
        startBlock.moveBy(50, 50);
    },

    /**
     * Clear workspace and add start block
     */
    clear() {
        this.workspace.clear();
        this.addStartBlock();
        Logger.log('🧹 Workspace cleared');
    },

    /**
     * Run the code from workspace
     */
    async run() {
        // Use the correct generator for execution
        var generator = (typeof javascript !== 'undefined' && javascript.javascriptGenerator) ?
            javascript.javascriptGenerator : Blockly.JavaScript;

        generator.init(this.workspace);
        var code = generator.workspaceToCode(this.workspace);

        // Clean up the code to make it valid JSON
        code = code.trim();
        if (code.endsWith(',')) code = code.slice(0, -1);
        code = `[${code}]`;

        Logger.log("Generating Script...");
        console.log("Generated JSON:", code);

        try {
            var commands = JSON.parse(code);
            console.log("Commands:", commands);

            Logger.log(`Generated ${commands.length} steps.`);

            if (commands.length === 0) {
                Logger.warn("Empty script.");
                return;
            }

            const data = await API.executeScript(commands);
            Logger.log(`Result: ${data.status}`);
        } catch (e) {
            Logger.error(e);
            console.error(e);
        }
    },

    /**
     * Save workspace to JSON file
     */
    save() {
        const state = Blockly.serialization.workspaces.save(this.workspace);
        const json = JSON.stringify(state, null, 2);

        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = "scenario.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        Logger.success("Scenario Saved.");
    },

    /**
     * Load workspace from file input
     * @param {HTMLInputElement} input - File input element
     */
    load(input) {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);
                Blockly.serialization.workspaces.load(json, this.workspace);
                Logger.success("Scenario Loaded.");
            } catch (err) {
                Logger.error("Error Loading File: " + err);
            }
        };

        reader.readAsText(file);
        input.value = ""; // Reset input
    },

    /**
     * Get current workspace reference
     * @returns {Object} Blockly workspace
     */
    getWorkspace() {
        return this.workspace;
    }
};

// Export for module use or attach to window for global use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlocklyWorkspace;
} else {
    window.BlocklyWorkspace = BlocklyWorkspace;
}
