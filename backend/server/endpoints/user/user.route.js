import { Router } from "express";
import validate from "express-validation";

import { createSchema, updateSchema } from "./user.validation";
import { list, create, get, update, remove, load } from "./user.controller";

const router = Router(); // eslint-disable-line new-cap

router
  .get("/", list)
  .get("/:userId", get)

  .post("/", validate(createSchema), create)

  .put("/:userId", validate(updateSchema), update)

  .delete("/:userId", remove);

/** Load user when API with userId route parameter is hit */
router.param("userId", load);

export default router;
