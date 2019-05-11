const express = require('express');
const ItemsAuth = express.Router();
const bs = require('body-parser');
const validation = require('../core/validator');
const Settings = require('../settings/status');
const ItemSchema = require('../items/private/model');
const programing_db = require('../core/db');
const items = programing_db.model('items', ItemSchema);
const app = express();

app.use(bs.json());
app.use(bs.urlencoded({extended: false}));


module.exports = ItemsAuth;



ItemsAuth.post('/', (req, res) => {
    const {title,type,estimation,linked_items,url,project_id,linked_optional_items,quiz_answers,content,image} = req.body;
    if (!title || !type || !estimation || !linked_items) {
        return res.send({success:false,msg:'Required Parameters is missing'}).status(Settings.HTTPStatus.PARAMS_INVALID);
    }
    if (!validation.validateTitle(title)) {
        return res.send({success:false,msg:'Not valid title'}).status(Settings.HTTPStatus.PARAMS_INVALID);
    }
    if (!validation.validateType(type)) {
        return res.send({success:false,msg:'Not valid type'}).status(Settings.HTTPStatus.PARAMS_INVALID);
    }
    if (!validation.validateEstimation(estimation)) {
        return res.send({success:false,msg:'Not valid estimation'}).status(Settings.HTTPStatus.PARAMS_INVALID);
    }
    if (!validation.validateLinkedItems(linked_items)) {
        return res.send({success:false,msg:'Not valid linked_items'}).status(Settings.HTTPStatus.PARAMS_INVALID);
    }
    if (url &&  !validation.validateUrl(url)) {
        return res.send({success:false,msg:'Not valid url'}).status(Settings.HTTPStatus.PARAMS_INVALID);
    }
    if (quiz_answers && !validation.validateAnswerAsObject(quiz_answers)) {
        return res.send({success:false,msg:'Not valid Answer'}).status(Settings.HTTPStatus.PARAMS_INVALID);
    }
    items.create({
        title,
        type,
        estimation,
        linked_items,
        url,
        content,
        image,
        project_id,
        linked_optional_items,
        quiz_answers
    }, (err) => {
        if (err) return res.send({success:false,msg:'Server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
        else res.send({success:true,msg:'item created'}).status(Settings.HTTPStatus.OK);
    });
});

ItemsAuth.put('/:id/url',async (req, res) => {
  const { id } = req.params;
  const { url }= req.body;
    if (!url || !id) {
       return res.send({success:false,msg:'missing reqiure parameter'}).status(Settings.HTTPStatus.PARAMS_INVALID);
    }
    if (!validation.validateUrl(url)) {
        return res.send({success:false,msg:'Not valid url'}).status(Settings.HTTPStatus.PARAMS_INVALID);
    }
    await items.updateOne({ _id: id }, { $set: { url: url } },(err, result) => {
        if (err) return res.send('server error').status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
        return res.send(result).status(Settings.HTTPStatus.OK);
    });
});


ItemsAuth.put('/:id/image', async (req, res) => {
    const itemId=req.params.id;
    const {imagee}=req.body;
    if (!itemId || !image) {
        return res.send({success:false,msg:'missing require parameter'}).status(Settings.HTTPStatus.PARAMS_INVALID);
    }
    let item = await items.findById(itemId);
    if (!item)return res.send({success:false,msg:'missing require parameter'}).status(Settings.HTTPStatus.NOT_FOUND);
    item.image.push(imagee);
    item.save( (err)=> {
        if (err) return res.send({success:false,msg:'Server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
        else  res.send({success:true,msg:'image added'}).status(Settings.HTTPStatus.OK);
    });
});

ItemsAuth.put('/:id/answers', async (req, res) => {
    const { value,correct } = req.body;
    const { id } = req.params;
    if (!value || !correct || !id) {
        return res.send({success:false,msg:'missing require parameter'}).status(Settings.HTTPStatus.NOT_FOUND);
    }
    if (!validation.validateAnswer(value,correct)) {
        return res.send({success:false,msg:'Not valid Answer'}).status(Settings.HTTPStatus.PARAMS_INVALID);
    }
    const item = await items.findById(id);
    const itemType = item.type;
    if (itemType !='quiz') return res.send({success:false,msg:'You cant add answer'}).status(Settings.HTTPStatus.PARAMS_INVALID);
    (item.quiz_answers).push({value,correct});
    item.save((err)=> {
        if (err) return res.send({success:false,msg:'Server error'}).status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
        else  res.send({success:true,msg:'answer added'}).status(Settings.HTTPStatus.OK);
    });
});

