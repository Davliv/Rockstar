const mongoose = require('mongoose');
const Validator = require('../core/validator');
const Settings = require('../core/validator');

const HTTPStatus = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  PARAMS_INVALID: 400
};
const Config = {
  email_minlength: 4,
  email_maxlength: 25,
  password_minlength: 6,
  password_maxlength: 24,
  name_minlength: 4,
  name_maxlength: 20,
  points_minlength: 0,
  points_maxlength: 50
};
module.exports.HTTPStatus = HTTPStatus;
module.exports.Config = Config;
