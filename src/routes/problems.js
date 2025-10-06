const express = require('express');
const problemRouter = express.Router();
const{ createProblem , updateProblem, deleteProblem, getAllProblems, getProblemById, getSolvedProblemsByUser, submittedProblem, likeProblem, removeLikedProblem} = require('../controllers/problemController');
const adminMiddleware = require("../middleware/adminMiddleware");
const userMiddleware = require("../middleware/userMiddleware");


problemRouter.post("/",adminMiddleware, createProblem);
problemRouter.put("/:id", adminMiddleware, updateProblem);
problemRouter.delete("/:id", adminMiddleware, deleteProblem);


problemRouter.get("/problemSolvedByUser", userMiddleware, getSolvedProblemsByUser);
problemRouter.get('/submittedProblem/:pid', userMiddleware, submittedProblem);
problemRouter.get("/", userMiddleware, getAllProblems);
problemRouter.get("/:id", userMiddleware, getProblemById);
problemRouter.patch('/:id/like', userMiddleware, likeProblem);
problemRouter.patch('/:id/unlike', userMiddleware, removeLikedProblem);

module.exports = problemRouter;