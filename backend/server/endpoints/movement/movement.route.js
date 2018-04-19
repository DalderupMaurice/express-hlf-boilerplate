import { Router } from "express";
import {
  init,
  queryAll,
  queryByArgs,
  add,
  transfer
} from "./movement.controller";

export default Router()
  .get("/init", init)
  .get("/query/all", queryAll)
  .get("/query/:key", queryByArgs)
  .post("/add", add)
  .put("/update", transfer);
