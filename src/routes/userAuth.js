const express = require('express');
const {registerUser, loginUser, logoutUser, adminRegister, deleteProfile, userData} = require('../controllers/userAuthController');
const authRouter = express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', userMiddleware, logoutUser);
authRouter.post('/admin/register',adminMiddleware, adminRegister);
authRouter.delete('/profile', userMiddleware, deleteProfile);
authRouter.get('/check', userMiddleware, userData);

module.exports = authRouter;