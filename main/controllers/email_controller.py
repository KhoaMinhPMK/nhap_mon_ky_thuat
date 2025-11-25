"""
Email Controller Module
Handles email notifications for bin full alerts
"""

import smtplib
import json
import os
import threading
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime


class EmailController:
    """Email notification controller using SMTP"""
    
    CONFIG_FILE = "email_config.json"
    
    def __init__(self):
        self.config = self._load_config()
        self._last_sent = {}  # Track last sent time per bin
        self.cooldown_minutes = 30  # Don't spam - wait 30 min between emails
    
    def _load_config(self):
        """Load email configuration from file"""
        default_config = {
            "enabled": False,
            "smtp_server": "smtp.gmail.com",
            "smtp_port": 587,
            "sender_email": "cncsmartarm@gmail.com",
            "sender_password": "tklk mmkk gqol wfvc",  # App Password
            "recipient_emails": [],  # Users will add their own emails
            "notify_bin1_full": True,
            "notify_bin2_full": True
        }
        
        try:
            if os.path.exists(self.CONFIG_FILE):
                with open(self.CONFIG_FILE, 'r', encoding='utf-8') as f:
                    saved = json.load(f)
                    # Merge with defaults
                    default_config.update(saved)
        except Exception as e:
            print(f"⚠ Error loading email config: {e}")
        
        return default_config
    
    def _save_config(self):
        """Save configuration to file"""
        try:
            with open(self.CONFIG_FILE, 'w', encoding='utf-8') as f:
                json.dump(self.config, f, indent=2, ensure_ascii=False)
            return True
        except Exception as e:
            print(f"✗ Error saving email config: {e}")
            return False
    
    def update_config(self, new_config):
        """Update email configuration"""
        # Update only provided fields
        for key in ['enabled', 'sender_email', 'sender_password', 
                    'recipient_emails', 'notify_bin1_full', 'notify_bin2_full',
                    'smtp_server', 'smtp_port']:
            if key in new_config:
                self.config[key] = new_config[key]
        
        return self._save_config()
    
    def get_config(self):
        """Get current configuration (without password)"""
        safe_config = self.config.copy()
        # Don't expose password to frontend
        if safe_config.get('sender_password'):
            safe_config['sender_password'] = '••••••••'
        return safe_config
    
    def add_recipient(self, email):
        """Add a recipient email"""
        if email and email not in self.config['recipient_emails']:
            self.config['recipient_emails'].append(email)
            self._save_config()
            return True
        return False
    
    def remove_recipient(self, email):
        """Remove a recipient email"""
        if email in self.config['recipient_emails']:
            self.config['recipient_emails'].remove(email)
            self._save_config()
            return True
        return False
    
    def test_connection(self):
        """Test SMTP connection"""
        try:
            server = smtplib.SMTP(self.config['smtp_server'], self.config['smtp_port'], local_hostname='localhost')
            server.starttls()
            server.login(self.config['sender_email'], self.config['sender_password'])
            server.quit()
            return {"success": True, "message": "Kết nối SMTP thành công!"}
        except smtplib.SMTPAuthenticationError:
            return {"success": False, "message": "Lỗi xác thực! Kiểm tra email và App Password."}
        except Exception as e:
            return {"success": False, "message": f"Lỗi kết nối: {str(e)}"}
    
    def send_test_email(self, recipient=None):
        """Send a test email"""
        if not recipient and self.config['recipient_emails']:
            recipient = self.config['recipient_emails'][0]
        
        if not recipient:
            return {"success": False, "message": "Chưa có email nhận!"}
        
        return self._send_email(
            to_email=recipient,
            subject="[TEST] CNC Control Center - Thông báo thử nghiệm",
            body="""
            <h2>🔔 Email thử nghiệm</h2>
            <p>Nếu bạn nhận được email này, hệ thống thông báo đã hoạt động tốt!</p>
            <p><strong>Thời gian:</strong> {}</p>
            <hr>
            <p style="color: gray; font-size: 12px;">
                Email được gửi tự động từ Arduino CNC Control Center
            </p>
            """.format(datetime.now().strftime("%d/%m/%Y %H:%M:%S"))
        )
    
    def notify_bin_full(self, bin_number, fill_percentage):
        """
        Send notification when bin is full
        
        Args:
            bin_number: 1 or 2
            fill_percentage: Current fill percentage
        """
        if not self.config['enabled']:
            print("📧 Email notifications disabled")
            return
        
        # Check if we should notify for this bin
        if bin_number == 1 and not self.config['notify_bin1_full']:
            return
        if bin_number == 2 and not self.config['notify_bin2_full']:
            return
        
        # Check cooldown
        cooldown_key = f"bin_{bin_number}"
        now = datetime.now()
        
        if cooldown_key in self._last_sent:
            elapsed = (now - self._last_sent[cooldown_key]).total_seconds() / 60
            if elapsed < self.cooldown_minutes:
                print(f"📧 Skipping email (cooldown: {self.cooldown_minutes - elapsed:.1f} min remaining)")
                return
        
        # Send to all recipients
        bin_name = "Thùng Loại 1 (Premium)" if bin_number == 1 else "Thùng Loại 2 (Second)"
        
        subject = f"⚠️ CẢNH BÁO: {bin_name} đã đầy!"
        body = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #ff4444; color: white; padding: 20px; text-align: center;">
                <h1 style="margin: 0;">⚠️ CẢNH BÁO</h1>
            </div>
            
            <div style="padding: 20px; background: #f9f9f9;">
                <h2 style="color: #333;">{bin_name} đã đầy!</h2>
                
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <p><strong>📊 Mức độ đầy:</strong> {fill_percentage:.1f}%</p>
                    <p><strong>⏰ Thời gian:</strong> {now.strftime("%d/%m/%Y %H:%M:%S")}</p>
                </div>
                
                <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
                    <strong>⚡ Hành động cần thực hiện:</strong>
                    <p>Vui lòng thu gom sản phẩm từ thùng và reset hệ thống.</p>
                </div>
            </div>
            
            <div style="padding: 15px; text-align: center; color: #666; font-size: 12px;">
                <p>Email được gửi tự động từ Arduino CNC Control Center</p>
                <p>Để tắt thông báo, vào Cài đặt → Email</p>
            </div>
        </div>
        """
        
        # Send in background thread
        def send_async():
            success_count = 0
            for recipient in self.config['recipient_emails']:
                result = self._send_email(recipient, subject, body)
                if result['success']:
                    success_count += 1
            
            if success_count > 0:
                self._last_sent[cooldown_key] = now
                print(f"📧 Sent bin full alert to {success_count} recipient(s)")
        
        threading.Thread(target=send_async, daemon=True).start()
    
    def _send_email(self, to_email, subject, body):
        """Send an email"""
        if not self.config['sender_email'] or not self.config['sender_password']:
            return {"success": False, "message": "Chưa cấu hình email gửi!"}
        
        try:
            msg = MIMEMultipart('alternative')
            msg['From'] = f"CNC Smart Arm <{self.config['sender_email']}>"
            msg['To'] = to_email
            msg['Subject'] = subject
            msg['Reply-To'] = self.config['sender_email']
            msg['X-Priority'] = '1'  # High priority
            msg['X-Mailer'] = 'CNC-Control-Center/2.0'
            
            # Plain text version (important for spam filters)
            text_content = body.replace('<br>', '\n').replace('</p>', '\n')
            import re
            text_content = re.sub('<[^<]+?>', '', text_content)  # Remove HTML tags
            text_part = MIMEText(text_content, 'plain', 'utf-8')
            msg.attach(text_part)
            
            # HTML version
            html_part = MIMEText(body, 'html', 'utf-8')
            msg.attach(html_part)
            
            # Connect and send
            server = smtplib.SMTP(self.config['smtp_server'], self.config['smtp_port'], local_hostname='localhost')
            server.starttls()
            server.login(self.config['sender_email'], self.config['sender_password'])
            server.sendmail(self.config['sender_email'], to_email, msg.as_string())
            server.quit()
            
            print(f"✓ Email sent to {to_email}")
            return {"success": True, "message": f"Đã gửi email đến {to_email}"}
            
        except smtplib.SMTPAuthenticationError:
            return {"success": False, "message": "Lỗi xác thực SMTP!"}
        except Exception as e:
            print(f"✗ Email error: {e}")
            return {"success": False, "message": str(e)}


# Singleton instance
email_controller = EmailController()
