const UserModel = require('../models/User');
const User = UserModel.model;
const jsonwebtoken = require('jsonwebtoken');
const secrets = require('../config/secrets');
const serverFeatures = require('../config/server_features');
const projectFeatures = require('../config/project_features');
const helpers = require('../helpers');
const mail = require('../helpers/mail');
const uploadFile = require('../helpers/uploadFile');
const passport = require('passport');

module.exports = {
  index: (req,res,next) => {
    if(req.query.tokenVerification) {
      User.updateOne({ _id: jsonwebtoken.decode(req.query.tokenVerification).id, isVerified: false }, { isVerified: true })
        .then(updateResponse => {
          if(updateResponse.nModified == 0) res.send('Login pendiente');
          else res.send('Tu cuenta ha sido activada');
        })
        .catch(next);
      ;
    } else res.send('Not implemented');
  },

  findUserData: (req,res) => {
    User.findById(req.session.passport.user)
      .then(user => {
        req.session.passport.user = user;
        res.redirect('/access');
      })
      .catch(err => {
        throw err;
      });
    ;
  },

  getSignUp: (req,res) => {
    res.render('user/signUp')
  },
  uploadPhoto: (req,res,next) => {
    uploadFile(req.files.photo.path, projectFeatures.staticFolder.root + '/' + projectFeatures.staticFolder.images.root + '/' + projectFeatures.staticFolder.images.profiles + '/' + req.jwtPhoto + '.' + req.files.photo.name.split('.').pop())
      .then(uploadFile => {
        User.updateOne({ _id: req.userEmailInfo._id }, { photo: req.jwtPhoto + '.' + req.files.photo.name.split('.').pop() })
          .then(updateProcess => {
            next();
          })
        ;
      })
      .catch(next)
    ;
  },

  signUp: (req,res,next) => {
    User.create(helpers.buildParams(UserModel.validParams,req.body))
      .then(userCreated => {
        req.jwt = jsonwebtoken.sign({ id: userCreated._id }, secrets.jwtSecret);
        req.jwtPhoto = jsonwebtoken.sign( { id: userCreated._id }, secrets.jwtSecretPhoto);
        req.userEmailInfo = { _id: userCreated._id, userName: userCreated.givenName, email: userCreated.email };
        next();
      })
      .catch(next)
    ;
  },

  sendVerification: (req,res,next) => {
    mail.sendEmail({
      to: req.userEmailInfo.email,
      subject: '[ImgOrganizer - ' + helpers.randomString(12) + '] Email verification',
      html: '<p><strong>' + req.userEmailInfo.userName + '</strong>, te damos la bienvenida a ImgOrganizer. Para verificar tu cuenta deberás acceder a este <a href="' + serverFeatures.url + '/user?tokenVerification=' + req.jwt + '">enlace</a>'
    })
      .then(info => {
        User.findById(req.userEmailInfo._id)
          .then(user => {
            res.redirect('/user/logIn');
          });
      })
      .catch(next)
    ;
  },

  getLogIn: (req,res) => {
    res.render('user/logIn');
  },

  logIn: (req,res,next) => {
    passport.authenticate('local',{
      failureRedirect: '/user/Login',
      failureFlash: true
    })(req,res,next);
  },

  logOut: (req,res) => {
    if(typeof req.session.passport !== 'undefined' && req.session.passport.user) req.session.passport.user = null;
    res.redirect('/');
  }
}
