import config from "../../../config/config";

import jwt from "jsonwebtoken";

import { Router } from "express";

const passport = require("passport");
const request = require("superagent");

/**
 * Redirect to the auth0 login page and obtain an access code
 */
const getAccessToken = passport.authenticate("auth0", {
  clientID: config.AUTH0_CLIENTID,
  domain: config.env.AUTH0_DOMAIN,
  redirectUri: "http://localhost:3000/callback",
  responseType: "code",
  scope: "openid profile email"
});

/**
 * Callback from oAuth login. Use the access code to obtain the bearer token
 */
const callback = (req, res) => {
  const options = {
    uri: "https://hlf-example.eu.auth0.com/oauth/token",
    body: {
      grant_type: "authorization_code",
      client_id: "KZU5JD5A2fQCZHUNnWwUhinRsrfwnqu9",
      client_secret:
        "i8p37joZ5yBPAmECGNO0nEn_wXBNyN3mp2vCIv2OiFizqmoYqPGf_uAF0gNaPCgz",
      code: req.query.code,
      redirect_uri: "http://localhost:3000/callback"
    }
  };

  request
    .post(options.uri)
    .send(options.body) // sends a JSON post body
    .set("accept", "json")
    .end((err, response) => {
      // Calling the end function will send the request
      console.log("RESULT OF GET TOKEN", response.text);
      return res.redirect(
        `http://localhost:1234?code=${JSON.parse(response.text).id_token}`
      );
    });
};

/**
 * Verify the bearer token
 */
// route middleware to verify a token
const verifyJwt = (req, res, next) => {
  // check header or url parameters or post parameters for token
  const token = req.body.token || req.query.token || req.headers.authorization;

  // decode token
  if (token) {
    console.log(`èzfzefzefze`, token);

    // verifies secret and checks exp
    jwt.verify(
      token,
      "i8p37joZ5yBPAmECGNO0nEn_wXBNyN3mp2vCIv2OiFizqmoYqPGf_uAF0gNaPCgz",
      (err, decoded) => {
        if (err) {
          console.log(err);
          return res.json({
            success: false,
            message: "Failed to authenticate token."
          });
        }
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    );
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: "No token provided."
    });
  }
};

export { getAccessToken, callback, verifyJwt };
