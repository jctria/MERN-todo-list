const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('config');

// routes
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todo');
const listRoutes = require('./routes/list');

const app = express();
app.use(express.json());

// use routes
app.use('/api', authRoutes);
app.use('/api', todoRoutes);
app.use('/api', listRoutes);

// used in production to serve client files
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/dist'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname,'client','dist','index.html'));
    });
}

// connect to db and run server on port 4000
const dbURI = config.get('dbURI');
const port = process.env.PORT || 4000;
mongoose.connect(dbURI)
    .then(() => app.listen(port, () => console.log(`Server running on http://localhost:${port}`)))
    .catch((err) => console.log(err));