const express = require('express');
const authcontroller = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const authRouter = express.Router();
 
/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */

authRouter.post('/register', authcontroller.registerUsercontroller)


/**
 * @route POST /api/auth/login
 * @description Login a user with email and password
 * @access Public
 */

authRouter.post('/login', authcontroller.loginUsercontroller);


/**
 * @route POST /api/auth/logout
 * @description Logout a user and add token to blacklist
 * @access Public
 */
authRouter.post('/logout', authcontroller.logoutUsercontroller);

/**
 * @route GET /api/auth/get-me
 * @description Get the currently logged-in user's information
 * @access Private
 */
authRouter.get('/get-me', authMiddleware.authUser, authcontroller.getMeController)


module.exports = authRouter;