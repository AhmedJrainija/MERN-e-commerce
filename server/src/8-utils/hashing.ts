import bcrypt from 'bcrypt';
import { AppError } from './custom error class.js';

export async function hashPassword(password: string): Promise<string> {
  try {
    
    const salt = await bcrypt.genSalt(12);

    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
      
  } catch (err) {
    throw new AppError("Unable to process password securely", 500);
  }
}