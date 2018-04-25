import config from "../../../config/config";

import jwt, { sign } from "express-jwt";
import jwtAuthz from "express-jwt-authz";
import { expressJwtSecret } from "jwks-rsa";

import httpStatus from "http-status";
import APIError from "../../utils/APIError";

const passport = require("passport");

const request = require("superagent");

/**
 * Redirect to the auth0 login page
 */
const getAccessToken = passport.authenticate("auth0", {
  clientID: config.AUTH0_CLIENTID,
  domain: config.env.AUTH0_DOMAIN,
  redirectUri: "http://localhost:3000/callback",
  responseType: "code",
  scope: "openid profile email"
});

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
      return res.json(response.text);
    });
};

export { getAccessToken, callback };
