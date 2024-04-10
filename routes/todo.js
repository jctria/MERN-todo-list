const { Router } = require('express');
const todoController = require('../controllers/todoControllers');
const router = Router();

router.get('/todos/user/:userId', todoController.get_todos);
router.get('/todos/:id', todoController.get_todo);
router.post('/todos/:id', todoController.post_todo);
router.put('/todos/:id', todoController.update_todo);
router.delete('/todos/:id', todoController.delete_todo);

module.exports = router;