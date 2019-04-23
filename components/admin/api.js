const express = require('express');
const AdminRouter = express.Router();
const Settings = require('../settings/status');
const Constantss = require('../settings/constants');
const UserSchema = require('../users/private/model');
const programing_db = require('../core/db');
const users = programing_db.model('users', UserSchema);
//const redis = require('../core/redis');

AdminRouter.delete('/:id', (req, res) => {
    let adminID = req.params.id;
    let userToDelete = req.body.id;
    users.findOne({
        _id: adminID
    }, (err, result) => {
        if (err) return res.send('server error').status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
        if(!result) return res.send("user dont found");
        if (result.role != Constantss.UserRoles.ADMIN) return res.send({success:false,msg:'No Admin'}).status(Settings.HTTPStatus.NOT_FOUND);
        users.deleteOne({_id: userToDelete}, (err,result) => {
            if (err) return res.send('server error').status(Settings.HTTPStatus.INTERNAL_SERVER_ERROR);
            return res.send('user deleted').status(Settings.HTTPStatus.OK);
        });
    });
});


module.exports = AdminRouter;
