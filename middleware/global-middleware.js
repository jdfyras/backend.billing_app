import express from 'express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import pdf from 'express-pdf';

import { configureJWTStrategy } from './passport-jwt';
import { devConfig } from '../../config/env/development';
import User from '../resources/user/user.model';

export const setGlobalMiddleware = app => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(pdf);
  app.use(
    session({
      secret: devConfig.secret,
      resave: true,
      saveUninitialized: true
    })
  );
  app.use(passport.initialize({ userProperty: 'currentUser' }));
  app.use(passport.session());
  configureJWTStrategy();

  // save user into session
  // req.session.user = {userId}
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  // extract the userId from session
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(null, user);
    });
  });
 

  app.get('/failure', (req, res) =>
    res.redirect('http://localhost:4200/login')
  );
};
