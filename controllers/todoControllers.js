const Todo = require('../models/Todo');

module.exports.get_todos = async (req, res) => {
    const userId = req.params.userId;
    try {
        const todos = await Todo.find({ userId }).sort({ date: -1 });
        res.json(todos);
    } catch (err) {
        console.error('Error fetching todos:', err);
        res.status(500).json({ error: 'Error fetching todos' });
    }
};

module.exports.get_todo = async (req, res) => {
    const todoId = req.params.id;
    try {
        const todo = await Todo.findById(todoId);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(todo);
    } catch (err) {
        console.error('Error fetching todo:', err);
        res.status(500).json({ error: 'Error fetching todo' });
    }
};

module.exports.post_todo = async (req, res) => {
    const userId = req.params.id; 
    const { listId, title, description, due_date, flag, priority } = req.body;
    try {
        const newTodo = new Todo({ userId, listId, title, description, due_date, flag, priority });
        const savedTodo = await newTodo.save();
        res.json(savedTodo);
    } catch (err) {
        console.error('Error adding todo:', err);
        res.status(500).json({ error: 'Error adding todo' });
    }
};

module.exports.update_todo = async (req, res) => {
    const todoId = req.params.id;
    const { title, description, due_date, flag, priority } = req.body;
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(todoId, { title, description, due_date, flag, priority }, { new: true });
        if (!updatedTodo) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(updatedTodo);
    } catch (err) {
        console.error('Error updating todo:', err);
        res.status(500).json({ error: 'Error updating todo' });
    }
};

module.exports.delete_todo = async (req, res) => {
    const todoId = req.params.id;
    try {
        const todo = await Todo.findByIdAndDelete(todoId);
        if (!todo) {
            return res.status(404).json({ error: 'Todo not found' });
        }   
        res.json({ success: true, message: "Todo deleted" });
    } catch (err) {
        console.error('Error deleting todo:', err);
        res.status(500).json({ error: 'Error deleting todo' });
    }
};