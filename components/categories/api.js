const express = require('express');
const CategoriesAuth = express.Router();
const bs = require('body-parser');
const mongoose = require('mongoose');
const validation = require('../core/validator');
const Settings = require('../settings/status');
const Path =  require('path');
const multer  = require('multer');
const Appconstants = require('../settings/constants');
const CategoriesSchema = require('../categories/private/model');
const programing_db = require('../core/db');
const categories = programing_db.model('categories', CategoriesSchema);


const app = express();
app.use(bs.json());
app.use(bs.urlencoded({extended: false}));



module.exports = CategoriesAuth;
