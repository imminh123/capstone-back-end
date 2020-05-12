const passport = require('passport');
const refresh = require('passport-oauth2-refresh');
const axios = require('axios');
const { Strategy: LocalStrategy } = require('passport-local')
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth');
const { OAuthStrategy } = require('passport-oauth');
const { OAuth2Strategy } = require('passport-oauth');
const _ = require('lodash');
const moment = require('moment');
const UserDAO = require('../dao/UserDAO');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

passport.serializeUser((user, done) => {
  done(null, user.id);
});    

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Sign in using Email and Password.
 */
passport.use('sign-in',new LocalStrategy(
  { 
    usernameField: 'email', 
    passwordField: 'password' 
  }
  , (email, password, done) => {

  User.findOne({ email: email.toLowerCase() }, (err, user) => {

    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { msg: `Email ${email} not found.` });
    }
    if (!user.password) {
      return done(null, false, { msg: 'Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.' });
    }

    user.comparePassword(password, (err, isMatch) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(null, user);
      }
      return done(null, false, { msg: 'Invalid email or password.' });
    });
  });

}));

/**
 * OAuth Strategy Overview
 *
 * - User is already logged in.
 *   - Check if there is an existing account with a provider id.
 *     - If there is, return an error message. (Account merging not supported)
 *     - Else link new OAuth account with currently logged-in user.
 * - User is not logged in.
 *   - Check if it's a returning user.
 *     - If returning user, sign in and we are done.
 *     - Else check if there is an existing account with user's email.
 *       - If there is, return an error message.
 *       - Else create a new account.
 */

/**
 * Sign in with Google.
 */
const clientID = '1064836068373-o9o8a3js68b63tlhspmgp1dq74dlplmu.apps.googleusercontent.com';
const clientSecret = 'BATawVSFOWsV_i_CuwqSlY8I';

const googleStrategyConfig = new GoogleStrategy({
  clientID: clientID, 
  clientSecret: clientSecret,
  callbackURL: '/auth/google/callback',
  passReqToCallback: true
}, (req, accessToken, refreshToken, params, profile, done) => {
    User.findOne({ google: profile.id }, (err, existingUser) => {

      if (err) { return done(err); }
      if (existingUser) {
        return done(null, existingUser);
      }

      var oldU=User.findOneAndUpdate({google: profile.id},{name:profile.displayName,avatar:profile._json.picture},{returnOriginal: false});
        console.log('old user la: '+oldU);
        if (oldU.role=='student') {
          console.log('student');
          Student.updateOne({_id:oldU.profile},{name:oldU.name,avatar:oldU.avatar});
        }
        else if (oldU.role=='teacher') {
          console.log('teacher');
          Teacher.updateOne({_id:oldU.profile},{name:oldU.name,avatar:oldU.avatar});
        }
  
      //create new user
      User.findOne({ email: profile.emails[0].value }, async (err, existingEmailUser) => {
        if (err) { return done(err); }
        if (existingEmailUser) {
 
          req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.' });
          done(err);
        } else {
  
          let email = profile.emails[0].value;
          let google = profile.id;
          let tokens = {
            kind: 'google',
            accessToken,
            accessTokenExpires: moment().add(params.expires_in, 'seconds').format(),
            refreshToken,
          };
 
          let role = 'tempuser';
          let profileForParam = {};
          profileForParam.name = profile.displayName || email;
          profileForParam.gender = profile._json.gender || 'other';
          profileForParam.avatar = profile._json.picture;


          const user = await UserDAO.createUser(email, google, tokens, role, profileForParam, null);

          if(user) {
            return done(null, user);
          }else {
            done(err);
          }
        }
      });
    });
});
passport.use('google', googleStrategyConfig);
refresh.use('google', googleStrategyConfig);


/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

/**
 * Authorization Required middleware.
 */
exports.isAuthorized = (req, res, next) => {
  const provider = req.path.split('/')[2];
  const token = req.user.tokens.find((token) => token.kind === provider);
  if (token) {
    // Is there an access token expiration and access token expired?
    // Yes: Is there a refresh token?
    //     Yes: Does it have expiration and if so is it expired?
    //       Yes, Quickbooks - We got nothing, redirect to res.redirect(`/auth/${provider}`);
    //       No, Quickbooks and Google- refresh token and save, and then go to next();
    //    No:  Treat it like we got nothing, redirect to res.redirect(`/auth/${provider}`);
    // No: we are good, go to next():
    if (token.accessTokenExpires && moment(token.accessTokenExpires).isBefore(moment().subtract(1, 'minutes'))) {
      if (token.refreshToken) {
        if (token.refreshTokenExpires && moment(token.refreshTokenExpires).isBefore(moment().subtract(1, 'minutes'))) {
          res.redirect(`/auth/${provider}`);
        } else {
          refresh.requestNewAccessToken(`${provider}`, token.refreshToken, (err, accessToken, refreshToken, params) => {
            User.findById(req.user.id, (err, user) => {
              user.tokens.some((tokenObject) => {
                if (tokenObject.kind === provider) {
                  tokenObject.accessToken = accessToken;
                  if (params.expires_in) tokenObject.accessTokenExpires = moment().add(params.expires_in, 'seconds').format();
                  return true;
                }
                return false;
              });
              req.user = user;
              user.markModified('tokens');
              user.save((err) => {
                if (err) console.log(err);
                next();
              });
            });
          });
        }
      } else {
        res.redirect(`/auth/${provider}`);
      }
    } else {
      next();
    }
  } else {
    res.redirect(`/auth/${provider}`);
  }
};
