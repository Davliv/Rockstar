const express = require('express');
const bs = require('body-parser');
const mongoose = require('mongoose');
const AppConfigs = require('./components/settings/configs');
const app = express();

app.use(bs.json());
app.use(bs.urlencoded({extended: false}));
const UsersAuth = require('./components/users/api');
const ItemsAuth = require('./components/items/api');
const PathsAuth = require('./components/paths/api');
const CategoriesAuth = require('./components/categories/api');
const AdminRouter = require('./components/admin/api');


app.use('/api/v1/users', UsersAuth);
app.use('/api/v1/items', ItemsAuth);
app.use('/api/v1/paths', PathsAuth);
app.use('/api/v1/categories', CategoriesAuth);
app.use('/api/v1/admin', AdminRouter);


app.listen(AppConfigs.PORT,()=>{
  console.log('app listening on port ' + AppConfigs.PORT)
});
