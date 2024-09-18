const express = require("express");
const Todo = require("../models/Todo");
const auth = require("../middleware/authMiddleware");
const { check, validationResult } = require("express-validator");

const router = express.Router();

// @route   POST /todos
// @desc    Create a to-do item
// @access  Private
router.post(
  "/",
  [auth, [check("title", "Title is required").notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newTodo = new Todo({
        user: req.user.id,
        title: req.body.title,
      });

      const todo = await newTodo.save();
      res.json(todo);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET /todos
// @desc    Get all to-dos for a user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.json(todos);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT /todos/:id
// @desc    Update a to-do
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const { title, completed } = req.body;

  try {
    let todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ msg: "To-do not found" });
    }

    // Ensure user owns the to-do
    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: { title, completed } },
      { new: true }
    );

    res.json(todo);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE /todos/:id
// @desc    Delete a to-do
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ msg: "To-do not found" });
    }

    // Ensure user owns the to-do
    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Todo.findByIdAndRemove(req.params.id);
    res.json({ msg: "To-do removed" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
