const mongoose = require("mongoose");
const {Schema} = mongoose;

const SubmissionSchema = new Schema({

    userId:{
        type : Schema.Types.ObjectId,
        ref : "user",
        required : true
    }, 
    problemId : {
        type : Schema.Types.ObjectId,
        ref : "problem"
    },
    code : {
        type : String,
        required : true
    },
    language : {
        type : String,
        enum : ["c++", "javascript", "java"],
        required : true
    },
    status : {
        type : String,
        enum : ['pending', 'wrong', 'accepted','error'],
        default : 'pending'
    },
    runtime : {
        type : Number,
        default : 0
    },
    memory : {
        type : Number,
        default : 0
    },
    errorMessage : {
        type : String,
        default : ''
    },
    testCasePassed : {
        type : Number,
        default : 0
    },
    testCaseTotal : {
        type : Number,
        default : 0
    },
},{timestamps:true});

SubmissionSchema.index({userId:1 , problemId:1});

const Submission = new mongoose.model('submission',SubmissionSchema);

module.exports = Submission;