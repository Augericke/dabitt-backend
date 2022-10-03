import express from "express";
import userController from "../controllers/user";
import { checkJwt } from "../utils/auth0";

const router = express.Router();

////////////
// Create //
////////////
// Create new user with default preferences
router.post("/", checkJwt, userController.createUser);

//////////
// Read //
//////////

// Get specific user information and their preferences
router.get("/user", userController.getUser);

// Get just a users preferences
router.get("/preference/:id", userController.getUserPreference);

////////////
// Update //
////////////
// Update users name
router.put("/", checkJwt, userController.updateUser);

////////////
// Delete //
////////////
// Cascading deletes all data related to a user (i.e preferences / categories / tasks / etc...)
router.delete("/", userController.deleteUser);

export = router;
