import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../../../config/config';

import APIError from '../../utils/APIError';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  organisation: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  enrollmentSecret: {
    type: String,
    required: true
  },
  enrollment: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */
UserSchema.pre('save', async function save(next) {
  try {
    if (!this.isModified('password')) return next();

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});


/**
 * Methods
 */
UserSchema.method({
  token() {
    return jwt.sign({
      id: this._id,
      username: this.username
    }, config.jwtSecret);
  },

  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  }
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get: function get(id) {
    return this.findById(id).exec().then(user => {
      if (user) {
        return user;
      }
      const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },

  getByUsername: function getByUsername(username) {
    return this.findOne({ username }).exec().then(user => {
      if (user) {
        const err = new APIError('User already exists!', httpStatus.BAD_REQUEST);
        return Promise.reject(err);
      }
      return Promise.resolve();
    });
  },

  async findAndGenerateToken(options) {
    const { username, password } = options;
    if (!username) throw new APIError('An username is required to generate a token');

    const user = await this.findOne({ username }).exec();
    if (password) {
      if (user && await user.passwordMatches(password)) {
        return { ...user._doc, accessToken: user.token() };
      }
    }
    throw new APIError('Incorrect username or password', httpStatus.UNAUTHORIZED, true);
  },


  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list: function list(...args) {
    const _ref = args.length > 0 && args[0] !== undefined ? args[0] : {};
    const _ref$skip = _ref.skip;
    const skip = _ref$skip === undefined ? 0 : _ref$skip;
    const _ref$limit = _ref.limit;
    const limit = _ref$limit === undefined ? 50 : _ref$limit;

    return this.find().sort({ createdAt: -1 }).skip(+skip).limit(+limit)
      .exec();
  }
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
