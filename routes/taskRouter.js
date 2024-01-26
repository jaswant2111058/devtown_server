const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const taskController = require('../controllers/taskController');

// Route for user signup

router.get('/show/board', userController.authMiddleware,taskController.showBoard);

// Route for user login
router.post('/create/board',[
    body('name').exists().withMessage('Board name is required'),
],userController.authMiddleware,taskController.createBoard);


router.post('/create/column',[body('name').exists().withMessage('Column name is required'),
],userController.authMiddleware, taskController.createColumn);


router.post('/create/task',[
    body('column_id').exists().withMessage('column_id is required'),
    body('subtask_title').exists().withMessage('subtask_title is required'),
    body('title').exists().withMessage('title is required'),
    body('description').exists().withMessage('description is required'),
    body('status').exists().withMessage('status is required'),
],userController.authMiddleware,taskController.createTask);





router.post('/update/board',[
    body('name').exists().withMessage('Board name is required'),
    body('board_id').exists().withMessage('board_id is required'),
],userController.authMiddleware,taskController.updateBoard);





router.post('/update/column',[
    body('name').exists().withMessage('Column name is required'),
    body('column_id').exists().withMessage('Column column_id is required'),
],userController.authMiddleware, taskController.updateColumn);


router.post('/update/task',[
    body('column_id').exists().withMessage('column_id is required'),
    body('subtask_title').exists().withMessage('subtask_title is required'),
    body('title').exists().withMessage('title is required'),
    body('description').exists().withMessage('description is required'),
    body('status').exists().withMessage('status is required'),
    body('task_id').exists().withMessage('task_id is required'),
    body('subtask_id').exists().withMessage('subtask_id is required'),
],userController.authMiddleware,taskController.updateTask);



router.post('/delete/board',[
   
    body('board_id').exists().withMessage('board_id is required'),
],userController.authMiddleware,taskController.deleteBoard);

router.post('/delete/column',[
   
    body('column_id').exists().withMessage('column_id is required'),
],userController.authMiddleware,taskController.deleteColumn);

router.post('/delete/task',[
   
    body('task_id').exists().withMessage('task_id is required'),
],userController.authMiddleware,taskController.deleteTask);







module.exports = router;
