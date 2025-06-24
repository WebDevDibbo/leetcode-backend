const mongoose = require('mongoose');
const {Schema} = mongoose;

const PlaylistSchema = new Schema({

    title : {
        type : String,
        required : true,
        unique : true
    },
    userId:{
        type : Schema.Types.ObjectId,
        ref : "user",
        required : true
    }, 
    problems : [{
        type : Schema.Types.ObjectId,
        ref : "problem",
        required : true,
    }],

},{timestamps : true})

const Playlist = new mongoose.model('playlist',PlaylistSchema);

module.exports = Playlist;