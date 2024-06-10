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
const Timer = require("./models/timer")

//*--------------------------------------------Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const { time } = require('console');

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

app.post("/api/coords", async(req,res)=>{
  try{
      const info = {coords:req.body.coords, id:req.body.id}
      
      const itemFound = await Items.find({_id:info.id})
      const dataCoords = {xLow: itemFound[0].xLow, xHigh:itemFound[0].xHigh, yLow:itemFound[0].yLow, yHigh: itemFound[0].yHigh}
      if(info.coords.x >= dataCoords.xLow && info.coords.x <= dataCoords.xHigh){
        if(info.coords.y >= dataCoords.yLow && info.coords.y <= dataCoords.yHigh)
          {
            res.json({message:"correct", id:info.id})
          }
      }
  }catch(err){res.status(500).json({message:"Error fetching item"})}
})

//?-----------------------------------------Timer

app.post("/api/timer", async(req,res)=>{
  const body = req.body;
  console.log(body)
})

//*------------------------------------------LeaderBoard
const dateStyle = new Intl.DateTimeFormat("en-us", {
  dateStyle: "full"
})

app.post("/api/leaderboard/add", async(req,res) => {
  try{
    const body = req.body
    // console.log(body)

    const newSubmission = new Timer({
      date: dateStyle.format(new Date()),
      gameBoard: req.body.gameBoard,
      username: body.username,
      time: req.body.time || 0.00
    })
    // await newSubmission.save() //! Turn on when timer works
    res.json({message: "created entry"})
  }catch(err){res.status(500).json({message:"Error Creating submission",err})}
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
