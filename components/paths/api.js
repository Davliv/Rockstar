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

PathsAuth.post('/', (req, res) => {
  const {title,items,level,estimation,category,tags }= req.body;
    if (title && category) {
        if (!validation.validateTitle(title)) {
            return res.send({success:false,msg:'Not valid title'}).status(Settings.HTTPStatus.PARAMS_INVALID);
        }

        }
      paths.create({
        title: title,
        items: items,
        level: level,
        estimation: estimation,
        category: category,
        tags: tags
      }, (err, result) => {
      if (err) return res.send({success:false,msg:'Server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
      else res.send({success:true,msg:'Path created'}).status(Settings.HTTPStatus.OK);
    });
});

module.exports = PathsAuth;
