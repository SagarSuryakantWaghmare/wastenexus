# API Testing Guide

This guide provides examples for testing the WasteNexus API endpoints.

## Authentication

### Sign Up
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "client"
  }'
```

### Sign In
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the token from the response for authenticated requests.

## Reports API

### Submit a Report
```bash
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "type": "plastic",
    "weightKg": 5.5,
    "imageUrl": "https://example.com/image.jpg",
    "location": {
      "latitude": 19.0760,
      "longitude": 72.8777,
      "address": "Mumbai, India"
    }
  }'
```

### Get All Reports
```bash
# Get your own reports (client)
curl -X GET "http://localhost:3000/api/reports" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get reports with filters (champion/admin)
curl -X GET "http://localhost:3000/api/reports?status=pending&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Verify a Report (Champion/Admin)
```bash
curl -X PUT http://localhost:3000/api/reports/REPORT_ID/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "action": "verify"
  }'
```

## Events API

### Create Event (Champion)
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Beach Cleanup Drive",
    "description": "Join us for a community beach cleanup",
    "location": "Juhu Beach, Mumbai",
    "date": "2024-12-15T09:00:00Z",
    "coordinates": {
      "latitude": 19.0989,
      "longitude": 72.8267
    }
  }'
```

### Get All Events
```bash
curl -X GET "http://localhost:3000/api/events" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Join Event
```bash
curl -X POST http://localhost:3000/api/events/EVENT_ID/join \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## User Profile

### Get Current User
```bash
curl -X GET "http://localhost:3000/api/user" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Profile
```bash
curl -X PUT http://localhost:3000/api/user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Updated Name",
    "profileImage": "https://example.com/avatar.jpg"
  }'
```

## Leaderboard

### Get Top Users
```bash
curl -X GET "http://localhost:3000/api/leaderboard?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Image Upload

### Upload Image (with AI Classification)
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "image=@/path/to/image.jpg"
```

Response includes:
- `imageUrl`: Cloudinary URL
- `classification`: AI-generated waste classification

## Error Handling

All API endpoints return standardized responses:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": { ... } // Only in development
  }
}
```

## Common Error Codes

- `UNAUTHORIZED` (401) - Missing or invalid authentication
- `FORBIDDEN` (403) - Insufficient permissions
- `BAD_REQUEST` (400) - Invalid request data
- `NOT_FOUND` (404) - Resource not found
- `CONFLICT` (409) - Resource already exists
- `VALIDATION_ERROR` (422) - Input validation failed
- `INTERNAL_ERROR` (500) - Server error

## Rate Limiting

API endpoints have rate limits:

- **Signup**: 5 requests per hour per IP
- **Reports**: 20 submissions per hour per user
- **Other endpoints**: 100 requests per minute per user

When rate limited, you'll receive:
```json
{
  "success": false,
  "error": {
    "message": "Rate limit exceeded. Please try again later.",
    "code": "BAD_REQUEST"
  }
}
```

## Pagination

List endpoints support pagination:

```bash
# Page 2, 20 items per page
curl -X GET "http://localhost:3000/api/reports?page=2&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Response includes pagination metadata:
```json
{
  "success": true,
  "data": {
    "reports": [ ... ],
    "pagination": {
      "page": 2,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

## Testing Tools

### cURL
Basic command-line testing (examples above)

### Postman
1. Import the API endpoints
2. Set up environment variables for base URL and token
3. Create a collection for organized testing

### Insomnia
Similar to Postman, good for REST API testing

### HTTPie
More user-friendly than cURL:
```bash
http POST localhost:3000/api/auth/signup \
  name="Test User" \
  email="test@example.com" \
  password="password123" \
  role="client"
```

## Environment Variables for Testing

Set up a test environment in `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/wastenexus_test
JWT_SECRET=test-secret-key-min-32-characters-long
NEXTAUTH_URL=http://localhost:3000
```

## Testing Workflow

1. **Start the server**: `npm run dev`
2. **Create test user**: Use signup endpoint
3. **Get auth token**: Use signin endpoint
4. **Test endpoints**: Use token in Authorization header
5. **Verify responses**: Check response format and data
6. **Test error cases**: Try invalid inputs
7. **Test rate limiting**: Send multiple requests quickly

## Best Practices

1. **Use environment-specific tokens** - Don't use production tokens for testing
2. **Clean up test data** - Remove test accounts and data after testing
3. **Test error cases** - Verify error handling works correctly
4. **Check rate limits** - Ensure rate limiting is working
5. **Validate responses** - Confirm response format matches expectations
6. **Test authentication** - Verify token validation works
7. **Test authorization** - Ensure role-based access works

## Automated Testing

For automated API testing, consider:
- **Jest + Supertest** for unit/integration tests
- **Playwright** for end-to-end tests
- **k6** for load testing
- **Newman** for Postman collection automation

Example Jest test:
```javascript
describe('POST /api/auth/signup', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'client'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user).toBeDefined();
  });
});
```

## Troubleshooting

### 401 Unauthorized
- Check if token is valid and not expired
- Ensure Authorization header format: `Bearer YOUR_TOKEN`
- Verify user still exists in database

### 400 Bad Request
- Check request body format
- Verify all required fields are provided
- Ensure data types are correct

### 429 Rate Limited
- Wait for the rate limit window to reset
- Use different accounts for testing
- Consider increasing limits for testing

### 500 Internal Error
- Check server logs for detailed error
- Verify database connection
- Ensure environment variables are set

## Support

For questions or issues:
- Check existing documentation
- Review error messages carefully
- Open an issue on GitHub
- Contact maintainers

Happy testing! 🧪
