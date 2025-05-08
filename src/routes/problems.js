const express = require('express');
const problemRouter = express.Router();
const validateAdmin = require("../middleware/adminMiddleware");
const createProblem = require('../controllers/problemController');

// create // fetch // update // delete
problemRouter.post("/",validateAdmin, createProblem);
// problemRouter.patch("/:id", updateProblem);
// problemRouter.delete("/:id", deleteProblem);

// problemRouter.get("/", getAllProblem);
// problemRouter.get("/:id", getSingleProblem);
// problemRouter.get("/user", solvedProblem);

module.exports = problemRouter;