const express = require('express');
const {registerUser, loginUser, logoutUser, adminRegister} = require('../controllers/userAuthController');
const authRouter = express.Router();
const validateUserToken = require("../middleware/userMiddleware");
const validateAdmin = require("../middleware/adminMiddleware");

// Register
authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', validateUserToken, logoutUser);
authRouter.post('/admin/register',validateAdmin, adminRegister);
// authRouter.get('/profile', profile);
//Login
//Logout
//Profile

module.exports = authRouter;