const express = require("express");
const submitRouter = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const { submitCode } = require("../controllers/submissionController");


submitRouter.post('/:id', userMiddleware, submitCode)

module.exports = submitRouter;