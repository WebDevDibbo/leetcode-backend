
const mongoose = require("mongoose");
const {Schema} = mongoose;

const problemSchema = new Schema({

    title:{
        type:String,
        required:true,
    },
    description:{
        type : String,
        required:true,
    },
    difficulty:{
        type:String,
        enum : ['Easy','Medium','Hard'],
        required : true,
    },
    topics:{
        type : String,
        enum : ['array','linkedlist','graph','dp'],
        required : true,
    },
    visibleTestCases:[
        {
            input : {
                type: String,
                required : true,
            },
            output : {
                type : String,
                required : true,
            },
            explanation : {
                type : String,
                required : true,
            },
        }
    ],
    hiddenTestCases:[
        {
            input : {
                type: String,
                required : true,
            },
            output : {
                type : String,
                required : true,
            },
        }
    ],
    starterCode:[
        {
            language : {
                type : String,
                required : true,
            },
            code : {
                type : String,
                required : true,
            },
        }
    ],
    problemCreator:{
        type : Schema.Types.ObjectId,
        ref : "user",
        required : true,
    }
},{timestamps:true})

const Problem = new mongoose.model('problem',problemSchema);

module.exports = Problem;