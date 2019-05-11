const express = require('express');
const mongoose = require('mongoose');
const Settings = require('../../settings/status');
const Appconstants = require('../../settings/constants');
const validation = require('../../core/validator');
const Schema = mongoose.Schema;


const PathSchema = new mongoose.Schema( {

   title: {
     type: String,
     minlength: Settings.Path_Config.title_minlength,
     maxlength: Settings.Path_Config.title_maxlength
   },
   items: [{
     type: Schema.Types.ObjectId,
     ref: 'items'
   }],
   level: {
     type: Number,
     minlength: Settings.Path_Config.level_minlength,
     maxlength: Settings.Path_Config.level_maxlength,
     default: 0
   },
   estimation: {
     type: Number,
     minlength: Settings.Path_Config.estimation_minlength,
     maxlength: Settings.Path_Config.estimation_maxlength
   },
   category: [{
     type: Schema.Types.ObjectId,
     ref: 'categories'
   }],
   tags: [String]
 });
 module.exports = PathSchema;
