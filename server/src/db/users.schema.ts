import { sql } from 'drizzle-orm'
import { pgTable, uuid, varchar, index, boolean, timestamp } from 'drizzle-orm/pg-core'


export const usersTable = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),

    firstName: varchar('first_name', { length: 45 }).notNull(),
    lastName: varchar('last_name', { length: 45 }),

    email: varchar('email', { length: 322 }).notNull().unique(),
    emailVerified: boolean('email_verified').default(false).notNull(),
    emailVerificationExpires: timestamp('email_verification_expires').default(
        sql`now() + interval '1 day'`
    ),

    password: varchar('password', { length: 66 }),

    refreshToken: varchar('refresh_token', { length: 128 }),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').$onUpdate(() => new Date()),
},
    (table) => ({
        refreshTokenIdx: index('refresh_token_idx').on(table.refreshToken),
    }))