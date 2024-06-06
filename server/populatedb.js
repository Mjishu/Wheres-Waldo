const userArgs = process.argv.slice(2);
  
    const Items = require("./models/items");
    const GameBoard = require("./models/gameBoard");
  
  const gameBoards = [];
  const items = [];

  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createGameboard();
    await createItems();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  async function itemsCreate(index, image,name,yHigh,yLow,xHigh,xLow,gameBoard) {
    const itemDetail = {image:image,
                        name:name,
                        yHigh:yHigh,yLow:yLow,
                        xHigh:xHigh, xLow:xLow,
                        gameBoard:gameBoard };

    const item = new Items(itemDetail);
    await item.save();
    items[index] = item;
    console.log(`Added item: ${name}`);
  }
  
  async function gameBoardCreate(index,image, alt){
    const gameboardDetails = {image:image, alt:alt}

    const gameboard = new GameBoard(gameboardDetails);
    await gameboard.save();
    gameBoards[index] = gameboard;
    console.log(`Added gameBoard: ${alt}`)
  }
  
  async function createGameboard() {
    console.log("Adding Gameboard");
    await Promise.all([
      gameBoardCreate("images/LOTR/SAF-LOTRrere.png", "LOTR search and find image")
    ]);
  }
  
  
  async function createItems(){
    console.log("adding items")
    await Promise.all([
        itemsCreate(0,"images/LOTR/EOS.png","Eye of Sauron",90,45,1450,1400,gameBoards[0]),
        itemsCreate(1,"images/LOTR/skully.png","Skully",440,400,575,550,gameBoards[0]),
        itemsCreate(2,"images/LOTR/demonBlob.png","Demon Eyes",390,350,1450,1400,gameBoards[0]),
    ])
  }
