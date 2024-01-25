const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');

// Route for user signup
router.post('/signup', [
    body('username').exists().withMessage('Username is required'),
    body('password').exists().withMessage('Password is required'),
    body('email').exists().withMessage('Email is required'),
], userController.signup);

// Route for user login
router.post('/login', [
    body('email').exists().withMessage('Email is required'),
    body('password').exists().withMessage('Password is required'),
], userController.login);

module.exports = router;
