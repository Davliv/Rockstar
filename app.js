const express = require('express');
const bs = require('body-parser');
const mongoose = require('mongoose');
const AppConfigs = require('./components/settings/configs');
const app = express();

app.use(bs.json());
app.use(bs.urlencoded({extended: false}));
const UsersAuth = require('./components/users/api');
const AdminRouter = require('./components/admin/api');


app.use('/api/v1/users', UsersAuth);
app.use('/api/v1/admin', AdminRouter);


app.listen(AppConfigs.PORT,()=>{
  console.log('app listening on port ' + AppConfigs.PORT)
});
