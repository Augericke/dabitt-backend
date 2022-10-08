import express from "express";
import taskController from "../controllers/task";

const router = express.Router({ mergeParams: true });

////////////
// Create //
////////////
router.post("/", taskController.createTask);

//////////
// Read //
//////////
router.get("/", taskController.getTasks);

////////////
// Update //
////////////
router.put("/:id", taskController.updateTask);

////////////
// Delete //
////////////
router.delete("/:id", taskController.deleteTask);

export = router;
