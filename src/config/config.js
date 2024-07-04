require('dotenv').config();

const mongoose = require('mongoose');
mongoose.set("strictQuery", true);
const databaseUrl = process.env.MONGODB_URI;

mongoose.connect(databaseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to database');
}).catch((error) => {
  console.error(error);
});      