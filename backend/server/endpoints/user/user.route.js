import { Router } from "express";

import { getMe } from "./user.controller";

export default Router().get("/me", getMe);
