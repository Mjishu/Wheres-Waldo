const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require("dotenv").config()
const mongoose = require("mongoose");

//?------------------------------------------- Models
const Items = require("./models/items")
const GameBoard = require("./models/gameBoard")

//*--------------------------------------------Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

//?------------------------------------------- view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//*-------------------------------------------DB Connection
mongoose.set("strictQuery", "false")
const mongoDB = process.env.MONGOURL;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

//? ------------------------------------------API calls
app.get("/api", async(req,res)=>{
  try{
    const items = await Items.find().populate('gameBoard')
    const gameBoard = await GameBoard.find()
    res.json({items,gameBoard})
  }catch(error){
    res.status(500).json({message:"error fetching from db", error})
  }
})


//* -----------------------------------------Error Handling
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
