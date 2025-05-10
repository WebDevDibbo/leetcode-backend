const express = require('express');
const {registerUser, loginUser, logoutUser, adminRegister} = require('../controllers/userAuthController');
const authRouter = express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Register
authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', userMiddleware, logoutUser);
authRouter.post('/admin/register',adminMiddleware, adminRegister);
// authRouter.get('/profile', profile);
//Login
//Logout
//Profile

module.exports = authRouter;