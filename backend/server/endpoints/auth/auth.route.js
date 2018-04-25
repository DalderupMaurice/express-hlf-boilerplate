import { Router } from "express";
import { getAccessToken, callback } from "./auth.controller";

export default Router()
  .get("/login", getAccessToken)
  .get("/callback", callback);
