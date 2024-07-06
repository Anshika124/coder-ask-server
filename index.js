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


app.get('/', (req, res) => {
    res.send('Hello World!');
});

const userRouter = require('./src/routes/user.js');

app.use('/users', userRouter);    


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
