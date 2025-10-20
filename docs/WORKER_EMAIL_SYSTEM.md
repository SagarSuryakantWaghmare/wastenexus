# 📧 Worker Email Notification System

## Overview
This system automatically sends email notifications to worker applicants when their application is verified or rejected by an admin.

## Features

### ✅ Verification Flow
When an admin verifies a worker application:
1. **User Account Creation**: A new user account is created with role `worker`
2. **Password Generation**: A secure temporary password is auto-generated (e.g., `Worker@abc12345`)
3. **Password Hashing**: Password is hashed using bcrypt before storing
4. **Email Notification**: Worker receives a professional email with:
   - Welcome message
   - Login credentials (email + temporary password)
   - Security warning to change password
   - Direct login link
   - Next steps instructions

### ❌ Rejection Flow
When an admin rejects a worker application:
1. **Status Update**: Application status is updated to `rejected`
2. **Reason Stored**: Rejection reason is saved to database
3. **Email Notification**: Worker receives a professional email with:
   - Polite rejection message
   - Clear explanation of rejection reason
   - Encouragement to reapply after addressing issues
   - Link to submit new application

## Email Configuration

### Environment Variables
Add these to your `.env.local`:

```env
# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Gmail Setup
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security
   - Under "2-Step Verification", click "App passwords"
   - Generate a password for "Mail"
   - Use this password in `EMAIL_PASS`

## Email Templates

### Verification Email Template
- **Subject**: 🎉 Your WasteNexus Worker Application Has Been Approved!
- **Features**:
  - Professional branded header
  - Clear credentials display
  - Security warnings
  - Call-to-action button
  - Next steps guide

### Rejection Email Template
- **Subject**: WasteNexus Worker Application Status Update
- **Features**:
  - Respectful tone
  - Clear rejection reason
  - Reapplication encouragement
  - Support contact information

## API Endpoint

### Verify Worker Application
```typescript
PUT /api/admin/worker-applications/[id]
Authorization: Bearer <admin-token>

{
  "action": "verify"
}
```

**Response (Success)**:
```json
{
  "message": "Application verified, worker account created, and email sent successfully",
  "user": {
    "name": "Worker Name",
    "email": "worker@example.com",
    "role": "worker"
  }
}
```

### Reject Worker Application
```typescript
PUT /api/admin/worker-applications/[id]
Authorization: Bearer <admin-token>

{
  "action": "reject",
  "rejectionReason": "Incomplete documentation"
}
```

**Response (Success)**:
```json
{
  "message": "Application rejected and email notification sent",
  "status": "rejected"
}
```

## Testing

### Test Email Functionality
```bash
# Send test emails to verify configuration
npm run test:email
```

Or run manually:
```bash
node --loader ts-node/esm scripts/test-email.ts
```

## Error Handling

### Email Failures
- Email failures DO NOT block the verification/rejection process
- Errors are logged to console
- Application status is still updated correctly
- Admin should manually contact worker if email fails

### Common Issues

**Issue**: "Invalid login credentials"
- **Solution**: Verify `EMAIL_USER` and `EMAIL_PASS` in `.env.local`
- **Tip**: Make sure you're using an App Password, not your regular Gmail password

**Issue**: "Email not sent"
- **Solution**: Check your internet connection
- **Solution**: Verify Gmail App Password is correct
- **Solution**: Check Gmail account has 2FA enabled

**Issue**: Worker doesn't receive email
- **Solution**: Check spam/junk folder
- **Solution**: Verify email address is correct in application
- **Solution**: Check console logs for email sending errors

## Security Best Practices

### Password Security
✅ **Implemented**:
- Temporary passwords are auto-generated with strong format
- Passwords are hashed with bcrypt (10 rounds) before storage
- Workers are urged to change password immediately
- Credentials are ONLY sent via email (not in API response)

### Email Security
✅ **Implemented**:
- Environment variables for credentials
- App passwords instead of account passwords
- No sensitive data in email subjects
- Secure HTML templates without inline scripts

## Database Schema

### WorkerApplication Updates
```typescript
{
  // ... existing fields
  status: 'pending' | 'verified' | 'rejected',
  userId?: ObjectId,           // Reference to created User
  verifiedAt?: Date,            // When verified
  verifiedBy?: ObjectId,        // Admin who verified
  rejectionReason?: string      // Why rejected
}
```

### User Creation
```typescript
{
  name: string,
  email: string,
  password: string,            // Hashed with bcrypt
  role: 'worker',
  profileImage?: string        // From worker application photo
}
```

## Workflow Diagram

```
Worker Application Submitted
        ↓
    [Pending]
        ↓
Admin Reviews Application
        ↓
    ┌───────┴───────┐
    ↓               ↓
[Verify]        [Reject]
    ↓               ↓
Create User    Update Status
    ↓               ↓
Hash Password  Store Reason
    ↓               ↓
Send Email     Send Email
    ↓               ↓
[Complete]     [Complete]
```

## Future Enhancements

- [ ] Email queue system for better reliability
- [ ] Email templates customization in admin panel
- [ ] SMS notifications as backup
- [ ] Email delivery tracking
- [ ] Resend email option in admin panel
- [ ] Email preview before sending
- [ ] Multi-language email templates
- [ ] Bulk email operations

## Support

If you encounter issues:
1. Check console logs for detailed error messages
2. Verify `.env.local` configuration
3. Test with `npm run test:email`
4. Review Gmail App Password setup
5. Check spam folder for test emails

For additional help, contact the development team.
