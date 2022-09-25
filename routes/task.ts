import express from "express";
import taskController from "../controllers/task";

const router = express.Router();

////////////
// Create //
////////////
router.post("/", taskController.createTask);

//////////
// Read //
//////////
router.get("/", taskController.getTasks);
router.get("/:id", taskController.getTask);
router.get("/user/:userId", taskController.getUsersTasks);

////////////
// Update //
////////////
router.put("/:id", taskController.updateTask);

////////////
// Delete //
////////////
router.delete("/:id", taskController.deleteTask);

export = router;
