import { model, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import { IUser, UserModel } from '../types';
import NotAuthError from '../errors/not-auth';

const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      minLength: [2, 'Минимальная длина поля - 2'],
      maxLength: [30, 'Максимальная длина поля - 30'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minLength: [2, 'Минимальная длина поля - 2'],
      maxLength: [200, 'Максимальная длина поля - 200'],
      default: 'Исследователь',
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Поле должно быть заполнено'],
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: 'Неправильный формат почты',
      },
    },
    password: {
      type: String,
      required: [true, 'Поле должно быть заполнено'],
      minLength: [6, 'Минимальная длина поля - 6'],
      select: false,
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
  },
);

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .orFail(new NotAuthError('Неправильные почта или пароль'))
    .then((user) => bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          return Promise.reject(new NotAuthError('Неправильные почта или пароль'));
        }
        return user;
      }));
});

// @ts-ignore
export default model<IUser, UserModel>('user', userSchema);
