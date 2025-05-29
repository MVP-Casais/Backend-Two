import express from "express";
import { sendResetCode, verifyResetCode, resetPassword } from "../controllers/passwordResetController.js";

const router = express.Router();

router.post("/send-code", sendResetCode);
router.post("/verify-code", verifyResetCode);
router.post("/reset", resetPassword);

export default router;
