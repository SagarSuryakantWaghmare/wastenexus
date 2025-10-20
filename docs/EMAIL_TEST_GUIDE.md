# 🧪 Quick Test Guide for Worker Email System

## Prerequisites
✅ Make sure your `.env.local` has:
```env
EMAIL_USER=unknownultima44@gmail.com
EMAIL_PASS=dqtkiehjinfjspwo
```

## Test the Email System

### Option 1: Test Email Script (Recommended)
```bash
npm run test:email
```

This will:
- Send a test verification email to your EMAIL_USER
- Send a test rejection email to your EMAIL_USER
- Confirm both emails were sent successfully

### Option 2: Test via Admin Panel
1. Start the development server:
   ```bash
   npm run dev
   ```

2. Go to: http://localhost:3000/worker/apply
3. Fill out a worker application form
4. Login as admin: http://localhost:3000/auth/signin
5. Go to: http://localhost:3000/dashboard/admin/workers
6. Click on the pending application
7. Click "Verify" or "Reject"
8. Check the email inbox!

## What to Expect

### ✅ Verification Email
- **To**: Worker's email address
- **Subject**: 🎉 Your WasteNexus Worker Application Has Been Approved!
- **Contains**:
  - Welcome message
  - Login credentials (email + temp password)
  - Security warnings
  - Login button
  - Next steps

### ❌ Rejection Email
- **To**: Worker's email address
- **Subject**: WasteNexus Worker Application Status Update
- **Contains**:
  - Respectful rejection message
  - Clear reason for rejection
  - Reapplication encouragement
  - Apply again button

## Troubleshooting

### Email not received?
1. Check spam/junk folder
2. Verify `.env.local` EMAIL_USER and EMAIL_PASS are correct
3. Check console for error messages
4. Try running `npm run test:email` to isolate the issue

### Gmail App Password Issues?
1. Make sure 2FA is enabled on your Gmail
2. Generate new App Password:
   - Google Account → Security → 2-Step Verification → App passwords
3. Update EMAIL_PASS in `.env.local`
4. Restart development server

## Success Indicators

✅ Console logs:
```
✅ Verification email sent to worker@example.com
```

✅ API response (verify):
```json
{
  "message": "Application verified, worker account created, and email sent successfully"
}
```

✅ API response (reject):
```json
{
  "message": "Application rejected and email notification sent"
}
```

## Database Changes After Verification

### WorkerApplication Document:
```javascript
{
  status: "verified",
  verifiedAt: ISODate("2025-10-20T..."),
  verifiedBy: ObjectId("admin-id"),
  userId: ObjectId("newly-created-user-id")
}
```

### New User Document Created:
```javascript
{
  name: "Worker Name",
  email: "worker@example.com",
  password: "$2a$10$..." // Hashed password
  role: "worker",
  profileImage: "cloudinary-url-from-application"
}
```

## Quick Verification Checklist

- [ ] `.env.local` has EMAIL_USER and EMAIL_PASS
- [ ] Development server is running
- [ ] Worker application exists in "pending" status
- [ ] Admin is logged in
- [ ] Email credentials are valid (test with `npm run test:email`)
- [ ] Check spam folder if email not in inbox

## Need Help?

Check the full documentation: `docs/WORKER_EMAIL_SYSTEM.md`
