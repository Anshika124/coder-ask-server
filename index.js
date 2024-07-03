const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
require('./src/config/config.js')
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection

// Simple route
app.get('/', (req, res) => {
    res.send('Hello World?????????????????????????/!');
});

// Import routes
// const usersRouter = require('./routes/users');
// const questionsRouter = require('./routes/questions');
// const answersRouter = require('./routes/answers');

// Use routes
// app.use('/users', usersRouter);
// app.use('/questions', questionsRouter);
// app.use('/answers', answersRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
