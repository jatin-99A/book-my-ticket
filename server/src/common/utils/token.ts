import JWT from 'jsonwebtoken';
import crypto from 'crypto';
import 'dotenv/config';
import { db } from '../../db/index';
import { usersTable } from '../../db/users.schema';
import { eq, sql } from 'drizzle-orm';

export interface TokenPayload {
  id: string;
  [key: string]: any;
}

const JWT_SECRET: string = process.env.JWT_SECRET || 'fallback_secret';

export class TokenService {
  static generatePayloadToken(
    payload: TokenPayload,
    expiresIn: JWT.SignOptions['expiresIn'] = '15m'
  ): string | null {
    try {
      return JWT.sign(payload, JWT_SECRET, { expiresIn });
    } catch {
      return null;
    }
  }

  static verifyPayloadToken<T = TokenPayload>(token: string): T | null {
    try {
      return JWT.verify(token, JWT_SECRET) as T;
    } catch {
      return null;
    }
  }

  static async generateRefreshToken(userId: string) {
    try {
      const token = crypto.randomBytes(40).toString('hex');

      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      const days = process.env.JWT_REFRESH_EXPIRES_DAYS || 5;


      await db
        .update(usersTable)
        .set({
          refreshToken: hashedToken,
          refreshTokenExpiresAt: sql`now() + interval '${days} days'`,
        })
        .where(eq(usersTable.id, userId));

      return { token };
    } catch (error) {
      return null
    }
  }

  static async verifyRefreshToken(token: string) {
    try {
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const result = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.refreshToken, hashedToken))
        .limit(1);

      const user = result[0];

      if (!user) {
        return null;
      }

      if (
        user.refreshTokenExpiresAt &&
        new Date(user.refreshTokenExpiresAt) < new Date()
      ) {
        return null;
      }

      return { valid: true, user: { firstName: user.firstName, lastName: user.lastName, email: user.email, id: user.id } };
    } catch (error) {
      return null;
    }
  }

  static async revokeRefreshToken(userId: string) {
    await db
      .update(usersTable)
      .set({
        refreshToken: null,
        refreshTokenExpiresAt: null,
      })
      .where(eq(usersTable.id, userId));
  }
}