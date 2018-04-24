const express = require("express");
const passport = require("passport");

const router = express.Router();

const env = {
  AUTH0_CLIENT_ID: "KZU5JD5A2fQCZHUNnWwUhinRsrfwnqu9",
  AUTH0_DOMAIN: "hlf-example.eu.auth0.com",
  AUTH0_CALLBACK_URL: "http://localhost:3000/api/auth/callback"
};

// Perform the login
router.get(
  "/login",
  passport.authenticate("auth0", {
    clientID: env.AUTH0_CLIENT_ID,
    domain: env.AUTH0_DOMAIN,
    redirectUri: env.AUTH0_CALLBACK_URL,
    audience: `https://${env.AUTH0_DOMAIN}/userinfo`,
    responseType: "code",
    scope: "openid"
  }),
  (req, res) => {
    res.redirect("/");
  }
);

// Perform session logout and redirect to homepage
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Perform the final stage of authentication and redirect to '/user'
router.get(
  "/callback",
  passport.authenticate("auth0", {
    failureRedirect: "/"
  }),
  (req, res) => {
    req.session.returnTo = "http:localhost:1234/";
    res.redirect(req.session.returnTo || "http://localhost:1234");
  }
);

export default router;
