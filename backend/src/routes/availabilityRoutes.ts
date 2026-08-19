import {Router} from "express"
import {
    createAvailability,
    getAvailabilities,
    getAvailability,
    updateAvailability,
    deleteAvailability
} from "../controllers/availabilityController";
const router = Router();
router.post("/",createAvailability);
router.get("/",getAvailabilities);
router.get("/:id",getAvailability);
router.put("/:id",updateAvailability);
router.delete("/:id",deleteAvailability);
export default router;
