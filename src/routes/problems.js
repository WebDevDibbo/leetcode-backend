const express = require('express');
const problemRouter = express.Router();
const{ createProblem , updateProblem, deleteProblem, geAlltProblems, getProblemById} = require('../controllers/problemController');
const adminMiddleware = require("../middleware/adminMiddleware");
const userMiddleware = require("../middleware/userMiddleware");

// create // fetch // update // delete
problemRouter.post("/",adminMiddleware, createProblem);
problemRouter.put("/:id", adminMiddleware, updateProblem);
problemRouter.delete("/:id", adminMiddleware, deleteProblem);

// problemRouter.get("/", getAllProblems);
problemRouter.get("/:id", getProblemById);
// problemRouter.get("/user", getSolvedProblemsByUser);

module.exports = problemRouter;