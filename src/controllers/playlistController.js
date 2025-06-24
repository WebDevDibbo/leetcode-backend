const Problem = require('../models/problem');
const Playlist = require('../models/playlist');


const createPlaylist = async (req,res)  => {

    try{

    const user_id= req.result._id;
    const {title,problemId} = req.body;
   
    
    if(!user_id || !title || !problemId)
        return res.status(400).send('something missing');

    const problem = await Problem.findById(problemId);

    if(!problem)
        return res.status(400).send('problem not found');

    // if(typeof problem === 'string') problemId = [problemId];


    const playlistResult = await Playlist.create({
        title,
        userId : user_id,
        problems: problemId,
    })

    await playlistResult.save();
    res.status(201).send("playlist created Successfully");

    }
    catch(err){
        res.status(500).json({error : "Failed to created"});
    }
}


const addProblemToPlaylist = async(req,res) => {

   try{

        const playlistId  = req.params.id;
        const problemId = req.body.problemId;
        const userId = req.result._id;

        if(!playlistId || !problemId || !userId)
            return res.status(400).send('some field is missing');


        const existingPlaylist = await Playlist.findById(playlistId);

        if(!existingPlaylist)
            return res.status(404).send('playlist not found');

        const problem = await Problem.findById(problemId);
        if(!problem)
            return res.status(400).send('problem not found');

        if(!existingPlaylist.problems.includes(problemId))
        {
            existingPlaylist.problems.push(problemId);
            await existingPlaylist.save();
        }
        res.status(201).json("problem added Successfully");
   }
   catch(err){
     res.status(500).json("failed to added");
   }



}


const getUserPlaylists = async(req,res)  => {

    try{

        const userId = req.result._id;

        if(!userId) return res.status(400).send('User not found');
        const playlists = await Playlist.find({userId});
        // console.log('playlist',playlists);
        res.status(200).json(playlists);

    }
    catch(err){
        res.status(500).json({ error: "Failed to fetch playlists" });
    }

}


const getPlaylistById = async(req,res) => {

    try{

        const {id} = req.params;

        if(!id) {
            return res.status(400).send("Field ID Missing!");
        }

        const playlist =await Playlist.findOne({_id : id, userId : req.result._id}).populate('problems');
        if(!playlist) return res.status(404).json({error :  "playlist not found"});
        res.status(200).json(playlist);
    }
    catch(err) {
        res.status(500).json({error : "Failed to fetch playlist"});
    }
}


const deletePlaylist = async(req,res) => {

    try{

        const { id } = req.params;
        if (!id) {
          return res.status(400).send("Field ID Missing!");
        }
        const deletedPlaylist = await Playlist.findOneAndDelete({
          _id: id,
          userId: req.result._id,
        });
        if (!deletedPlaylist)
          return res.status(404).json({ error: "playlist not found" });
        res.status(201).json({ message: "Playlist deleted Successfully" });

    }
    catch(err) 
    {
        res.status(500).json({error : "Failed to delete playlist"});
    }

}


const deletePlaylistProblem = async(req,res) => {

    try
    {
        const {playlistId,problemId} = req.params;
        const userId = req.result._id;

        if(!playlistId || !problemId || !userId)
            return res.status(404).send('some field missing');
    
        const getProblemPlaylist = await Playlist.findOne({_id : playlistId, userId});
        if(!getProblemPlaylist) return res.status(404).json({error : "playlist not found"});
    
        getProblemPlaylist.problems = getProblemPlaylist.problems.filter(pbId => pbId.toString() !== problemId);
        await getProblemPlaylist.save();

        res.status(201).json({message : "Problem deleted Successfully"});
    }
    catch(err)
    {
        res.status(500).json({error : err.message});
    }
    

}


module.exports = {createPlaylist, addProblemToPlaylist, getUserPlaylists, getPlaylistById, deletePlaylist, deletePlaylistProblem};