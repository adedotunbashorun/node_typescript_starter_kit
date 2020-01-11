import * as passport from "passport";
import * as passportLocal from "passport-local";
// import passportApiKey from "passport-headerapikey";
import * as passportJwt from "passport-jwt";
import { User } from "../models/user";
import { config } from "../config/app";


const LocalStrategy = passportLocal.Strategy;
const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

passport.use(new LocalStrategy({ usernameField: "username" }, (username, password, done) => {
  User.findOne({ username: username.toLowerCase() }, (err, user: any) => {
    if (err) { return done(err); }
    if (!user) {
      return done(undefined, false, { message: `username ${username} not found.` });
    }
    user.comparePassword(password, (err: Error, isMatch: boolean) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(undefined, user);
      }
      return done(undefined, false, { message: "Invalid username or password." });
    });
  });
}));

passport.use(new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.app.JWT_SECRET,
    },  (jwtToken, done) => {
    User.findOne({ username: jwtToken.username },  (err, user) => {
        if (err) { return done(err, false); }
        if (user) {
            return done(undefined, user , jwtToken);
        } else {
            return done(undefined, false);
        }
    });
}));