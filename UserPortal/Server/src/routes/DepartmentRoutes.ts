import { Router } from "express";
import { DepartmentController } from "../controllers/DepartmentController";

const router = Router();

router.post("/", DepartmentController.createDepartment);
router.get("/:id", DepartmentController.getDepartmentById);
router.put("/:id", DepartmentController.updateDepartment);
router.delete("/:id", DepartmentController.deleteDepartment);
router.get("/", DepartmentController.getAllDepartments);

export default router;
