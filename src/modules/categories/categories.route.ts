import { Router } from "express";

import isAuthinticated from "../../middleware/isAuthinticated";
import { UserRole } from "../../../generated/prisma/enums";
import { CategoriesController } from "./categories.controller";

const router = Router();

router.post("/create",isAuthinticated(UserRole.ADMIN), CategoriesController.CreateACategory);


router.get("/", CategoriesController.GetAllCategories);




export default router;
