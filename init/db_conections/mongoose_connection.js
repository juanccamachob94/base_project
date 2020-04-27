const modules = require('../modules');
const mongoose = modules.mongoose;

module.exports = {
  connect: () => {
    mongoose.connect(modules.databases.mongoDB.getUrlMongoDB(), { useCreateIndex: true, useNewUrlParser:true });
    mongoose.connection.once('open',() => console.log('Database connection is OK'));
    mongoose.connection.on('error',err => console.log('Database connection failed: ' + err));
  }
}
