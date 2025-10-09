import { Router } from 'express';
import {
  createCard,
  deleteCard,
  getAllCards,
  likeCard,
  dislikeCard,
} from '../controllers/cards';

const cardRouter = Router();

cardRouter.get('/', getAllCards);
cardRouter.delete('/:cardId', deleteCard);
cardRouter.post('/', createCard);
cardRouter.put('/:cardId/likes', likeCard);
cardRouter.delete('/:cardId/likes', dislikeCard);

export default cardRouter;
