require("dotenv").config()
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors')
const client =require("./postgreClient/client")

const taskRouter = require('./routes/taskRouter');
const authRouter = require('./routes/userRouter');



const app = express();



mongoose.set('strictQuery', true)
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));



    
app.use(
    cors({
        origin: "*",
        exposedHeaders: 'Authorization'
    })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', taskRouter);
app.use('/', authRouter);


client.connect()
  .then(() => { 
    console.log('Connected to PostgreSQL');
    
  })
  .catch((error) => {
    console.error('Error connecting to PostgreSQL database', error);
  })

app.listen(process.env.PORT || '5000', () => {
    console.log(`Server started at port ${process.env.PORT || '5000'}`);
});