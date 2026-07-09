const express = require("express");

const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

router.route("/")
  .get(getAllCategories)
  .post(createCategory);

router.route("/:id")
  .get(getCategoryById)
  .patch(updateCategory)
  .delete(deleteCategory);

module.exports = router;