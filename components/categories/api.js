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


CategoriesAuth.post('/', (req, res) => {
  const {title,description,type }= req.body;
    if (title && type) {
      if (!validation.validateTitle(title)) {
          return res.send({success:false,msg:'Not valid title'}).status(Settings.HTTPStatus.PARAMS_INVALID);
      }
      if (!validation.validateCategoriesType(type)) {
          return res.send({success:false,msg:'Not valid type'}).status(Settings.HTTPStatus.PARAMS_INVALID);
      }
      if (!validation.validateDescription(description)) {
          return res.send({success:false,msg:'Not valid description'}).status(Settings.HTTPStatus.PARAMS_INVALID);
      }
    }
    categories.create({
      title: title,
      description: description,
      type: type
    },(err) => {
      if (err) return res.send({success:false,msg:'Server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
      else res.send({success:true,msg:'categories created'}).status(Settings.HTTPStatus.OK);
    });
});

CategoriesAuth.post('/:id/image', async (req, res) => {
          const catogoriesId=req.params.id;
          const {imagee}=req.body;
          if (!catogoriesId && !image) return res.send({success:false,msg:'missing require parameter'}).status(Settings.HTTPStatus.PARAMS_INVALID);
          let categorie = await categories.findById(catogoriesId);
          if (!categorie)return res.send({success:false,msg:'missing require parameter'}).status(Settings.HTTPStatus.NOT_FOUND);
          categorie.image.push(imagee);
          categorie.save(
            (err)=> {
              if (err) return res.send({success:false,msg:'Server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
              else  res.send({success:true,msg:'image added'}).status(Settings.HTTPStatus.OK);
    });
});

module.exports = CategoriesAuth;
