// Test script to verify email functionality
// Run with: node --loader ts-node/esm scripts/test-email.ts

import { sendEmail, getWorkerVerificationEmail, getWorkerRejectionEmail } from '../lib/email';

async function testEmail() {
  console.log('🧪 Testing email functionality...\n');

  // Test verification email
  console.log('📧 Sending test verification email...');
  try {
    await sendEmail({
      to: process.env.EMAIL_USER || 'test@example.com',
      subject: '🧪 Test: Worker Verification Email',
      html: getWorkerVerificationEmail(
        'Test Worker',
        'test@example.com',
        'TestPassword123'
      ),
    });
    console.log('✅ Verification email sent successfully!\n');
  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
  }

  // Test rejection email
  console.log('📧 Sending test rejection email...');
  try {
    await sendEmail({
      to: process.env.EMAIL_USER || 'test@example.com',
      subject: '🧪 Test: Worker Rejection Email',
      html: getWorkerRejectionEmail(
        'Test Worker',
        'Incomplete documentation provided'
      ),
    });
    console.log('✅ Rejection email sent successfully!\n');
  } catch (error) {
    console.error('❌ Failed to send rejection email:', error);
  }

  console.log('✅ Email test completed!');
  process.exit(0);
}

testEmail();
