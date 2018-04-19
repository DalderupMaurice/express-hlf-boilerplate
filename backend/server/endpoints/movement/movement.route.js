import { Router } from "express";
import validate from "express-validation";

import { getOneSchema, addSchema, updateSchema } from "./movement.validation";

import { init, queryAll, queryByArgs, add, transfer } from "./movement.controller";

export default Router()
  .get("/init", init)
  .get("/query/all", queryAll)
  .get("/query/:key", validate(getOneSchema), queryByArgs)

  .post("/add", validate(addSchema), add)

  .put("/update", validate(updateSchema), transfer);

// TODO
/*
router.param("userId", load);
 */
