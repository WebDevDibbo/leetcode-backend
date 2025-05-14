const express = require('express');
const problemRouter = express.Router();
const{ createProblem , updateProblem, deleteProblem, getAllProblems, getProblemById, getSolvedProblemsByUser} = require('../controllers/problemController');
const adminMiddleware = require("../middleware/adminMiddleware");
const userMiddleware = require("../middleware/userMiddleware");


problemRouter.post("/",adminMiddleware, createProblem);
problemRouter.put("/:id", adminMiddleware, updateProblem);
problemRouter.delete("/:id", adminMiddleware, deleteProblem);


problemRouter.get("/", userMiddleware, getAllProblems);
problemRouter.get("/:id", userMiddleware, getProblemById);
problemRouter.get("/user", userMiddleware, getSolvedProblemsByUser);

module.exports = problemRouter;