var port            = process.env['port'] || 3000;
var GoogleStrategy  = require('passport-google').Strategy;
var controllers     = require('../../controllers/controllers')
var root            = process.env['NODE_ENV'] ? "http://ffframe.jit.su"  : "http://localhost:"+port
var async           = require('async');

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
    returnURL: root+"/auth/google/return",
    realm: root+"/"
    }, function(id, p, done) {
      return done(null, p);
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    global.models.User.findOne({where: {email: user.emails[0].value}}, function(err, data) {
      if (err) {
        console.log("error", err);
        done(err, null);
      } else {
        if (data == null) {
          console.log("creating a user");
          controllers.Users.create({
            name: user.displayName,
            email: user.emails[0].value
          }, done);
        } else {
          done(null, data);
        }
      }
    });
  });
}
