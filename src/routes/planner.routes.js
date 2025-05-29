import express from "express";
import {
  createEvento,
  getEventos,
  updateEvento,
  deleteEvento,
  getConnectedCoupleId,
} from "../controllers/plannerController.js";
import { autenticarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", autenticarToken, getEventos);
router.post("/", autenticarToken, createEvento);
router.put("/event/:id", autenticarToken, updateEvento);
router.delete("/event/:id", autenticarToken, deleteEvento);
router.get("/connected-couple", autenticarToken, getConnectedCoupleId);

export default router;
