var port            = process.env['port'] || 3000;
var GoogleStrategy  = require('passport-google').Strategy;
var controllers     = require('../../controllers/controllers')
var root            = process.env['NODE_ENV'] ? "http://ffframe.jit.su"  : "http://localhost:"+port

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
    controllers.Users.find({email: user.emails[0].value}, function(err, data) {
      if (err) {
        done(err, null);
      } else {
        if (data.length == 0) {
          controllers.Users.create({
            name: user.displayName,
            email: user.emails[0].value
          }, done);
        } else {
          done(null, data[0]);
        }
      }
    });
  });
}
