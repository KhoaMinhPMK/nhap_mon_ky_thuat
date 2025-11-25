"""
API Routes
Handles all API endpoints
"""

from flask import Blueprint, request, jsonify

api_bp = Blueprint('api', __name__, url_prefix='/api')

# Controllers (will be set by app factory)
arduino = None
bins = None
executor = None
history = None


def init_api_routes(serial_controller, bin_controller, script_executor, history_controller=None):
    """Initialize routes with controllers"""
    global arduino, bins, executor, history
    arduino = serial_controller
    bins = bin_controller
    executor = script_executor
    history = history_controller


@api_bp.route('/control', methods=['POST'])
def manual_control():
    """Send manual control command to Arduino"""
    data = request.json
    cmd = data.get('command')
    
    if not cmd:
        return jsonify({"status": "Error: No command"}), 400
    
    resp = arduino.send_command(cmd)
    return jsonify({"status": "Sent", "arduino_response": resp})


@api_bp.route('/sensors', methods=['GET'])
def get_sensors():
    """Get current sensor readings"""
    resp = arduino.send_command("C")
    
    s1 = 1
    s2 = 1
    
    if resp and "S1:" in resp:
        try:
            parts = resp.split('|')
            for part in parts:
                if "S1:" in part:
                    s1 = int(part.split(':')[1])
                elif "S2:" in part:
                    s2 = int(part.split(':')[1])
        except Exception as e:
            print(f"Error parsing sensor data: {e}")
    
    return jsonify({"s1": s1, "s2": s2})


@api_bp.route('/bin_status', methods=['GET'])
def get_bin_status():
    """Get current bin status (full/not full)"""
    return jsonify(bins.get_status())


@api_bp.route('/reset_bins', methods=['POST'])
def reset_bins():
    """Reset bin flags after user cleans"""
    bins.reset()
    return jsonify({"status": "reset"})


@api_bp.route('/execute_script', methods=['POST'])
def execute_script():
    """Execute a Blockly-generated script"""
    if executor.is_running:
        return jsonify({
            "status": "Busy", 
            "message": "A scenario is already running"
        }), 400
    
    data = request.json
    script = data.get('script', [])
    
    if not isinstance(script, list):
        return jsonify({
            "status": "Error", 
            "message": "Invalid script format"
        }), 400
    
    if executor.execute(script):
        return jsonify({"status": "Started", "steps": len(script)})
    else:
        return jsonify({"status": "Error", "message": "Failed to start"}), 500


@api_bp.route('/stop_script', methods=['POST'])
def stop_script():
    """Stop currently running script"""
    executor.stop()
    return jsonify({"status": "Stopping"})


@api_bp.route('/status', methods=['GET'])
def get_status():
    """Get overall system status"""
    return jsonify({
        "serial_connected": arduino.is_connected(),
        "script_running": executor.is_running,
        "bins": bins.get_status()
    })


@api_bp.route('/history', methods=['GET'])
def get_history():
    """Get operation history"""
    if history:
        limit = request.args.get('limit', 50, type=int)
        return jsonify(history.get_history(limit))
    return jsonify([])


@api_bp.route('/history/stats', methods=['GET'])
def get_history_stats():
    """Get history statistics"""
    if history:
        return jsonify(history.get_stats())
    return jsonify({})


@api_bp.route('/history/log', methods=['POST'])
def log_operation():
    """Log an operation"""
    if history:
        data = request.json
        history.log(
            action=data.get('action', 'unknown'),
            details=data.get('details', {}),
            status=data.get('status', 'success')
        )
        return jsonify({"status": "logged"})
    return jsonify({"status": "no history controller"}), 500


# ============== EMAIL NOTIFICATIONS ==============

from controllers.email_controller import email_controller

@api_bp.route('/email/config', methods=['GET'])
def get_email_config():
    """Get email configuration (without password)"""
    return jsonify(email_controller.get_config())


@api_bp.route('/email/config', methods=['POST'])
def update_email_config():
    """Update email configuration"""
    data = request.json
    success = email_controller.update_config(data)
    return jsonify({"success": success})


@api_bp.route('/email/recipients', methods=['POST'])
def add_email_recipient():
    """Add a recipient email"""
    data = request.json
    email = data.get('email', '').strip()
    
    if not email or '@' not in email:
        return jsonify({"success": False, "message": "Email không hợp lệ"}), 400
    
    success = email_controller.add_recipient(email)
    return jsonify({
        "success": success,
        "recipients": email_controller.config['recipient_emails']
    })


@api_bp.route('/email/recipients', methods=['DELETE'])
def remove_email_recipient():
    """Remove a recipient email"""
    data = request.json
    email = data.get('email', '')
    
    success = email_controller.remove_recipient(email)
    return jsonify({
        "success": success,
        "recipients": email_controller.config['recipient_emails']
    })


@api_bp.route('/email/test', methods=['POST'])
def test_email():
    """Test email connection and send test email"""
    # First test connection
    conn_result = email_controller.test_connection()
    if not conn_result['success']:
        return jsonify(conn_result)
    
    # Then send test email
    data = request.json or {}
    recipient = data.get('recipient')
    send_result = email_controller.send_test_email(recipient)
    
    return jsonify(send_result)
