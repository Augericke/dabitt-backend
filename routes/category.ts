import express from "express";
import categoryController from "../controllers/category";

const router = express.Router();

////////////
// Create //
////////////
router.put("/", categoryController.createCategory);

//////////
// Read //
//////////
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategory);

// Get all categories and tasks for a specific user
router.get("/user/:userId", categoryController.getUsersCategories);

////////////
// Update //
////////////
router.put("/:id", categoryController.updateCategory);

////////////
// Delete //
////////////
// Cascading deletes all data related to a category (i.e tasks)
router.delete("/:id", categoryController.deleteCategory);

export = router;
