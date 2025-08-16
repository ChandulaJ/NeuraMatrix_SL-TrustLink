import { Router } from "express";
import { ServicesController } from "../controllers/ServicesController";
const router = Router();

router.post("/", ServicesController.createService);
router.get("/:id", ServicesController.getServiceById);
router.put("/:id", ServicesController.updateService);
router.delete("/:id", ServicesController.deleteService);
router.get("/", ServicesController.getAllServices);
router.get("/department/:departmentId", ServicesController.getServicesByDepartment);

export default router;
