import type { Request, Response } from 'express'
import { SignupDtoType } from './dto/signup-dto';
import bcrypt from "bcrypt";
import { db } from '../../db';
import { usersTable } from '../../db/users.schema';
import ApiResponse from '../../common/utils/api-response';
import { SigninDtoType } from './dto/signin-dto';
import { eq } from 'drizzle-orm';
import ApiError from '../../common/utils/api-error';
import { TokenService } from '../../common/utils/token';


class AuthenticationController {
    public async handleSignup(req: Request<{}, {}, SignupDtoType>, res: Response) {
        const { firstName, lastName, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db
            .insert(usersTable)
            .values({
                firstName,
                lastName,
                email,
                password: hashedPassword,
            })
            .returning({
                id: usersTable.id,
                email: usersTable.email,
            });

        return ApiResponse.created(res, "User registered successfully", result[0]);
    }

    public async handleSignin(
        req: Request<{}, {}, SigninDtoType>,
        res: Response
    ) {
        const { email, password } = req.body;

        // 1. find user
        const user = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email))
            .limit(1);

        if (!user.length) {
            return ApiError.unauthorized("Invalid credentials");
        }

        const existingUser = user[0];

        // 2. check password
        const isMatch = await bcrypt.compare(
            password,
            existingUser.password!
        );

        if (!isMatch) {
            return ApiError.unauthorized("Invalid credentials");
        }

        // 3. generate access token
        const accessToken = TokenService.generatePayloadToken({
            id: existingUser.id,
            email: existingUser.email,
        });

        if (!accessToken) {
            return ApiError.internalError();
        }

        // 4. generate refresh token
        const refreshToken = await TokenService.generateRefreshToken(
            existingUser.id
        );

        if (!refreshToken) {
            return ApiError.internalError();
        }

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 min
        });

        res.cookie("refreshToken", refreshToken.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
        });

        // 5. success response
        return ApiResponse.ok(res, "Login successful", {
            user: {
                id: existingUser.id,
                email: existingUser.email,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
            },
        });
    }

    public async getMe(req: Request, res: Response) {
        // 1. get a token
        const token =
            req.cookies?.accessToken ||
            req.headers.authorization?.split(" ")[1];

        if (!token) {
            return ApiError.unauthorized();
        }

        // 2. verify token
        const payload = TokenService.verifyPayloadToken<{ id: string }>(token);

        if (!payload) {
            return ApiError.unauthorized();
        }

        // 3. user fetch
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
            return ApiError.notFound("User not found");
        }

        // 4. response
        return ApiResponse.ok(res, "User fetched successfully", user[0]);
    }

    public async refreshToken(req: Request, res: Response) {
        // 1. get a token
        const token = req.cookies?.refreshToken;

        if (!token) {
            return ApiError.unauthorized();
        }

        // 2. Verify refresh token
        const isVerified = await TokenService.verifyRefreshToken(token);

        if (!isVerified) {
            res.clearCookie("refreshToken");
            res.clearCookie("accessToken");
            return ApiError.unauthorized();
        }

        const existingUser = isVerified.user;

        // 3. Generate new tokens
        const accessToken = TokenService.generatePayloadToken({
            id: existingUser.id,
            email: existingUser.email,
        });

        if (!accessToken) {
            return ApiError.internalError();
        }

        const refreshToken = await TokenService.generateRefreshToken(
            existingUser.id
        );

        if (!refreshToken) {
            return ApiError.internalError();
        }

        // 4. Send cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000, // 15 min
        });

        res.cookie("refreshToken", refreshToken.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
        });

        // 5. success response
        return ApiResponse.ok(res, "Token refreshed successfully", {
            user: {
                id: existingUser.id,
                email: existingUser.email,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
            },
        });


    }


}

export default AuthenticationController