import httpStatus from 'http-status';

import APIError from '../../utils/APIError';
import network from '../../services/network.service';
import User from '../user/user.model';


const register = (req, res, next) => {
  const user = new User({
    username: req.body.username,
    organisation: req.body.organisation,
    password: req.body.password
  });

  // Persist if user exists
  User.getByUsername(req.body.username)
    .then(async () => {
      const updatedUser = await network.register(user);
      updatedUser.save();
    })
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
};

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const login = async (req, res, next) => {
  const userWithToken = await User.findAndGenerateToken(req.body).catch(e => next(e));

  if (userWithToken) {
    const test = await network.login(userWithToken).catch(e => next(e));
    return res.json(userWithToken + test);
  }

  const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED, true);
  return next(err);
};

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
const getRandomNumber = (req, res) =>
  // req.user is assigned by jwt middleware if valid token is provided
  res.json({
    user: req.user,
    num: Math.random() * 100
  });

export default { login, register, getRandomNumber };
