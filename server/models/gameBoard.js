const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const gameBoardSchema = new Schema({
    image:{type:String},
    name:{type:String},
    alt:{type:String},
    credit:{type:String}
})

gameBoardSchema.virtual("url").get(function(){
    return `/gameBoard/${this._id}`
})

module.exports = mongoose.model("gameBoard", gameBoardSchema)