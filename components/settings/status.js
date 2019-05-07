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
const Categories_Config = {
  title_minlength: 3,
  title_maxlength: 100,

};
const Path_Config = {
  title_minlength: 3,
  title_maxlength: 100,
  level_minlength: 0,
  level_maxlength: 10,
  estimation_minlength: 1,
  estimation_maxlength: 30
};
const Item_Config = {
  title_minlength: 3,
  title_maxlength: 100,
  url_minlength: 1,
  url_maxlength: 50,
  content_minlength: 1,
  content_maxlength: 100,
  estimation_minlength: 0,
  estimation_maxlength: 1000,
}

module.exports.HTTPStatus = HTTPStatus;
module.exports.Config = Config;
module.exports.Item_Config = Item_Config;
module.exports.Path_Config = Path_Config;
module.exports.Categories_Config = Categories_Config;
