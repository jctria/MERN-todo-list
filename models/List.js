const mongoose = require('mongoose');
Schema = mongoose.Schema;

const ListSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    listName: {
        type: String,
        required: true
    }
})

module.exports = List = mongoose.model('list', ListSchema);