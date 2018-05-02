import jwt from "jsonwebtoken";
import request from "superagent";
import httpStatus from "http-status";
import buildUrl from "build-url";

import config from "../../config/config";
import APIError from "../utils/APIError";

const login = (req, res) => {
  const loginUrl = buildUrl(config.AUTH0.BASE_URL, {
    path: "authorize",
    queryParams: {
      response_type: "token",
      client_id: config.AUTH0.CLIENT_ID,
      redirect_uri: config.AUTH0.CALLBACK,
      scope: config.AUTH0.ACCESS_SCOPE
    }
  });

  res.redirect(loginUrl);
};

const logout = (req, res) => {
  const logoutUrl = buildUrl(config.AUTH0.BASE_URL, {
    path: "v2/logout",
    queryParams: {
      returnTo: config.APP_HOME,
      client_id: config.AUTH0.CLIENT_ID
    }
  });

  res.redirect(logoutUrl);
};

const userInfo = (req, res, next) => {
  request
    .get(`${config.AUTH0.BASE_URL}/userinfo`)
    .set("authorization", req.headers.authorization)
    .then(response => JSON.parse(response.text))
    .catch(err => {
      if (err.status === httpStatus.UNAUTHORIZED) {
        return next(new APIError("Unauthorized. Verify access_token in headers.", httpStatus.UNAUTHORIZED));
      }
      return next(new APIError("Something went wrong when getting data.", httpStatus.INTERNAL_SERVER_ERROR));
    });
};

/**
 * Callback from oAuth login.
 */
const callback = (req, res) => {
  res.redirect(`${config.APP_HOME}`);
};

/**
 * Verify the bearer token
 */
const verifyJwt = (req, res, next) => {
  // check header or url parameters or post parameters for token
  const token = req.body.token || req.query.token || req.headers.authorization;

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.AUTH0_CLIENT_SECRET, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: "Failed to authenticate token."
        });
      }
      // if everything is good, save to request for use in other routes
      req.decoded = decoded;
      next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: "No token provided."
    });
  }
};

export { login, logout, userInfo, callback, verifyJwt };
