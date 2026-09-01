import {Router} from "express"
import {
    createMeeting,
    getMeetings,
    getMeeting,
    updateMeeting,
    deleteMeeting
} from "../controllers/meetingsController";
const router = Router();
router.post("/",createMeeting);
router.get("/:id",getMeetings);
router.put("/:id",updateMeeting);
router.delete("/:id",deleteMeeting);
export default router;
