import User from './user.model';

/**
 * Load user and append to req.
 */
const load = (req, res, next, id) => {
  User.get(id).then(user => {
    req.user = user; // eslint-disable-line no-param-reassign
    return next();
  }).catch(e => next(e));
};

/**
 * Get user
 * @returns {User}
 */
const get = (req, res) => res.json(req.user);

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.password - The password of user.
 * @returns {User}
 */
const create = (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  user.save().then(savedUser => res.json(savedUser)).catch(e => next(e));
};

/**
 * Update existing user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
const update = (req, res, next) => {
  const { user } = req;
  user.username = req.body.username;
  user.password = req.body.password;

  user.save().then(savedUser => res.json(savedUser)).catch(e => next(e));
};

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
const list = (req, res, next) => {
  const _req$query = req.query;
  const _req$query$limit = _req$query.limit;
  const limit = _req$query$limit === undefined ? 50 : _req$query$limit;
  const _req$query$skip = _req$query.skip;
  const skip = _req$query$skip === undefined ? 0 : _req$query$skip;

  User.list({ limit, skip }).then(users => res.json(users)).catch(e => next(e));
};

/**
 * Delete user.
 * @returns {User}
 */
const remove = (req, res, next) => {
  const { user } = req;
  user.remove().then(deletedUser => res.json(deletedUser)).catch(e => next(e));
};

export default {
  load, get, create, update, list, remove
};
