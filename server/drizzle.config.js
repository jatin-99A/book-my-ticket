"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: ['./src/db/**/*.ts', '!./src/db/index.ts'],
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL,
    },
});
