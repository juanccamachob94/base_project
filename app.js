const modules = require('./init/modules');
const routes = require('./init/routes');
const session = require('./init/session');
const dbConnection = require('./init/db_connection');
const express = require('express');
const passport = require('passport');

// DB connections
dbConnection.mongooseConnection.connect();

var app = express();

app.use(session.new());

app.use(module.expressFormData.parse({ keepExtensions: true }));

app.use(function (req, res, next) {
  res.locals.messages = module.expressMessages(req,res);
  next();
});

// view engine setup
app.set('views', modules.path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(modules.logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(modules.methodOverride('_method'));

app.use(cookieParser(modules.secrets.cookie));

modules.passportSerialize(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, modules.projectFeatures.staticFolder.root)));

for(var routePath in routes) app.use('/' + routePath, routes[routePath]);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(modules.createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

passport.use(modules.passportOAuth.localStrategy());

module.exports = app;
