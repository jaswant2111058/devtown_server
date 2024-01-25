const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    username : {
        type: String,
        required: true
    },
    email: {
        type:String,
        unique:[true,"email already exist"],
        required: true
    },
    password:{
        type:String
    },
    events:Array
},
{
    timestamps: true
});



const Users = mongoose.model("Users", Schema);

module.exports = Users