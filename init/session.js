const modules = require('./modules');
const connectMongo = require('connect-mongo')(modules.expressSession);

let cookie = { expires: new Date(253402300000000) };
if(process.env.NODE_ENV == 'development') cookie = { maxAge: 1000 * 60 * 30 };

module.exports = {
  new: () => {
    modules.expressSession({
     store: new connectMongo({ url: modules.databases.mongoDB.getUrlMongoDB(), collection: 'sessions' }),
     secret: modules.secrets.session,
     resave: true,
     saveUninitialized: true,
     cookie
    })
  }
};
