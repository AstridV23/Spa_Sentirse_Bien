import { Router } from 'express'
import { createComment, deleteComment, getComments} from '../controllers/comment.controller.js'
import { authRequired } from '../middlewares/validateToken.js'
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createCommentSchema } from "../schemas/comment.schema.js";

const router = Router()

router.post('/comment',validateSchema(createCommentSchema),createComment);

router.delete('/comment/:id',authRequired, deleteComment);

router.get('/comment', getComments);

export default router