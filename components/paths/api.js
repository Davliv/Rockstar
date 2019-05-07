const express = require('express');
const PathsAuth = express.Router();
const bs = require('body-parser');
const mongoose = require('mongoose');
const validation = require('../core/validator');
const Settings = require('../settings/status');
const Appconstants = require('../settings/constants');
const PathSchema = require('../paths/private/model');
const programing_db = require('../core/db');
const paths = programing_db.model('paths', PathSchema);


const app = express();
app.use(bs.json());
app.use(bs.urlencoded({extended: false}));



module.exports = PathsAuth;
