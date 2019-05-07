const express = require('express');
const mongoose = require('mongoose');
const Settings = require('../../settings/status');
const Appconstants = require('../../settings/constants');
const validation = require('../../core/validator');
const Schema = mongoose.Schema;


const CategoriesSchema = new mongoose.Schema( {
     title: {
       type: String,
       minlength: Settings.Categories_Config.title_minlength,
       maxlength: Settings.Categories_Config.title_maxlength
     },
     image: [{
       type: Schema.Types.ObjectId,
       ref: 'photos'
     }],
     description: String
});
module.exports = CategoriesSchema;
