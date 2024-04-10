const List = require('../models/List');
const Todo = require('../models/Todo'); 

module.exports.get_lists = async (req, res) => {
    const userId = req.params.userId;
    try {
        const lists = await List.find({ userId }).sort({ date: -1 });
        res.json(lists);
    } catch (err) {
        console.error('Error fetching lists:', err);
        res.status(500).json({ error: 'Error fetching lists' });
    }
};

module.exports.get_list = async (req, res) => {
    const listId = req.params.id;
    try {
        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }
        res.json(list);
    } catch (err) {
        console.error('Error fetching list:', err);
        res.status(500).json({ error: 'Error fetching list' });
    }
};

module.exports.post_list = async (req, res) => {
    const userId = req.params.id; 
    const { listName } = req.body;
    try {
        const newList = new List({ userId, listName });
        const savedList = await newList.save();
        res.json(savedList);
    } catch (err) {
        console.error('Error creating new list:', err);
        res.status(500).json({ error: 'Error creating new list' });
    }
};

module.exports.update_list = async (req, res) => {
    const listId = req.params.id;
    const { listName } = req.body;
    try {
        const updatedList = await List.findByIdAndUpdate(listId, { listName }, { new: true });
        if (!updatedList) {
            return res.status(404).json({ error: 'List not found' });
        }
        res.json(updatedList);
    } catch (err) {
        console.error('Error updating list:', err);
        res.status(500).json({ error: 'Error updating list' });
    }
};

module.exports.delete_list = async (req, res) => {
    const listId = req.params.id;
    try {
        const list = await List.findByIdAndDelete(listId);
        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }        
        // Delete all todos associated with the list
        await Todo.deleteMany({ listId: listId });
        res.json({ success: true, message: "List and associated todos deleted" });
    } catch (err) {
        console.error('Error deleting list and todos:', err);
        res.status(500).json({ error: 'Error deleting list and todos' });
    }
};