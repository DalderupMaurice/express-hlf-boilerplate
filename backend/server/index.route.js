import { Router } from "express";

import { login, callback } from "./services/auth.service";

import userRoutes from "./endpoints/user/user.route";
import chainRoutes from "./endpoints/chain/chain.route";
import movementRoutes from "./endpoints/movement/movement.route";

export default Router()
  .get("/", (req, res) => res.send("OK")) /** GET /health-check - Check service health */

  .get("/login", login)
  .get("/callback", callback)
  .use("/api/user", userRoutes) // mount user routes at /users
  .use("/api/chain", chainRoutes) // mount chaincode routes at /chain
  .use("/api/movement", movementRoutes); // mount movement routes at /movement
