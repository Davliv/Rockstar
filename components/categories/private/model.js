const mongoose = require('mongoose');
const Settings = require('../../settings/status');
const Schema = mongoose.Schema;


const CategoriesSchema = new mongoose.Schema( {
     title: {
       type: String,
       minlength: Settings.Categories_Config.title_minlength,
       maxlength: Settings.Categories_Config.title_maxlength
     },
     type: String,
     image: [{
       type: Schema.Types.ObjectId,
       ref: 'photos'
     }],
     description: {
       type: String,
       minlength: Settings.Categories_Config.description_minlength,
       maxlength: Settings.Categories_Config.description_maxlength
     }
});
module.exports = CategoriesSchema;
