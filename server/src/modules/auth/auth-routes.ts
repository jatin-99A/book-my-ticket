import { Router } from "express";
import validate from "../../common/middlewares/validate-middleware";
import AuthenticationController from "./auth-controllers";
import { SignupDto } from "./dto/signup-dto";
import { catchAsync } from "../../common/utils/catch-async-error";
import { SigninDto } from "./dto/signin-dto";

const router = Router();

const authenticationController = new AuthenticationController()

router.post(
    "/signup",
     validate(SignupDto), catchAsync(authenticationController.handleSignup.bind(authenticationController))
);

router.post(
    "/login",
     validate(SigninDto), catchAsync(authenticationController.handleSignin.bind(authenticationController))
);

router.post(
    "/me",
    catchAsync(authenticationController.getMe.bind(authenticationController))
);

router.post(
    "/refresh-token",
    catchAsync(authenticationController.refreshToken.bind(authenticationController))
);



export default router;