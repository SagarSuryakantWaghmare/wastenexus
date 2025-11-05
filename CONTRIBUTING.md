# Contributing to WasteNexus

Thank you for your interest in contributing to WasteNexus! This document provides guidelines and best practices for contributing to the project.

## Getting Started

1. **Fork the repository** and clone it locally
2. **Install dependencies**: `npm install`
3. **Copy environment variables**: `cp .env.example .env.local`
4. **Configure your environment** (see `.env.example` for details)
5. **Start development server**: `npm run dev`

## Development Workflow

### Branch Naming

Use descriptive branch names with the following prefixes:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests

Example: `feature/add-user-notifications`

### Commit Messages

Follow conventional commit format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code formatting (no logic changes)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example: `feat: add email notifications for report verification`

## Code Standards

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid using `any` type
- Use strict type checking

```typescript
// Good
interface UserData {
  name: string;
  email: string;
}

// Avoid
const data: any = { ... };
```

### Logging

Use the centralized logger instead of console statements:

```typescript
import { logger } from '@/lib/logger';

// Good
logger.info('User created', { userId, email });
logger.error('Failed to save', error);

// Avoid
console.log('User created', userId);
```

### Error Handling

Use standardized error responses:

```typescript
import { ErrorResponses } from '@/lib/api-response';

// Good
return ErrorResponses.badRequest('Invalid email format');

// Avoid
return NextResponse.json({ error: 'Bad request' }, { status: 400 });
```

### Input Validation

Always validate and sanitize user input:

```typescript
import { isValidEmail, sanitizeString } from '@/lib/validation';

// Validate
if (!isValidEmail(email)) {
  return ErrorResponses.badRequest('Invalid email');
}

// Sanitize
const safeName = sanitizeString(name);
```

### API Routes

Follow these patterns for API routes:

1. **Authentication**: Always verify tokens for protected routes
2. **Rate Limiting**: Add rate limiting to prevent abuse
3. **Validation**: Validate all inputs before processing
4. **Logging**: Log important events and errors
5. **Standardized Responses**: Use `successResponse` and `ErrorResponses`

Example:
```typescript
import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { successResponse, ErrorResponses, checkRateLimit } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    // Authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return ErrorResponses.unauthorized();
    
    const decoded = verifyToken(token);
    if (!decoded) return ErrorResponses.unauthorized();

    // Rate limiting
    const rateLimit = checkRateLimit(`endpoint:${decoded.userId}`, 10, 60000);
    if (!rateLimit.allowed) {
      return ErrorResponses.badRequest('Rate limit exceeded');
    }

    // Process request...
    logger.info('Action completed', { userId: decoded.userId });
    return successResponse({ result });
  } catch (error) {
    logger.error('Action failed', error);
    return ErrorResponses.internalError();
  }
}
```

### Database Models

When creating or updating models:

1. Add proper validation
2. Add indexes for frequently queried fields
3. Use enums for constrained values
4. Add helpful error messages

Example:
```typescript
const schema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'inactive'],
      message: '{VALUE} is not a valid status',
    },
  },
});

// Add indexes
schema.index({ email: 1 });
schema.index({ status: 1, createdAt: -1 });
```

## Testing

Before submitting a PR:

1. **Type check**: `npx tsc --noEmit`
2. **Lint**: `npm run lint`
3. **Build**: `npm run build` (may fail due to Google Fonts, but TypeScript errors will show)
4. **Manual testing**: Test your changes in the browser

## Documentation

- Add JSDoc comments for public functions
- Update relevant documentation files
- Include usage examples where helpful

Example:
```typescript
/**
 * Calculates reward points based on waste weight and type
 * 
 * @param weightKg - Weight of waste in kilograms
 * @param wasteType - Type of waste (plastic, metal, etc.)
 * @returns Calculated points
 * 
 * @example
 * const points = calculatePoints(5, 'plastic'); // Returns 75
 */
export function calculatePoints(weightKg: number, wasteType: string): number {
  // Implementation...
}
```

## Security

- Never commit sensitive data (API keys, passwords)
- Validate all user inputs
- Use parameterized queries (Mongoose does this automatically)
- Sanitize inputs to prevent XSS
- Use rate limiting to prevent abuse
- Log security-relevant events

## Pull Request Process

1. **Create a descriptive PR title** following commit conventions
2. **Describe your changes** in the PR description
3. **Link related issues** if applicable
4. **Ensure tests pass** and code compiles
5. **Request review** from maintainers
6. **Address feedback** promptly

### PR Checklist

- [ ] Code follows project standards
- [ ] TypeScript compilation passes
- [ ] Added/updated tests if applicable
- [ ] Documentation updated if needed
- [ ] No console.log statements
- [ ] Proper error handling
- [ ] Input validation added
- [ ] Security considerations addressed

## Code Review Guidelines

### For Reviewers

- Be constructive and respectful
- Focus on code quality, not personal preferences
- Suggest improvements with examples
- Approve when ready, even if minor improvements could be made

### For Contributors

- Be open to feedback
- Ask questions if feedback is unclear
- Make requested changes promptly
- Thank reviewers for their time

## Getting Help

- Check existing documentation first
- Search closed issues for similar problems
- Open a discussion for questions
- Tag maintainers for urgent issues

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Code Quality Improvements](./CODE_QUALITY_IMPROVEMENTS.md)

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Project README (for significant contributions)
- Release notes

Thank you for contributing to WasteNexus! 🌱♻️
