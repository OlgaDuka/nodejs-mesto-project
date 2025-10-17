import { celebrate, Joi, Segments } from 'celebrate';
import { urlRegex } from '../const';

export const validateSignup = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    email: Joi.string().required().email()
      .messages({
        'string.email': 'Поле "email" должно быть валидным',
        'string.empty': 'Поле "email" не должно быть пустым',
        'any.required': 'Поле "email" обязательно',
      }),
    password: Joi.string().required()
      .messages({
        'string.empty': 'Пароль не должен быть пустым',
        'any.required': 'Пароль обязателен',
      }),
    avatar: Joi.string().uri(),
  }),
});

export const validateSignin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email()
      .messages({
        'string.email': 'Поле "email" должно быть валидным',
        'string.empty': 'Поле "email" не должно быть пустым',
        'any.required': 'Поле "email" обязательно',
      }),
    password: Joi.string().required()
      .messages({
        'string.empty': 'Пароль не должен быть пустым',
        'any.required': 'Пароль обязателен',
      }),
  }),
});

export const validateUserId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().hex().length(24).required()
      .messages({
        'string.hex': 'Идентификатор пользователя должен быть в hex-формате',
        'string.length': 'Идентификатор пользователя должен содержать 24 символа',
        'any.required': 'Идентификатор пользователя обязателен',
      }),
  }),
});

export const validateUpdateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .messages({
        'string.empty': 'Поле "name" не должно быть пустым',
        'string.min': 'Поле "name" должно содержать не менее 2 символов',
        'string.max': 'Поле "name" должно содержать не более 30 символов',
      }),
    about: Joi.string().min(2).max(200)
      .messages({
        'string.empty': 'Поле "about" не должно быть пустым',
        'string.min': 'Поле "about" должно содержать не менее 2 символов',
        'string.max': 'Поле "about" должно содержать не более 200 символов',
      }),
  }),
});

export const validateAvatar = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().pattern(urlRegex).required()
      .messages({
        'string.empty': 'Поле ссылки не должно быть пустым',
        'string.pattern': 'Некорректная ссылка на изображение аватара',
        'any.required': 'Ссылка на изображение аватара является обязательной',
      }),
  }),
});

export const validateCreateCard = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'any.required': 'Поле "name" является обязательным',
        'string.empty': 'Поле "name" не должно быть пустым',
        'string.min': 'Поле "name" должно содержать не менее 2 символов',
        'string.max': 'Поле "name" должно содержать не более 30 символов',
      }),
    link: Joi.string().uri().required()
      .messages({
        'string.uri': 'Некорректная ссылка на изображение карточки',
        'any.required': 'Ссылка на изображение является обязательной',
      }),
  }),
});

export const validateCardId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required()
      .messages({
        'string.hex': 'Идентификатор карточки должен быть в hex-формате',
        'string.length': 'Идентификатор карточки должен содержать 24 символа',
        'any.required': 'Идентификатор карточки обязателен',
      }),
  }),
});
