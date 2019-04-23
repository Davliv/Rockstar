const mongoose = require('mongoose');
const AppConfigs = require('../settings/configs');
module.exports = mongoose.createConnection(AppConfigs.DB_URL, { useNewUrlParser: true });
