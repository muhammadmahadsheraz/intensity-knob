import {Router} from "express"
import {
    createSchedule,
    getSchedules,
    getSchedule,
    updateSchedule,
    deleteSchedule,
    completeMeeting,
    skipMeeting,
    rescheduleSkipped
} from "../controllers/scheduleControllers";
const router = Router();
router.post("/",createSchedule);
router.get("/",getSchedules);
router.put("/complete/:id",completeMeeting);
router.put("/skip/:id",skipMeeting);
router.put("/reschedule/:id",rescheduleSkipped);
router.get("/:id",getSchedule);
router.put("/:id",updateSchedule);
router.delete("/:id",deleteSchedule);
export default router;
