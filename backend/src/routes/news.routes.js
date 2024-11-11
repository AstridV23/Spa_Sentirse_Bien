import { Router } from 'express'
import { createNews, deleteNews, updateNews, getNews} from '../controllers/news.controller.js'
import {validateSchema} from '../middlewares/validator.middleware.js'
import { authRequired } from '../middlewares/validateToken.js'
import {createNewsSchema} from '../schemas/news.schema.js'

const router = Router()

router.post('/news', authRequired, validateSchema(createNewsSchema),createNews);
router.put('/news/:id', authRequired, validateSchema(createNewsSchema),updateNews);
router.delete('/news/:id', authRequired, deleteNews);
router.get('/news', getNews);

export default router