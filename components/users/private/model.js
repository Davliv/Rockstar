const express = require('express');
const mongoose = require('mongoose');
const Settings = require('../../settings/status');
const keygen = require('keygenerator');
const Appconstants = require('../../settings/constants');
const validation = require('../../core/validator');
const Schema = mongoose.Schema;

function generateAPIKey() {
    return (keygen._({ length: 2 }) + '-' + keygen._({ length: 6 })
        + '-' + keygen.number()
        + '-' + keygen._({ length: 6 })
        + '-' + keygen._({ length: 8 })).replace(/&/g, '');
}

const PhotosSchema = new mongoose.Schema({
    image:{ data: Buffer, contentType: String },
    userId: { type:mongoose.Schema.Types.ObjectId },
    //entity_id: { type: Schema.ObjectId, index: true }
});

const UserSchema = new mongoose.Schema( {
  name:  {
        type: String,
        minlength: Settings.Config.name_minlength,
        maxlength: Settings.Config.name_maxlength
  },
  email: {
        type: String,
        trim: true,
        index: { unique: true, sparse: true },
        lowercase: true,
        minlength: Settings.Config.email_minlength,
        maxlength: Settings.Config.email_maxlength
      },
  password: {
        type: String,
        default: null,
        minlength: Settings.Config.password_minlength,
        maxlength: Settings.Config.password_maxlength
      },
  key: {
        type: String,
        default: generateAPIKey,
        index: {unique: true}
    },
  skills: [{
      type: String,
      anum: Appconstants.User_skills,
      default: 1
    }],
  points: {
      type: Number,
      minlength: Settings.Config.points_minlength,
      maxlength: Settings.Config.points_maxlength,
      default: 10
    },
    role: {
        type: String,
        enum:Appconstants.user_role_values,
        default: 'user'
     },

  github_url: String,

  linkedin_url: String,

  followers_id: [{
    type: Schema.Types.ObjectId,
    ref: 'users'
  }],
  following_id: [{
      type: Schema.Types.ObjectId,
      ref: 'users'
    }],
  blocked_id: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
    }],
    avatar: {
        type: String,
        default: null,
        required: false
      }
  });
module.exports = UserSchema;
