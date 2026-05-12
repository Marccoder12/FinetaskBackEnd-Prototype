const express = require("express");
const { requireAuth } = require("../middleware/auth.middleware");
const ctrl = require("../controllers/tasks.controller");

const router = express.Router();

router.get("/", requireAuth, ctrl.listTasks);
router.post("/", requireAuth, ctrl.createTask);
router.patch("/:id", requireAuth, ctrl.updateTask);
router.delete("/:id", requireAuth, ctrl.deleteTask);
router.delete("/", requireAuth, ctrl.clearTasks); // clears all for user

module.exports = router;
