const express = require('express');
const mongoose = require('mongoose');
const Settings = require('../../settings/status');
const Appconstants = require('../../settings/constants');
const validation = require('../../core/validator');
const Schema = mongoose.Schema;


const ItemSchema = new mongoose.Schema( {
     url: {
       type: String,
       minlength: Settings.Item_Config.url_minlength,
       maxlength: Settings.Item_Config.url_maxlength
     },

     title: {
       type: String,
       minlength: Settings.Item_Config.title_minlength,
       maxlength: Settings.Item_Config.title_maxlength
     },
     content: {
       type: String,
       minlength: Settings.Item_Config.content_minlength,
       maxlength: Settings.Item_Config.content_maxlength
     },
     type: String,
     estimation: {
       type: Number,
       minlength: Settings.Item_Config.estimation_minlength,
       maxlength: Settings.Item_Config.estimation_maxlength
     },
     image: [{
           type: Schema.Types.ObjectId,
           ref: 'photos'
       }],
     linked_items: [
       {
             type: Schema.Types.ObjectId,
             ref: 'items'
         }
     ],
     linked_optional_items: [],
     quiz_answers: [{
        value: String,
        correct: Boolean
     }],
     project_id: [{
           type: Schema.Types.ObjectId,
           ref: 'projects'
     }]
  });
  module.exports = ItemSchema;
