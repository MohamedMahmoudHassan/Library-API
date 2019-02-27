const mongoose = require('mongoose');
const dbDebugger = require('debug')('app:db');

const dbPass = 'mohamed0112358';
const connectionURI = `mongodb://Library_admin:${dbPass}@library-web-app-shard-00-00-n4xvb.mongodb.net:27017,library-web-app-shard-00-01-n4xvb.mongodb.net:27017,library-web-app-shard-00-02-n4xvb.mongodb.net:27017/library?ssl=true&replicaSet=Library-web-app-shard-0&authSource=admin&retryWrites=true`;

module.exports = () => {
  mongoose.connect(connectionURI, { useNewUrlParser: true })
    .then(() => dbDebugger('connected to MongoDB...'));
};
