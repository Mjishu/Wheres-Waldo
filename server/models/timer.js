const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const timerSchema = new Schema({
    date: {type:Date},
    gameBoard:{type:Schema.Types.ObjectId, ref:"gameboard"},
    time:{type:Number},
    username:{type:String}
})

timerSchema.virtual("url").get(function(){
    return `/timer/${this._id}`
})

module.exports = mongoose.model("Timer", timerSchema)