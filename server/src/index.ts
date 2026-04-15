// @ts-expect-error
import app, { startServer } from "../legacy/index.mjs";
import { Request, Response } from "express";
import errorHandler from "./common/middlewares/error-handler-middleware";
import authRoutes from "./modules/auth/auth-routes";

// Routes
app.get("/api/v1/health", (req: Request, res: Response) => res.send("Everything is working.."))
app.use("/api/v1/auth", authRoutes)

// Error handler middleware
app.use(errorHandler);



try {
    startServer();
} catch (error) {
    console.log(`Error occurred while starting http server `, error);
}


