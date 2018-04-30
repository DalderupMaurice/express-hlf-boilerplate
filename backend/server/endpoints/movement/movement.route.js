import validate from "express-validation";

import { Router } from "express";
import { getOneSchema, addSchema, updateSchema } from "./movement.validation";
import { verifyJwt } from "./../../services/auth.service";

import {
  init,
  queryAll,
  queryByArgs,
  add,
  transfer
} from "./movement.controller";

export default Router()
  .get("/init", init)
  .get("/query/all", verifyJwt, queryAll)
  .get("/query/:key", validate(getOneSchema), queryByArgs)

  .post("/add", validate(addSchema), add)

  .put("/update", validate(updateSchema), transfer);

// TODO
/*
router.param("userId", load);
 */
