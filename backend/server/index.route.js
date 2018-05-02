import { Router } from "express";

import { login, logout, userInfo, callback, verifyJwt } from "./services/auth.service";

import userRoutes from "./endpoints/user/user.route";
import chainRoutes from "./endpoints/chain/chain.route";
import movementRoutes from "./endpoints/movement/movement.route";

export default Router()
  .get("/", (req, res) => res.send("OK")) /** GET /health-check - Check service health */

  .get("/login", login)
  .get("/logout", logout)
  .get("/callback", callback)
  .get("/userinfo", userInfo)
  .use("/api/user", verifyJwt, userRoutes) // mount user routes at /users
  .use("/api/chain", verifyJwt, chainRoutes) // mount chaincode routes at /chain
  .use("/api/movement", verifyJwt, movementRoutes); // mount movement routes at /movement
