import JWT from "jsonwebtoken";
import { db } from "../dist/db/index.js";
import { usersTable } from "../dist/db/users.schema.js";
import { eq } from "drizzle-orm";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const authMiddleware = async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        let payload;
        try {
            payload = JWT.verify(token, JWT_SECRET);
        } catch {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await db
            .select({
                id: usersTable.id,
                email: usersTable.email,
                firstName: usersTable.firstName,
                lastName: usersTable.lastName,
            })
            .from(usersTable)
            .where(eq(usersTable.id, payload.id))
            .limit(1);

        if (!user.length) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user[0];

        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};