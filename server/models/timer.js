const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const timerSchema = new Schema({
    date: {type:Date},
    post:{type:Schema.Types.ObjectId, ref:"gameboard"},
    startTime:{type:Number},
    endTime:{type:Number},
    usernmae:{type:String}
})

timerSchema.virtual("url").get(function(){
    return `/timer/${this._id}`
})

module.exports = mongoose.model("Timer", timerSchema)