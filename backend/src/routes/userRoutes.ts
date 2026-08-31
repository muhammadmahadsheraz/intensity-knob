import { Router } from "express";
import {
    createUser,
    loginUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
} from "../controllers/userController";

const router = Router();

router.post("/signup", createUser);
router.post("/login", loginUser);

router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;