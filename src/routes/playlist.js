const express = require('express');
const playlistRouter = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const {createPlaylist, addProblemToPlaylist, getUserPlaylists, getPlaylistById, deletePlaylist, deletePlaylistProblem} = require('../controllers/playlistController');



playlistRouter.post('/', userMiddleware, createPlaylist);
playlistRouter.post('/:id', userMiddleware, addProblemToPlaylist);
playlistRouter.get('/', userMiddleware, getUserPlaylists);
playlistRouter.get('/:id', userMiddleware, getPlaylistById);
playlistRouter.delete('/:id', userMiddleware, deletePlaylist);
playlistRouter.delete('/:playlistId/problems/:problemId', userMiddleware, deletePlaylistProblem);


module.exports = playlistRouter;