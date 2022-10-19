import express from "express";
import analyticsController from "../controllers/analytics";

const router = express.Router();

//////////
// Read //
//////////
router.get("/calendar", analyticsController.getCalendarCompleted);

export = router;
