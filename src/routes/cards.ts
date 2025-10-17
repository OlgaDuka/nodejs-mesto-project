import { Router } from 'express';
import {
  createCard,
  deleteCard,
  getAllCards,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import { validateCardId, validateCreateCard } from '../middleware/validate';

const cardRouter = Router();

cardRouter.get('/', getAllCards);
cardRouter.post('/', validateCreateCard, createCard);
cardRouter.delete('/:cardId', validateCardId, deleteCard);
cardRouter.put('/:cardId/likes', validateCardId, likeCard);
cardRouter.delete('/:cardId/likes', validateCardId, dislikeCard);

export default cardRouter;
