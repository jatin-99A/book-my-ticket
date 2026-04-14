import { pgTable, serial, varchar, text, integer, numeric, pgEnum } from "drizzle-orm/pg-core";

export const showtimeEnum = pgEnum("showtime", [
    "11:00 AM",
    "3:00 PM",
    "7:00 PM",
    "10:30 PM",
]);

export const moviesTable = pgTable("movies", {
    id: serial("id").primaryKey(),

    title: varchar("title", { length: 255 }).notNull(),

    genre: varchar("genre", { length: 100 }).notNull(),

    duration: integer("duration").notNull(), // minutes me store karo

    rating: numeric("rating", { precision: 2, scale: 1 }),

    price: integer("price").notNull(),

    releaseDate: text("release_date").notNull(),

    description: text("description"),

    poster: text("poster"),

    showtime: showtimeEnum("showtime").notNull(),
});