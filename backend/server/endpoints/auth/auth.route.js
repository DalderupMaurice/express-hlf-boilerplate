import { Router } from "express";
import validate from "express-validation";
import expressJwt from "express-jwt";

import { loginSchema } from "./auth.validation";
import { getRandomNumber, login } from "./auth.controller";
import config from "../../../config/config";

const router = Router() // eslint-disable-line new-cap
  /** GET /api/auth/random-number - Protected route,
   * needs token returned by the above as header. Authorization: Bearer {token} */
  .get(
    "/random-number",
    expressJwt({ secret: config.jwtSecret }),
    getRandomNumber
  )

  /** POST /api/auth/login - Returns token if correct username and password is provided */
  .post("/login", validate(loginSchema), login);

export default router;
