import { recommendationController } from '../controllers/recommendationController.js';
import { Router } from 'express';

const recommendationRouter = Router();

recommendationRouter.post('/', recommendationController.insert);
recommendationRouter.get('/', recommendationController.get);
recommendationRouter.get('/random', recommendationController.random);
recommendationRouter.get('/top/:amount', recommendationController.getTop);
recommendationRouter.get('/:id', recommendationController.getById);
recommendationRouter.post('/:id/upvote', recommendationController.upvote);
recommendationRouter.post('/:id/downvote', recommendationController.downvote);

export default recommendationRouter;
