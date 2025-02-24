const express = require("express");

const { Authentication } = require("../middleware");
const UserController = require("../app/user/UserController");
const USERS_ROUTES_PREFIX = "/users";

const router = express.Router();

router.get(
  `${USERS_ROUTES_PREFIX}/me`,
  Authentication.authenticate,
  UserController.getUser
);

module.exports = router;
