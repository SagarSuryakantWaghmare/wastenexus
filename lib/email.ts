/**
 * Email service utilities
 * Handles sending emails for various platform notifications
 */

import nodemailer from 'nodemailer';
import { logger } from './logger';

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends an email using the configured transporter
 * @param options - Email options (to, subject, html)
 * @throws Error if email sending fails
 */
export async function sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
  // Check if email is configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    logger.warn('Email service not configured, skipping email send', { to, subject });
    return;
  }

  try {
    await transporter.sendMail({
      from: `"WasteNexus" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    logger.info('Email sent successfully', { to, subject });
  } catch (error) {
    logger.error('Error sending email', error, { to, subject });
    throw new Error('Failed to send email');
  }
}

// Email template for worker verification
export function getWorkerVerificationEmail(name: string, email: string, password: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border: 1px solid #e5e7eb;
        }
        .credentials {
          background: white;
          padding: 20px;
          border-left: 4px solid #10b981;
          margin: 20px 0;
          border-radius: 5px;
        }
        .credential-item {
          margin: 10px 0;
        }
        .credential-label {
          font-weight: bold;
          color: #059669;
        }
        .credential-value {
          font-family: 'Courier New', monospace;
          background: #f3f4f6;
          padding: 5px 10px;
          border-radius: 4px;
          display: inline-block;
          margin-top: 5px;
        }
        .button {
          display: inline-block;
          background: #10b981;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #6b7280;
          font-size: 14px;
        }
        .warning {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Welcome to WasteNexus!</h1>
      </div>
      <div class="content">
        <p>Dear <strong>${name}</strong>,</p>
        
        <p>Congratulations! Your worker application has been <strong style="color: #10b981;">verified and approved</strong> by our admin team.</p>
        
        <p>We're excited to have you join our mission to create a cleaner, greener future! Your account has been created and you can now access the WasteNexus platform.</p>
        
        <div class="credentials">
          <h3 style="margin-top: 0; color: #059669;">Your Login Credentials</h3>
          <div class="credential-item">
            <div class="credential-label">Email:</div>
            <div class="credential-value">${email}</div>
          </div>
          <div class="credential-item">
            <div class="credential-label">Temporary Password:</div>
            <div class="credential-value">${password}</div>
          </div>
        </div>
        
        <div class="warning">
          <strong>⚠️ Important Security Notice:</strong>
          <ul style="margin: 10px 0;">
            <li>Please change your password immediately after your first login</li>
            <li>Do not share your credentials with anyone</li>
            <li>Keep this email secure or delete it after changing your password</li>
          </ul>
        </div>
        
        <div style="text-align: center;">
          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/signin" class="button">
            Login to Your Account
          </a>
        </div>
        
        <p><strong>What's Next?</strong></p>
        <ul>
          <li>Log in to your account using the credentials above</li>
          <li>Update your password in the profile settings</li>
          <li>Complete your profile information</li>
          <li>Start accepting waste collection jobs in your area</li>
        </ul>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        
        <p>Thank you for being part of the WasteNexus community!</p>
        
        <p>Best regards,<br>
        <strong>The WasteNexus Team</strong></p>
      </div>
      <div class="footer">
        <p>This is an automated email. Please do not reply to this message.</p>
        <p>&copy; ${new Date().getFullYear()} WasteNexus. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
}

// Email template for worker rejection
export function getWorkerRejectionEmail(name: string, reason: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border: 1px solid #e5e7eb;
        }
        .reason-box {
          background: #fee2e2;
          border-left: 4px solid #ef4444;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
        }
        .button {
          display: inline-block;
          background: #10b981;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #6b7280;
          font-size: 14px;
        }
        .info-box {
          background: #dbeafe;
          border-left: 4px solid #3b82f6;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Application Status Update</h1>
      </div>
      <div class="content">
        <p>Dear <strong>${name}</strong>,</p>
        
        <p>Thank you for your interest in joining WasteNexus as a worker. We appreciate the time and effort you put into your application.</p>
        
        <p>After careful review, we regret to inform you that we are unable to approve your application at this time.</p>
        
        <div class="reason-box">
          <h3 style="margin-top: 0; color: #dc2626;">Reason for Rejection:</h3>
          <p style="margin: 0;">${reason}</p>
        </div>
        
        <div class="info-box">
          <h3 style="margin-top: 0; color: #1e40af;">💡 You Can Reapply!</h3>
          <p style="margin: 0;">If you believe you can address the concerns mentioned above, you are welcome to submit a new application in the future. We encourage you to review our requirements carefully before reapplying.</p>
        </div>
        
        <div style="text-align: center;">
          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/worker/apply" class="button">
            Submit New Application
          </a>
        </div>
        
        <p>If you have any questions about this decision or need clarification on our requirements, please feel free to contact our support team.</p>
        
        <p>We wish you all the best in your future endeavors.</p>
        
        <p>Best regards,<br>
        <strong>The WasteNexus Team</strong></p>
      </div>
      <div class="footer">
        <p>This is an automated email. Please do not reply to this message.</p>
        <p>&copy; ${new Date().getFullYear()} WasteNexus. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
}
