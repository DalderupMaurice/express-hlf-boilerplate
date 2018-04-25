import express from "express";
import logger from "morgan";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compress from "compression";
import methodOverride from "method-override";
import cors from "cors";
import httpStatus from "http-status";
import expressWinston from "express-winston";
import expressValidation from "express-validation";
import helmet from "helmet";
import winstonInstance from "winston";
import queue from "express-queue";

import routes from "../server/index.route";
import config from "./config";
import APIError from "../server/utils/APIError";

const passport = require("passport");
const Auth0Strategy = require("passport-auth0");

const app = express();

if (config.env === "development") {
  app.use(logger("dev"));
}

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

const strategy = new Auth0Strategy(
  {
    domain: "hlf-example.eu.auth0.com",
    clientID: "KZU5JD5A2fQCZHUNnWwUhinRsrfwnqu9",
    clientSecret:
      "i8p37joZ5yBPAmECGNO0nEn_wXBNyN3mp2vCIv2OiFizqmoYqPGf_uAF0gNaPCgz",
    callbackURL: "http://localhost:3000/callback"
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    done(null, profile);
  }
);

passport.use(strategy);

app.use(passport.initialize());
app.use(passport.session());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// TODO proper queue'ing instead of blocking
app.use(queue({ activeLimit: 1, queuedLimit: -1 }));

// enable detailed API logging in dev env
if (config.env === "development") {
  expressWinston.requestWhitelist.push("body");
  expressWinston.responseWhitelist.push("body");
  app.use(
    expressWinston.logger({
      winstonInstance,
      expressFormat: true,
      colorize: true,
      meta: true, // optional: log meta data about request (defaults to true)
      msg:
        "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
      colorStatus: true // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
    })
  );
}

// mount all routes on /api path
app.use("/", routes);

// if error is not an instanceOf APIError, convert it.
app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    // validation error contains errors which is an array of error each containing message[]
    const unifiedErrorMessage = err.errors
      .map(error => error.messages.join(". "))
      .join(" and ");
    const error = new APIError(unifiedErrorMessage, err.status, true);
    return next(error);
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic);
    return next(apiError);
  }
  return next(err);
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError("API not found", httpStatus.NOT_FOUND);
  return next(err);
});

// log error in winston transports except when executing test suite
if (config.env !== "test") {
  app.use(
    expressWinston.errorLogger({
      winstonInstance
    })
  );
}

// error handler, send stacktrace only during development
app.use((err, req, res) =>
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack:
      config.env === "development" &&
      err.status === httpStatus.INTERNAL_SERVER_ERROR
        ? err.stack
        : {}
  })
);

export default app;
