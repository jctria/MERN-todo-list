const mongoose = require('mongoose');
Schema = mongoose.Schema;

const TodoSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    due_date: {
        type: String
    },
    flag: {
        type: Number
    },
    priority: { 
        type: String, 
        enum: ['', '!', '!!', '!!!'], 
        default: '' 
    },
    creation_date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Todo = mongoose.model('todo', TodoSchema);
