import { Router } from "express";
import { login, logout, callback, verifyJwt, getDecodedJwt } from "./services/auth.service";

import chainRoutes from "./endpoints/chain/chain.route";
import movementRoutes from "./endpoints/movement/movement.route";

export default Router()
  .get("/", (req, res) => res.send("OK")) /** GET /health-check - Check service health */

  .get("/login", login)
  .get("/logout", logout)
  .get("/callback", callback)
  .get("/me", verifyJwt, getDecodedJwt)
  .use("/api/chain", verifyJwt, chainRoutes) // mount chaincode routes at /chain
  .use("/api/movement", verifyJwt, movementRoutes); // mount movement routes at /movement
