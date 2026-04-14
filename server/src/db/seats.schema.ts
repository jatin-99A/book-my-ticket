import { pgTable, serial, varchar, integer, pgEnum, uuid, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users.schema";
import { moviesTable } from "./movies.schema";

export const slotEnum = pgEnum("slot", [
    "11:00 AM",
    "3:00 PM",
    "7:00 PM",
    "10:30 PM",
]);

export const seatsTable = pgTable("seats", {
    id: serial("id").primaryKey(),

    name: varchar("name", { length: 255 }),

    isBooked: integer("isbooked").default(0),

    slot: slotEnum("slot").notNull(),

    movieId: integer("movie_id")
        .references(() => moviesTable.id)
        .notNull(),

    userId: uuid("user_id")
        .references(() => usersTable.id)
        .notNull(),

    createdAt: timestamp("created_at").defaultNow(),
});