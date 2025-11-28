import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

# Ensure pictures directory exists
if not os.path.exists('pictures'):
    os.makedirs('pictures')

def create_block_diagram(filename, title, blocks, connections, figsize=(10, 6)):
    fig, ax = plt.subplots(figsize=figsize)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    ax.set_title(title, fontsize=14, pad=20)

    # Draw blocks
    drawn_blocks = {}
    for name, (x, y, w, h, label, color) in blocks.items():
        rect = patches.Rectangle((x, y), w, h, linewidth=2, edgecolor='black', facecolor=color)
        ax.add_patch(rect)
        ax.text(x + w/2, y + h/2, label, ha='center', va='center', fontsize=10, wrap=True)
        drawn_blocks[name] = (x, y, w, h)

    # Draw connections
    for start, end, label in connections:
        sx, sy, sw, sh = drawn_blocks[start]
        ex, ey, ew, eh = drawn_blocks[end]
        
        # Simple routing: center to center
        start_point = (sx + sw/2, sy + sh/2)
        end_point = (ex + ew/2, ey + eh/2)
        
        # Adjust start/end to edges based on relative position
        if sx + sw < ex: # Start is left of End
            start_point = (sx + sw, sy + sh/2)
            end_point = (ex, ey + eh/2)
        elif ex + ew < sx: # End is left of Start
            start_point = (sx, sy + sh/2)
            end_point = (ex + ew, ey + eh/2)
        elif sy + sh < ey: # Start is below End
            start_point = (sx + sw/2, sy + sh)
            end_point = (ex + ew/2, ey)
        elif ey + eh < sy: # End is below Start
            start_point = (sx + sw/2, sy)
            end_point = (ex + ew/2, ey + eh)

        ax.annotate("", xy=end_point, xytext=start_point,
                    arrowprops=dict(arrowstyle="->", lw=1.5))
        
        if label:
            mid_x = (start_point[0] + end_point[0]) / 2
            mid_y = (start_point[1] + end_point[1]) / 2
            ax.text(mid_x, mid_y + 2, label, ha='center', fontsize=8, color='blue')

    plt.tight_layout()
    plt.savefig(f'pictures/{filename}', dpi=300, bbox_inches='tight')
    plt.close()
    print(f"Generated pictures/{filename}")

# 1. CNC Shield Pinout
def draw_cnc_shield():
    blocks = {
        'shield': (20, 20, 60, 60, 'CNC Shield V3\n(Arduino Uno Compatible)', '#e0e0e0'),
        'x_driver': (25, 60, 10, 15, 'X-Axis\nDriver', '#ffcccc'),
        'y_driver': (37, 60, 10, 15, 'Y-Axis\nDriver', '#ffcccc'),
        'z_driver': (49, 60, 10, 15, 'Z-Axis\nDriver', '#ffcccc'),
        'a_driver': (61, 60, 10, 15, 'A-Axis\nDriver', '#ffcccc'),
        'power': (22, 22, 15, 10, 'Power In\n12-36V', '#ffffcc'),
        'limits': (70, 30, 8, 40, 'Limit\nSwitch\nPins\n(X+,Y+,Z+)', '#ccffcc'),
        'control': (22, 40, 20, 10, 'Step/Dir\nControl Pins', '#ccccff')
    }
    connections = [] # Internal diagram, no arrows needed
    create_block_diagram('cnc_shield_pinout.png', 'Sơ đồ chân CNC Shield V3', blocks, connections)

# 2. Limit Switch Wiring
def draw_limit_switch():
    blocks = {
        'arduino': (60, 30, 30, 40, 'Arduino / CNC Shield\n(GND, D9-D12)', '#ccccff'),
        'switch': (10, 40, 20, 20, 'Limit Switch\n(C, NO, NC)', '#ffcccc')
    }
    connections = [
        ('switch', 'arduino', 'NO -> Signal Pin (D9/10/11)'),
        ('switch', 'arduino', 'C -> GND')
    ]
    create_block_diagram('limit_switch_wiring.png', 'Sơ đồ đấu nối công tắc hành trình', blocks, connections)

# 3. Vacuum System
def draw_vacuum_system():
    blocks = {
        'arduino': (10, 40, 20, 20, 'Arduino\n(D11)', '#ccccff'),
        'relay': (40, 40, 20, 20, 'Relay Module\n(5V Control)', '#ffcc99'),
        'power': (40, 70, 20, 15, '12V Power', '#ffffcc'),
        'pump': (70, 40, 20, 20, 'Vacuum Pump\n(Motor)', '#ccffcc')
    }
    connections = [
        ('arduino', 'relay', 'Signal (LOW/HIGH)'),
        ('power', 'relay', '12V+'),
        ('relay', 'pump', 'Switched 12V')
    ]
    create_block_diagram('vacuum_system.png', 'Sơ đồ hệ thống hút chân không', blocks, connections)

# 4. CNN Architecture
def draw_cnn_arch():
    blocks = {
        'input': (5, 40, 10, 20, 'Input Image\n224x224x3', '#e0e0e0'),
        'conv1': (20, 35, 10, 30, 'Conv2D\n32 filters', '#ffcccc'),
        'pool1': (35, 40, 8, 20, 'MaxPool\n2x2', '#ccffcc'),
        'conv2': (48, 30, 10, 40, 'Conv2D\n64 filters', '#ffcccc'),
        'pool2': (63, 40, 8, 20, 'MaxPool\n2x2', '#ccffcc'),
        'flatten': (76, 45, 5, 10, 'Flatten', '#ffffcc'),
        'dense': (85, 35, 8, 30, 'Dense\n128 + Dropout', '#ccccff'),
        'output': (95, 42, 5, 15, 'Output\n3 Class', '#ff9999')
    }
    connections = [
        ('input', 'conv1', ''), ('conv1', 'pool1', ''), ('pool1', 'conv2', ''),
        ('conv2', 'pool2', ''), ('pool2', 'flatten', ''), ('flatten', 'dense', ''),
        ('dense', 'output', '')
    ]
    create_block_diagram('cnn_architecture.png', 'Kiến trúc mạng CNN', blocks, connections)

# 5. System Architecture (3-Tier)
def draw_system_arch():
    blocks = {
        'frontend': (10, 60, 25, 30, 'Frontend Layer\n(Mobile App, Web, Chatbot)', '#ccffcc'),
        'backend': (40, 30, 20, 40, 'Backend Layer\n(Flask Server, AI Model)', '#ccccff'),
        'hardware': (70, 10, 25, 30, 'Hardware Layer\n(Arduino, Robot, Sensors)', '#ffcccc')
    }
    connections = [
        ('frontend', 'backend', 'HTTP/WebSocket'),
        ('backend', 'frontend', 'JSON Data'),
        ('backend', 'hardware', 'Serial (UART)'),
        ('hardware', 'backend', 'Sensor Data')
    ]
    create_block_diagram('system_architecture.png', 'Kiến trúc hệ thống 3 tầng', blocks, connections)

# 6. Electrical Overview
def draw_electrical():
    blocks = {
        'psu': (40, 80, 20, 15, 'Power Supply\n12V 5A', '#ffffcc'),
        'cnc': (40, 50, 20, 20, 'CNC Shield V3\n+ Drivers', '#e0e0e0'),
        'arduino': (10, 50, 20, 20, 'Arduino Uno\n(USB Power)', '#ccccff'),
        'motors': (70, 60, 20, 20, 'Stepper Motors\n(X, Y, Z)', '#ffcccc'),
        'relay': (70, 30, 20, 15, 'Relay & Pump', '#ccffcc'),
        'sensors': (10, 20, 20, 15, 'Sensors\n(IR, Limit)', '#ffcc99')
    }
    connections = [
        ('psu', 'cnc', '12V Main Power'),
        ('arduino', 'cnc', 'Shield Mount'),
        ('cnc', 'motors', 'Motor Wires'),
        ('cnc', 'relay', 'Control Signal'),
        ('sensors', 'cnc', 'Signal Pins')
    ]
    create_block_diagram('electrical_overview.png', 'Sơ đồ tổng quan hệ thống điện', blocks, connections)

# 7. IR Sensor Wiring
def draw_ir_wiring():
    blocks = {
        'power_mod': (10, 60, 25, 20, 'DC Converter\n3.3V Output', '#ffffcc'),
        'sensor': (40, 40, 20, 20, 'IR Sensor', '#ffcc99'),
        'cnc': (70, 40, 20, 20, 'CNC Shield\n(Endstop Pins)', '#e0e0e0')
    }
    connections = [
        ('power_mod', 'sensor', 'VCC (3.3V)'),
        ('sensor', 'cnc', 'OUT -> Signal Pin'),
        ('sensor', 'power_mod', 'GND')
    ]
    create_block_diagram('ir_sensor_wiring.png', 'Sơ đồ kết nối cảm biến IR (3.3V)', blocks, connections)

# 8. Air Pump Circuit
def draw_pump_circuit():
    blocks = {
        '12v': (10, 70, 15, 15, '12V Source', '#ffffcc'),
        'relay': (30, 40, 20, 20, 'Relay Module', '#ffcc99'),
        'buck': (60, 40, 20, 20, 'Buck Converter\n12V -> 5V', '#ccffcc'),
        'pump': (85, 40, 15, 20, 'Air Pump\n(5V)', '#ffcccc'),
        'arduino': (30, 10, 20, 15, 'Arduino Signal', '#ccccff')
    }
    connections = [
        ('12v', 'relay', '12V+'),
        ('relay', 'buck', 'Switched 12V'),
        ('buck', 'pump', '5V Output'),
        ('arduino', 'relay', 'Control')
    ]
    create_block_diagram('air_pump_circuit.png', 'Sơ đồ mạch điều khiển Air Pump', blocks, connections)

# 9. Project Structure
def draw_project_structure():
    fig, ax = plt.subplots(figsize=(8, 10))
    ax.axis('off')
    ax.set_title('Cấu trúc thư mục dự án', fontsize=14)
    
    text = """
    PROJECT ROOT
    ├── arduino_main/
    │   └── main.ino (Firmware)
    ├── main/ (Backend)
    │   ├── app.py
    │   ├── controllers/
    │   │   ├── ml_controller.py
    │   │   └── serial_controller.py
    │   ├── static/ (Frontend Assets)
    │   │   ├── js/ (Blockly)
    │   │   └── css/
    │   └── templates/
    │       └── index.html
    ├── mobile_app/
    │   ├── App.js
    │   └── src/
    └── model.savedmodel/ (AI Model)
    """
    ax.text(0.1, 0.9, text, family='monospace', fontsize=12, va='top')
    plt.tight_layout()
    plt.savefig('pictures/project_structure.png', dpi=300)
    plt.close()
    print("Generated pictures/project_structure.png")

# 10. Smart Agri Ecosystem
def draw_ecosystem():
    blocks = {
        'cloud': (40, 40, 20, 20, 'Cloud / AI Center\n(Data Analysis)', '#ccffcc'),
        'robot1': (10, 70, 20, 15, 'Robot Phân Loại', '#ffcccc'),
        'robot2': (70, 70, 20, 15, 'Robot Thu Hoạch', '#ffcccc'),
        'app': (10, 10, 20, 15, 'Mobile App\n(Nông dân)', '#ccccff'),
        'market': (70, 10, 20, 15, 'Marketplace\n(Thương lái)', '#ffffcc')
    }
    connections = [
        ('robot1', 'cloud', 'Data'),
        ('robot2', 'cloud', 'Data'),
        ('cloud', 'app', 'Insights'),
        ('cloud', 'market', 'Supply Info')
    ]
    create_block_diagram('smart_agri_ecosystem.png', 'Hệ sinh thái nông nghiệp thông minh', blocks, connections)

if __name__ == "__main__":
    draw_cnc_shield()
    draw_limit_switch()
    draw_vacuum_system()
    draw_cnn_arch()
    draw_system_arch()
    draw_electrical()
    draw_ir_wiring()
    draw_pump_circuit()
    draw_project_structure()
    draw_ecosystem()
