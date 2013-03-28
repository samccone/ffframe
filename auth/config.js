var GoogleStrategy    = require('passport-google').Strategy;

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
    returnURL: "http://localhost:"+global.port+"/auth/google/return",
    realm: "http://localhost:"+global.port+"/"
    }, function(id, p, done) {
      return done(null, p);
    }
  ));


  passport.serializeUser(function(user, done) {
    done(null, user.emails[0].value);
  });

  passport.deserializeUser(function(email, done) {
    global.models.User.find({email: email}, function(err, data) {
      if (err) {
        done(err, null);
      } else {
        if (data.length == 0) {
          var usr = new global.models.User({
            email: email
          });
          console.log("ø Creating a New User "+email);
          usr.save(done);
        } else {
          done(null, data[0]);
        }
      }
    });
  });
}