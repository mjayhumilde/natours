const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!💥  Shutting Down...');
  console.log(err.name, err.message);

  //best practice for real world shits
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const { DATABASE, DATABASE_PASSWORD, PORT } = process.env;
const DB = DATABASE.replace('<PASSWORD>', DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false, // dont mind these three just use them everytime

    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection is successful!'));

const port = PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on Port ${port}...`);
});

//safety net rejection || last error catcher
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!💥  Shutting Down...');
  console.log(err.name, err.message);

  //best practice for real world shits
  server.close(() => {
    process.exit(1);
  });
});

////////////////////

// npm start = development
// npm run start:prod = production
