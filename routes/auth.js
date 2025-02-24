const express = require("express");

const { Authentication } = require("../middleware");
const AuthController = require("../app/auth/AuthController");
const USERS_ROUTES_PREFIX = "/auth";

const router = express.Router();

router.post(`${USERS_ROUTES_PREFIX}/sign-up`, AuthController.signup);

router.post(`${USERS_ROUTES_PREFIX}/login`, AuthController.login);

router.post(
  `${USERS_ROUTES_PREFIX}/refresh-token`,
  Authentication.authenticate,
  AuthController.refreshToken
);

module.exports = router;
