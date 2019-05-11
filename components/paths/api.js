const express = require('express');
const PathsAuth = express.Router();
const bs = require('body-parser');
const validation = require('../core/validator');
const Settings = require('../settings/status');
const PathSchema = require('../paths/private/model');
const programing_db = require('../core/db');
const paths = programing_db.model('paths', PathSchema);
const app = express();


app.use(bs.json());
app.use(bs.urlencoded({extended: false}));

module.exports = PathsAuth;

PathsAuth.post('/', (req, res) => {
  const {title,items,level,estimation,category,tags }= req.body;
    if (!title || !category) {
      return res.send({success:false,msg:'Missing required parametr'}).status(Settings.HTTPStatus.PARAMS_INVALID)
    }
    if (!validation.validateTitle(title)) {
      return res.send({success:false,msg:'Not valid title'}).status(Settings.HTTPStatus.PARAMS_INVALID);
    }  
    if (level && !validation.validateLevel(level)) {
      return res.send({success:false,msg:'Not valid level'}).status(Settings.HTTPStatus.PARAMS_INVALID);
    }
    if (estimation && !validation.validateEstimation(estimation)) {
      return res.send({success:false,msg:'Not valid estimation'}).status(Settings.HTTPStatus.PARAMS_INVALID);
    }
    paths.create({
        title,
        items,
        level,
        estimation,
        category,
        tags
      }, (err) => {
        if (err) return res.send({success:false,msg:'Server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
        else res.send({success:true,msg:'Path created'}).status(Settings.HTTPStatus.OK);
    });
});

PathsAuth.put('/:id/category',async (req, res) => {
  const { id } = req.params;
  const { category }= req.body;
  if (!category || !id) {
      return res.send({success:false,msg:'missing reqiure parameter'}).status(Settings.HTTPStatus.PARAMS_INVALID);
  }
  await paths.update(
    { _id: id }, 
    { $push: { category } },
    (err)=>{
      if (err) res.send({success:false,msg:'Server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
      else res.send({success:true,msg:'path is updated'}).status(Settings.HTTPStatus.OK);
    }
  );
  // let path = await paths.findById(id);
  // path.category.push(category);
  // path.save( (err)=> {
  //     if (err) return res.send({success:false,msg:'Server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
  //     else  res.send({success:true,msg:'path is updated'}).status(Settings.HTTPStatus.OK);
  // });
})


PathsAuth.put('/:id/tags',(req, res) => {
  const { id } = req.params;
  const { tag }= req.body;
  if (!tag || !id) {
      return res.send({success:false,msg:'missing reqiure parameter'}).status(Settings.HTTPStatus.PARAMS_INVALID);
  }
  console.log(tag)
  paths.update(
    { _id: id }, 
    { $push: { tags:tag } },
    (err)=>{
      if (err) res.send({success:false,msg:'Server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
      else res.send({success:true,msg:'path is updated'}).status(Settings.HTTPStatus.OK);
    }
  );
})