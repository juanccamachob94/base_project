module.exports = {
  createError: require('http-errors'),
  path: require('path'),
  cookieParser: require('cookie-parser'),
  logger: require('morgan'),
  expressFormData: require('express-form-data'),
  mongoose: require('mongoose'),
  expressSession: require('express-session'),
  methodOverride: require('method-override'),
  connectFlash: require('connect-flash'),
  expressMessages: require('express-messages'),
  secrets: require('./config/secrets'),
  databases: require('./config/databases'),
  projectFeatures: require('./config/project_features'),
  passportSerialize: require('./middlewares/passport_serialize'),
  passportOAuth: require('./middlewares/passportOAuth')
};
