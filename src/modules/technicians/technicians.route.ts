import {Router} from "express";
import { techniciansController } from "./technicians.controller";
import isAuthinticated from "../../middleware/isAuthinticated";
import { UserRole } from "../../../generated/prisma/enums";
const router = Router();


router.get("/",techniciansController.GetAllTechnicians)


router.get("/:id", techniciansController.GetTechnicianById)

router.post("/profile",isAuthinticated(UserRole.TECHNICIAN), techniciansController.CreateTechnicianProfile)


export default router;