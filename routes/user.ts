import express from "express";
import userController from "../controllers/user";
import { checkJwt } from "../utils/auth0";

const router = express.Router();

////////////
// Create //
////////////
router.post("/", checkJwt, userController.createUser);

//////////
// Read //
//////////
router.get("/", userController.getUser);

////////////
// Update //
////////////
router.put("/", checkJwt, userController.updateUser);

////////////
// Delete //
////////////
// Cascading deletes all data related to a user (i.e preferences / categories / tasks / etc...)
router.delete("/", userController.deleteUser);

export = router;
