"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = require("passport");
const passport_local_1 = require("passport-local");
const passport_facebook_1 = require("passport-facebook");
const User_1 = require("../models/User");
const LocalStrategy = passport_local_1.default.Strategy;
const FacebookStrategy = passport_facebook_1.default.Strategy;
passport_1.default.serializeUser((user, done) => {
    done(undefined, user.id);
});
passport_1.default.deserializeUser((id, done) => {
    User_1.User.findById(id, (err, user) => {
        done(err, user);
    });
});
passport_1.default.use(new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    User_1.User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(undefined, false, { message: `Email ${email} not found.` });
        }
        user.comparePassword(password, (err, isMatch) => {
            if (err) {
                return done(err);
            }
            if (isMatch) {
                return done(undefined, user);
            }
            return done(undefined, false, { message: "Invalid email or password." });
        });
    });
}));
passport_1.default.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ["name", "email", "link", "locale", "timezone"],
    passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, done) => {
    if (req.user) {
        User_1.User.findOne({ facebook: profile.id }, (err, existingUser) => {
            if (err) {
                return done(err);
            }
            if (existingUser) {
                done(err);
            }
            else {
                const user = new User_1.User();
                user.facebook = profile.id;
                user.tokens.push({ kind: "facebook", accessToken });
                user.profile.name = user.profile.name || `${profile.name.givenName} ${profile.name.familyName}`;
                user.profile.gender = user.profile.gender || profile._json.gender;
                user.profile.picture = user.profile.picture || `https://graph.facebook.com/${profile.id}/picture?type=large`;
                user.save((err) => {
                    done(err, user);
                });
            }
        });
    }
    else {
        User_1.User.findOne({ facebook: profile.id }, (err, existingUser) => {
            if (err) {
                return done(err);
            }
            if (existingUser) {
                return done(undefined, existingUser);
            }
            User_1.User.findOne({ email: profile._json.email }, (err, existingEmailUser) => {
                if (err) {
                    return done(err);
                }
                if (existingEmailUser) {
                    done(err);
                }
                else {
                    const user = new User_1.User();
                    user.email = profile._json.email;
                    user.facebook = profile.id;
                    user.tokens.push({ kind: "facebook", accessToken });
                    user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
                    user.profile.gender = profile._json.gender;
                    user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
                    user.profile.location = (profile._json.location) ? profile._json.location.name : "";
                    user.save((err) => {
                        done(err, user);
                    });
                }
            });
        });
    }
}));
