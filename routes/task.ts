import express from "express";
import taskController from "../controllers/task";

const router = express.Router();

////////////
// Create //
////////////
// router.put("/", userController.createUser);

//////////
// Read //
//////////
// router.get("/", userController.getUsers);

// router.get("/:id", userController.getUser);

// Get just a users preferences
// router.get("/preference/:id", userController.getUserPreference);

////////////
// Update //
////////////
// router.put("/:id", userController.updateUser);

// router.put("/preference/:id", userController.updateUserPreference);

////////////
// Delete //
////////////
// router.delete("/:id", userController.deleteUser);

export = router;
