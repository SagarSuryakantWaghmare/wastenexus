// Simple password hashing utility - replace with bcrypt in production
export function saltAndHashPassword(password: string): string {
  // In production, use bcrypt or similar:
  // import bcrypt from 'bcrypt';
  // const salt = bcrypt.genSaltSync(12);
  // return bcrypt.hashSync(password, salt);
  
  // Simple hash for demo purposes - NOT SECURE for production
  return `hashed_${password}`;
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  // In production, use bcrypt.compareSync(password, hashedPassword)
  return hashedPassword === `hashed_${password}`;
}
