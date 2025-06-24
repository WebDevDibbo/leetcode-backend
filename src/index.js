const express = require('express')
const app = express();
require('dotenv').config();
const main =  require('./config/db')
const cookieParser =  require('cookie-parser');
const authRouter = require('./routes/userAuth');
const redisClient = require("./config/redis");
const problemRouter = require("./routes/problems");
const submitRouter = require('./routes/submission');
const aiRouter = require('./routes/chatWithAi');
const playlistRouter = require('./routes/playlist');
const cors = require('cors');


app.use(cors({
    origin : 'http://localhost:5173',
    credentials : true
}))

app.use(express.json());
app.use(cookieParser());


app.use('/api/users', authRouter);
app.use('/api/problems', problemRouter);
app.use('/api/submission', submitRouter);
app.use('/api/playlists', playlistRouter);
app.use('/api/ai', aiRouter);



const initializeConnection = async(req,res) => {

    try{

        await Promise.all([main(), redisClient.connect()]);
        console.log("DB Connected");
        app.listen(process.env.PORT, ()=>{
            console.log("Server listening at port number: "+ process.env.PORT);
        })
    }
    catch(err){
        console.log("Error Occured : ", err);
    }
}

initializeConnection();

