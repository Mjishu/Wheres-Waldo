const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const itemSchema = new Schema({
    image:{type:String},
    name:{type:String},
    xHigh: {type:Number},
    xLow:{type:Number},
    yHigh: {type:Number},
    yLow:{type:Number},
    spotted:{type:Boolean},
    gameBoard:{type:Schema.Types.ObjectId, ref:"gameBoard"},
})

itemSchema.virtual("url").get(function(){
    return `/items/${this._id}`
})

module.exports = mongoose.model("Items", itemSchema)