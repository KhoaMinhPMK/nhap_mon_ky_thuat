/**
 * Blockly Configuration Module
 * Contains block definitions and code generators
 */

const BlocklyConfig = {
    /**
     * Define all custom Blockly blocks
     */
    defineBlocks() {
        // 0. When Run Block
        Blockly.Blocks['when_run'] = {
            init: function () {
                this.appendDummyInput().appendField("When Run Clicked");
                this.setNextStatement(true, null);
                this.setColour(60);
                this.setTooltip("Start of the program");
                this.setDeletable(false);
            }
        };

        // 1. Move Block
        Blockly.Blocks['move_motor'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("Move")
                    .appendField(new Blockly.FieldDropdown([["X", "X"], ["Y", "Y"], ["Z", "Z"]]), "AXIS")
                    .appendField(new Blockly.FieldDropdown([["+", "1"], ["-", "-1"]]), "DIR")
                    .appendField("Time(ms)")
                    .appendField(new Blockly.FieldNumber(1000, 0), "DURATION")
                    .appendField("Speed")
                    .appendField(new Blockly.FieldNumber(50, 0), "SPEED");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(230);
                this.setTooltip("Move a motor");
            }
        };

        // 2. Relay Block
        Blockly.Blocks['relay_control'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("Relay")
                    .appendField(new Blockly.FieldDropdown([["ON", "1"], ["OFF", "0"]]), "STATE");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(60);
                this.setTooltip("Control Relay");
            }
        };

        // 2b. Relay Pulse Block
        Blockly.Blocks['relay_pulse'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("Relay")
                    .appendField(new Blockly.FieldDropdown([["ON", "1"], ["OFF", "0"]]), "STATE")
                    .appendField("for")
                    .appendField(new Blockly.FieldNumber(1, 0), "SECONDS")
                    .appendField("seconds");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(60);
                this.setTooltip("Turn relay ON/OFF for a duration, then revert");
            }
        };

        // 3. Wait Block
        Blockly.Blocks['wait_seconds'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("Wait")
                    .appendField(new Blockly.FieldNumber(1, 0), "SECONDS")
                    .appendField("seconds");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(120);
                this.setTooltip("Pause execution");
            }
        };

        // 4. Home Z Block
        Blockly.Blocks['home_z'] = {
            init: function () {
                this.appendDummyInput().appendField("Home Z Axis");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(290);
                this.setTooltip("Return Z to Home");
            }
        };

        // 4b. Home X Block
        Blockly.Blocks['home_x'] = {
            init: function () {
                this.appendDummyInput().appendField("Home X Axis");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(290);
                this.setTooltip("Return X to Home using limit switch");
            }
        };

        // 5. Check Label Block
        Blockly.Blocks['check_label_is'] = {
            init: function () {
                var options = [
                    ["Premium Watermelon", "Premium-grade watermelon"],
                    ["Second-grade Watermelon", "Second-grade watermelon"],
                    ["Defective Watermelon", "Defective watermelon"],
                    ["Nothing", "Nothing"]
                ];
                this.appendDummyInput()
                    .appendField("Check if Label is")
                    .appendField(new Blockly.FieldDropdown(options), "LABEL");
                this.setOutput(true, "Boolean");
                this.setColour(260);
                this.setTooltip("Returns true if the camera sees the specified label");
            }
        };
    },

    /**
     * Register all code generators
     * @param {Object} generator - Blockly generator instance
     */
    registerGenerators(generator) {
        if (!generator) return;

        // Helper to support both new (forBlock) and old APIs
        const register = (type, func) => {
            if (generator.forBlock) {
                generator.forBlock[type] = func;
            } else {
                generator[type] = func;
            }
        };

        register('when_run', function (block) {
            return '';
        });

        register('move_motor', function (block) {
            var axis = block.getFieldValue('AXIS');
            var dir = block.getFieldValue('DIR');
            var duration = block.getFieldValue('DURATION');
            var speed = block.getFieldValue('SPEED');

            var x = (axis == 'X') ? dir : 0;
            var y = (axis == 'Y') ? dir : 0;
            var z = (axis == 'Z') ? dir : 0;

            return `{"type": "M", "x": ${x}, "y": ${y}, "z": ${z}, "time": ${duration}, "speed": ${speed}},\n`;
        });

        register('relay_control', function (block) {
            var state = block.getFieldValue('STATE');
            return `{"type": "R", "state": ${state}},\n`;
        });

        register('relay_pulse', function (block) {
            var state = block.getFieldValue('STATE');
            var seconds = block.getFieldValue('SECONDS');
            var opposite = (state == "1") ? "0" : "1";

            return `{"type": "R", "state": ${state}},\n` +
                `{"type": "W", "time": ${seconds}},\n` +
                `{"type": "R", "state": ${opposite}},\n`;
        });

        register('wait_seconds', function (block) {
            var seconds = block.getFieldValue('SECONDS');
            return `{"type": "W", "time": ${seconds}},\n`;
        });

        register('home_z', function (block) {
            return `{"type": "H"},\n`;
        });

        register('home_x', function (block) {
            return `{"type": "HX"},\n`;
        });

        register('check_label_is', function (block) {
            var label = block.getFieldValue('LABEL');
            return [`{"type": "CHECK_LABEL", "label": "${label}"}`, generator.ORDER_NONE];
        });

        // Custom generators for Blockly standard blocks
        register('controls_repeat_ext', function (block) {
            var times = generator.valueToCode(block, 'TIMES', generator.ORDER_NONE) || '1';
            var branch = generator.statementToCode(block, 'DO');

            branch = branch.trim();
            if (branch.endsWith(',')) branch = branch.slice(0, -1);

            return `{"type": "REPEAT", "times": ${times}, "do": [${branch}]},\n`;
        });

        register('controls_if', function (block) {
            var condition = generator.valueToCode(block, 'IF0', generator.ORDER_NONE);
            var branch = generator.statementToCode(block, 'DO0');

            branch = branch.trim();
            if (branch.endsWith(',')) branch = branch.slice(0, -1);

            var result = `{"type": "IF", "condition": ${condition}, "then": [${branch}]`;

            var elseInput = block.getInput('ELSE');
            if (elseInput) {
                var elseBranch = generator.statementToCode(block, 'ELSE');
                if (elseBranch) {
                    elseBranch = elseBranch.trim();
                    if (elseBranch.endsWith(',')) elseBranch = elseBranch.slice(0, -1);
                    result += `, "else": [${elseBranch}]`;
                }
            }

            result += `},\n`;
            return result;
        });

        register('math_number', function (block) {
            var code = parseFloat(block.getFieldValue('NUM'));
            return [code, generator.ORDER_ATOMIC];
        });
    },

    /**
     * Initialize block definitions and generators
     */
    init() {
        this.defineBlocks();

        // Register on all potential generator instances
        if (typeof Blockly !== 'undefined' && Blockly.JavaScript) {
            this.registerGenerators(Blockly.JavaScript);
        }

        if (typeof javascript !== 'undefined' && javascript.javascriptGenerator) {
            this.registerGenerators(javascript.javascriptGenerator);
        }

        Logger.log('🧱 Blockly blocks configured');
    }
};

// Export for module use or attach to window for global use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlocklyConfig;
} else {
    window.BlocklyConfig = BlocklyConfig;
}
