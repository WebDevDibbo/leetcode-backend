const express = require('express');
const problemRouter = express.Router();

// create // fetch // update // delete
problemRouter.post("/",problemCreate);
problemRouter.patch("/:id", updateProblem);
problemRouter.delete("/:id", deleteProblem);

problemRouter.get("/", getAllProblem);
problemRouter.get("/:id", getSingleProblem);
problemRouter.get("/user", solvedProblem);