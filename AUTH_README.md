# Simple Authentication System

## Overview
This application uses a simple cookie-based authentication system without NextAuth.

## Login Credentials

### Admin User
- **Email:** admin@wastenexus.com
- **Password:** admin123
- **Role:** admin

### Regular User
- **Email:** user@wastenexus.com
- **Password:** user123
- **Role:** user

## Features

### Authentication
- Simple login/logout system
- HTTP-only cookie-based sessions
- Session expires after 7 days

### File Upload System
- Upload event files (PDF, DOCX, XLSX, JPG, PNG, GIF)
- Upload recent files (PDF, DOCX, XLSX, JPG, PNG)
- File type validation
- Multiple file upload support
- Real-time upload progress
- Recent uploads display

## API Endpoints

### Authentication
- **POST** `/api/auth/login` - Login with email and password
- **POST** `/api/auth/logout` - Logout and clear session

### File Upload
- **POST** `/api/upload` - Upload files (requires authentication)
  - Body: FormData with `files` and `type` (event/recent)
- **GET** `/api/upload` - Get uploaded files list (requires authentication)

## Pages

### `/login`
Login page with email and password fields

### `/champions`
File upload portal (requires authentication)
- Upload event and recent files
- View recent uploads
- Logout button

## File Storage
Uploaded files are stored in:
- `/public/uploads/event/` - Event files
- `/public/uploads/recent/` - Recent files

## Security Notes

⚠️ **This is a simple authentication system for development purposes**

For production, you should:
1. Use a proper database instead of in-memory user store
2. Hash passwords using bcrypt or similar
3. Implement proper session management
4. Add CSRF protection
5. Use environment variables for sensitive data
6. Add rate limiting
7. Implement proper role-based access control

## Usage

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/login`

3. Login with one of the credentials above

4. You'll be redirected to `/champions` where you can upload files

5. Click the logout button to end your session

## File Upload Limits

- Maximum file size: Determined by Next.js config (default 4.5MB)
- Allowed file types:
  - **Events:** PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG, GIF
  - **Recent:** PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG

## Troubleshooting

### Cannot login
- Check that you're using the correct email and password
- Clear browser cookies and try again

### Upload fails
- Check file type is allowed
- Ensure you're logged in
- Check file size is within limits
- Verify `public/uploads` directory exists and is writable

### Session expires
- Sessions last 7 days
- Login again to create a new session
