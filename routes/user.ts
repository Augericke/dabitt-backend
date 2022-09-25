import express from "express";
import userController from "../controllers/user";

const router = express.Router();

////////////
// Create //
////////////
// Create new user with default preferences
router.post("/", userController.createUser);

//////////
// Read //
//////////
// Get all users and their preferences
router.get("/", userController.getUsers);

// Get specific user information and their preferences
router.get("/:id", userController.getUser);

// Get just a users preferences
router.get("/preference/:id", userController.getUserPreference);

////////////
// Update //
////////////
// Update users name
router.put("/:id", userController.updateUser);

// Update users preferences
router.put("/preference/:id", userController.updateUserPreference);

////////////
// Delete //
////////////
// Cascading deletes all data related to a user (i.e preferences / categories / tasks / etc...)
router.delete("/:id", userController.deleteUser);

export = router;
