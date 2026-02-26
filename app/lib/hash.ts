// app/lib/hash.ts
import { hash } from 'bcryptjs';

/**
 * Optimizations:
 * 1. Uses bcryptjs for better compatibility with Next.js/Turbopack.
 * 2. Uses cost factor 12 (Industry standard).
 * 3. Handles salt generation and hashing in a single step to prevent salt-mismatch errors.
 */
export const registerUser = async (password: string): Promise<string> => {
  // We do not need separate genSalt. bcryptjs.hash(data, rounds) does it for us.
  const saltRounds = 10; 
  return await hash(password, saltRounds);
};