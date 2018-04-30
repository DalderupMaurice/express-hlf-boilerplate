import jwt from "jsonwebtoken";
import config from "../../config/config";

const Auth0Strategy = require("passport-auth0");
const passport = require("passport");
const request = require("superagent");

const strategy = new Auth0Strategy(
  {
    domain: config.AUTH0.DOMAIN,
    clientID: config.AUTH0.CLIENT_ID,
    clientSecret: config.AUTH0.CLIENT_SECRET,
    callbackURL: config.AUTH0.CALLBACK
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    done(null, profile);
  }
);

passport.use(strategy);

// This can be used to keep a smaller payload
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const login = passport.authenticate("auth0");

const logout = (req, res) => {
  res.redirect(`${config.AUTH0.LOGOUT}?returnTo=${config.APP_HOME}&client_id=${config.AUTH0.CLIENT_ID}`);
};

/**
 * Callback from oAuth login. Use the access code to obtain the bearer token
 */
const callback = (req, res) => {
  const options = {
    uri: config.AUTH0.TOKEN_URL,
    body: {
      grant_type: config.AUTH0.GRANT_TYPE,
      client_id: config.AUTH0.CLIENT_ID,
      client_secret: config.AUTH0.CLIENT_SECRET,
      code: req.query.code,
      redirect_uri: config.AUTH0.CALLBACK
    }
  };

  request
    .post(options.uri)
    .send(options.body) // sends a JSON post body
    .set("accept", "json")
    .end((err, response) =>
      // TODO: User create code
      res.redirect(`${config.APP_HOME}?code=${JSON.parse(response.text).id_token}`)
    );
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

export { login, logout, callback, verifyJwt };
