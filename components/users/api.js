const express = require('express');
const UsersAuth = express.Router();
const bs = require('body-parser');
const mongoose = require('mongoose');
const validation = require('../core/validator');
const Settings = require('../settings/status');
const Key = require('../users/key');
const keygen = require('keygenerator');
const Path =  require('path');
const multer  = require('multer');
const Appconstants = require('../settings/constants');
const UserSchema = require('../users/private/model');
const programing_db = require('../core/db');
const users = programing_db.model('users', UserSchema);


const app = express();
app.use(bs.json());
app.use(bs.urlencoded({extended: false}));

const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req,file,cb) => {
    console.log(file);
    cb(null,file.fieldname + "-" + Date.now() + Path.extname(file.originalname));
  }
});
const upload = multer({
    storage: storage,
    fileFilter: function(req,file,cb) {
    const fileType = /jpeg|jpg|gif|png/;
    const extName = fileType.test(Path.extname(file.originalname).toLowerCase());
    const mimeType = fileType.test(file.originalname);
    if (extName && mimeType) return cb(null,true);
    else cb("Must be image only");
  }
}).single('avatar');

UsersAuth.post('/upload/:id',(req, res) => {
  if (!req.params.id) return res.send({success:false,msg:'Id not exist'}).status(Settings.HTTPStatus.PARAMS_INVALID);
  upload(req,res,(err) => {
      if (err) return res.send({success:false,msg:err}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
      if (!req.file) return res.send({success:false,msg:'File not exist'}).status(Settings.HTTPStatus.PARAMS_INVALID);
      if (!req.params.id) return res.send({success:false,msg:'Id not exist'}).status(Settings.HTTPStatus.PARAMS_INVALID);
  users.findById(req.params.id, function (err, user) {
      if (err) return res.send({success:false,msg:err}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
      if (!user)  return res.send({success:false,msg:'User not found'}).status(Settings.HTTPStatus.NOT_FOUND);
  user.avatar = req.file.filename;
  user.save(function(err, doc, numbersAffected) {
      if (err) return res.send({success:false,msg:err}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
      else return res.send({success:true,msg:'file success created'}).status(Settings.HTTPStatus.OK);
        });
      });
    });
  });


UsersAuth.post('/', (req, res) => {
  const {name,email,password }= req.body;
    if (name && email && password) {
        if (!validation.validateName(name)) {
            return res.send({success:false,msg:'Not valid name'}).status(Settings.HTTPStatus.PARAMS_INVALID);
        }
        if (!validation.validatePassword(password)) {
            return res.send({success:false,msg:'Not valid password'}).status(Settings.HTTPStatus.PARAMS_INVALID);
        }
        if (!validation.validateEmail(email)) {
            return res.send({success:false,msg:'Not valid email'}).status(Settings.HTTPStatus.PARAMS_INVALID);
        }
        }else{
          return res.send({success:false,msg:'missing require parameter'}).status(Settings.HTTPStatus.PARAMS_INVALID);
    }
    users.create({
        name: name,
        password: password,
        email: email,
        role: req.body.role
      }, (err, result) => {
      if (err) return res.send({success:false,msg:'Server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
      else res.send({success:true,msg:'User created'}).status(Settings.HTTPStatus.OK);
    });
});

UsersAuth.get('/:id/following', (req, res) => {
        if (!req.params) return res.send('no params').status(Settings.HTTPStatus.NOT_FOUND);
    users.find({
      }, (err, result) => {
        if (err) return res.send({success:false,msg:'Server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
        return res.send(result).status(Settings.HTTPStatus.OK);
      });
    });

UsersAuth.post('/:id/following', async (req, res) => {
  const userId=req.params.id;
  const {folowerId}=req.body;
  if (!userId && !folowerId) return res.send({success:false,msg:'missing require parameter'}).status(Settings.HTTPStatus.PARAMS_INVALID);
  let user = await users.findById(userId);
  if (!user)return res.send({success:false,msg:'missing require parameter'}).status(Settings.HTTPStatus.NOT_FOUND);
  user.followers_id.push(folowerId);
  user.save(
    (err)=> {
      if (err) return res.send({success:false,msg:'Server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
      else  res.send({success:true,msg:'follower added'}).status(Settings.HTTPStatus.OK);
    });
});

UsersAuth.delete('/:id/following/:fid',async (req, res) => {
  const {id,fid}=req.params;
  if (!id && !fid) res.send('mising require parametr').status(Settings.HTTPStatus.PARAMS_INVALID);
  let user = await users.findById(id);
  if (!user) res.send('user not found').status(Settings.HTTPStatus.NOT_FOUND);
  user.following_id = user.following_id.filter((folowed)=>{
    return folowed.toString() != fid;
  });
  user.save(
    (err)=> {
      if (err) return res.send({success:false,msg:'Server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
      else  res.send({success:true,msg:'followed deleted'}).status(Settings.HTTPStatus.OK);
    });
});

UsersAuth.get('/:id/followers', (req, res) => {
        if (!req.params) return res.send('no params').status(Settings.HTTPStatus.NOT_FOUND);
    users.find({
      }, (err, result) => {
        if (err) return res.send({success:false,msg:'Server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
        return res.send(result).status(Settings.HTTPStatus.OK);
      });
    });

UsersAuth.post('/:id/followers',async (req, res) => {
  const userId=req.params.id;
  const {folowingId}=req.body;
  if (!userId && !folowingId) res.send('mising require parametr').status(Settings.HTTPStatus.PARAMS_INVALID);
  let user = await users.findById(userId);
  if (!user) res.send('user not found').status(Settings.HTTPStatus.NOT_FOUND);
  user.following_id.push(folowingId);
  user.save(
    (err)=> {
      if (err) return res.send({success:false,msg:'Server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
      else  res.send({success:true,msg:'following succes'}).status(Settings.HTTPStatus.OK);
    });
 });

 UsersAuth.delete('/:id/followers/:fid',async (req, res) => {
   const {id,fid}=req.params;
   if (!id && !fid) res.send('mising require parametr').status(Settings.HTTPStatus.PARAMS_INVALID);
   let user = await users.findById(id);
   if (!user) res.send('user not found').status(Settings.HTTPStatus.NOT_FOUND);
   user.followers_id = user.followers_id.filter((folower)=>{
     return folower.toString() != fid;
   });
   user.save(
     (err)=> {
       if (err) return res.send({success:false,msg:'Server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
       else  res.send({success:true,msg:'follower deleted'}).status(Settings.HTTPStatus.OK);
     });
});

UsersAuth.post('/:id/blocks',async (req, res) => {
  const userId=req.params.id;
  const {blockingId}=req.body;
  if (!userId && !blockingId) res.send('mising require parametr').status(Settings.HTTPStatus.PARAMS_INVALID);
  let user = await users.findById(userId);
  if (!user) res.send('user not found').status(Settings.HTTPStatus.NOT_FOUND);
  user.blocked_id.push(blockingId);
  user.save(
    (err)=> {
      if (err) return res.send({success:false,msg:'Server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
      else  res.send({success:true,msg:'blocking succes'}).status(Settings.HTTPStatus.OK);
    });
 });

 UsersAuth.delete('/:id/blocks/:bid',async (req, res) => {
   const {id,bid}=req.params;
   if (!id && !bid) res.send('mising require parametr').status(Settings.HTTPStatus.PARAMS_INVALID);
   let user = await users.findById(id);
   if (!user) res.send('user not found').status(Settings.HTTPStatus.NOT_FOUND);
   user.blocked_id = user.blocked_id.filter((blocker)=>{
     return blocker.toString() != bid;
   });
   user.save(
     (err)=> {
       if (err) return res.send({success:false,msg:'Server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
       else  res.send({success:true,msg:'blocker deleted'}).status(Settings.HTTPStatus.OK);
     });
});

UsersAuth.get('/', (req, res) => {
        if (!req.params) return res.send('no params').status(Settings.HTTPStatus.NOT_FOUND);
    users.find({
      }, (err, result) => {
        if (err) return res.send({success:false,msg:'Server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
        return res.send(result).status(Settings.HTTPStatus.OK);
      });
    });

  UsersAuth.get('/name', (req, res) => {
          if (!req.query) return res.send('no query').status(Settings.HTTPStatus.NOT_FOUND);
            let q = req.query.q;
          users.find({ $or:[ {'name': new RegExp(q,'i')}]},
            (err, result) => {
          if (err) return res.send({success:false,msg:'server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
            return res.send(result).status(Settings.HTTPStatus.OK);
        });
    });

  UsersAuth.get('/email', (req, res) => {
          if (!req.query) return res.send('no query').status(Settings.HTTPStatus.NOT_FOUND);
            let q = req.query.q;
          users.find({ $or:[ {'email': new RegExp(q,'i')}]},
            (err, result) => {
          if (err) return res.send({success:false,msg:'server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
            return res.send(result).status(Settings.HTTPStatus.OK);
        });
    });

  UsersAuth.get('/:id', (req, res) => {
    let id = req.params.id;
      if (!id) return res.send({success:false,msg:'Id not exist'}).status(Settings.HTTPStatus.NOT_FOUND);
  users.findOne({
      _id: id
    }, (err, result) => {
      if (err) return res.send({success:false,msg:'Server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
      return res.send(result).status(Settings.HTTPStatus.OK);
    });
  });


   UsersAuth.put('/:id/email',Key, (req, res) => {
      let id = req.params.id;
      let queryObject = {};
        if (req.body.email && req.body.email.length) {
                if (!validation.validateEmail(req.body.email)) return res.send({success:false,msg:'Not valid email'}).status(Settings.HTTPStatus.NOT_FOUND);
                queryObject.email = req.body.email;
              }
        if (Object.keys(queryObject).length) {
      users.updateOne({_id: id},queryObject, (err, result) => {
          if (err) return res.send('server error').status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
          return res.send(result).status(Settings.HTTPStatus.OK);
        });
      } else {
            return res.send('empty form');
         }
      });

      UsersAuth.put('/:id/password',Key, (req, res) => {
     let id = req.params.id;
     let queryObject = {};
           if (req.body.password && req.body.password.length) {
           queryObject.password = req.body.password;
           if (!validation.validatePassword(req.body.password)) return res.send({success:false,msg:'Not valid password'}).status(Settings.HTTPStatus.NOT_FOUND);
         }
           if (Object.keys(queryObject).length) {
         users.updateOne({_id: id},queryObject, (err, result) => {
             if (err) return res.send('server error').status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
             return res.send(result).status(Settings.HTTPStatus.OK);
           });
         } else {
               return res.send('empty form');
            }
         });

    UsersAuth.put('/:id/name',Key, (req, res) => {
      let id = req.params.id;
      let queryObject = {};
            if (req.body.name && req.body.name.length) {
            queryObject.name = req.body.name;
            if (!validation.validateName(req.body.name)) return res.send({success:false,msg:'Not valid name'}).status(Settings.HTTPStatus.NOT_FOUND);
          }
            if (Object.keys(queryObject).length) {
          users.updateOne({_id: id},queryObject, (err, result) => {
              if (err) return res.send('server error').status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
              return res.send(result).status(Settings.HTTPStatus.OK);
            });
          } else {
                return res.send('empty form');
             }
          });

          UsersAuth.post('/:id/points', (req, res) => {
            const {points}= req.body;
              if (points) {
                if (!validation.validatePoints(points)) {
                    return res.send({success:false,msg:'Not valid points'}).status(Settings.HTTPStatus.PARAMS_INVALID);
                }
                  }else{
                    return res.send({success:false,msg:'missing require parameter'}).status(Settings.HTTPStatus.PARAMS_INVALID);
              }
              users.update({ _id: req.params.id },{$inc: {'points': req.body.points}
                }, (err, result) => {
                if (err) return res.send({success:false,msg:'Server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
                else res.send({success:true,msg:'points created'}).status(Settings.HTTPStatus.OK);
              });
          });

module.exports = UsersAuth;
