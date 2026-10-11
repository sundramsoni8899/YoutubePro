import {Router} from 'express';
import { publishAVideo
    ,
    getVideoById,
    updateVideoDetails,
    deleteVideo,
    getAllVideos
 } from '../controllers/video.controller.js';

import { verifyJWT } from '../middlewares/auth.middleware.js';

import { upload } from '../middlewares/multer.middlewares.js';

const router = Router();

router.use(verifyJWT);

router.route("/publish").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]), 
    publishAVideo
)

router.route("/:videoId")
    .get(getVideoById)
    .patch(upload.single("thumbnail"), updateVideoDetails)
    .delete(deleteVideo)

router.route("/").get(getAllVideos);

export default router;