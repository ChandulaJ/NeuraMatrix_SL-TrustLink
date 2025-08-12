import { Router } from "express";
import { AppointmentController } from "../controllers/AppointmentController";

const router = Router();

router.post("/", AppointmentController.create);
router.patch("/:id/status", AppointmentController.updateStatus);
router.get("/user/:userId", AppointmentController.getUserAppointments);
router.delete("/:id", AppointmentController.deleteAppointment);

export default router;
