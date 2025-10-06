const mongoose = require('mongoose');
const {Schema} = mongoose;

const videoSchema = new Schema({
    problemId : {
        type : Schema.Types.ObjectId,
        ref : 'problem',
        required : true
    },

    userId : {
        type : Schema.Types.ObjectId,
        ref : 'user',
        required : true
    },
    
    videoPublicId : {
        type : String,
        required : true,
        unique : true
    },
    thumbnailPublicId : {
        type : String,
        required : true,
        
    },

    videoSecureUrl : {
        type : String,
        required : true,
    },

    thumbnailSecureUrl : {
        type : String,
        required : true
    },

    duration : {
        type : Number,
        required : true
    }
},
{timestamps : true}
)

const SolutionVideo = mongoose.model('solutionVideo',videoSchema);

module.exports = SolutionVideo;