import { Router } from "express";
import { 
    createPlaylist, 
    addVideoToPlaylist, 
    removeVideoFromPlaylist,
    getUserPlaylists,
    getPlaylistById
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);


router.route("/").post(createPlaylist);

router.route("/user/:userId").get(getUserPlaylists);
router.route("/:playlistId").get(getPlaylistById);
router.route("/add/:playlistId/:videoId").patch(addVideoToPlaylist);
router.route("/remove/:playlistId/:videoId").patch(removeVideoFromPlaylist);

export default router;