const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь океана',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    minlength: 2,
    maxlength: 72,
    validate: {
      validator(v) {
        return /^https?:\/\/w{0,3}\.?[\wа-яё/\-.]{0,}#?$/gi.test(v);
      },
      message: 'Здесь должна быть ссылка',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user; // теперь user доступен
        });
    });
}

userSchema.statics.findUserByCredentials = findUserByCredentials;

// userSchema.pre('save', function (next) {
//   return bcrypt.hash(this.password, 10)
//     .then((hash) => {
//       this.password = hash;
//       next();
//     })
//     .catch((err) => {
//       next(err);
//     });
// });

function preHashPassword(next) {
  if (!this.isModified('password')) return next();
  return bcrypt.hash(this.password, 10)
    .then((hash) => {
      this.password = hash;
      next();
    })
    .catch((err) => {
      next(err);
    });
}

userSchema.pre('save', preHashPassword);

module.exports = mongoose.model('user', userSchema);
