import jwt from "express-jwt";
import buildUrl from "build-url";
import jwtDecode from "jwt-decode";

import config from "../../config/config";

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

/**
 * Callback from oAuth login.
 */
const callback = (req, res) => {
  res.redirect(`${config.APP_HOME}`);
};

/**
 * Verify the bearer token
 */
const verifyJwt = jwt({ secret: config.AUTH0.CLIENT_SECRET });

const getDecodedJwt = (req, res) => {
  res.json(jwtDecode(req.headers.authorization));
};

export { login, logout, callback, verifyJwt, getDecodedJwt };
