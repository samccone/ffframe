var GoogleStrategy  = require('passport-google').Strategy;
var controllers     = require('../../controllers/controllers')

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
    returnURL: "http://localhost:"+global.port+"/auth/google/return",
    realm: "http://localhost:"+global.port+"/"
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