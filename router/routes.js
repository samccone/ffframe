var controllers = require('../controllers/controllers');

module.exports = function(server, passport) {
  server.get("/", loggedIn, function(req, res) {
    controllers.Frames.find({}, function(err, d) {
      if (err) {
        res.render('home', {
          errors: err
        });
      } else {
        res.render('home', {
          frames: d
        });
      }
    });
  });

  server.get('/auth/google', passport.authenticate('google'));

  server.get('/auth/google/return', passport.authenticate('google', {failureRedirect: '/login'}), function(req, res) {
    res.redirect('/');
  });

  server.get('/login', function(req, res) {
    res.render('login/login');
  });

  server.get("/frames/new", loggedIn, function(req, res) {
    res.render('frames/new');
  });

  server.get("/frames/:id", loggedIn, function(req, res) {
    controllers.Frames.find({_id: req.params.id}, function(err, d) {
      if (err) {
        res.render('home', {errors: err});
      } else {
        res.render('frames/show', {data: d});
      }
    });
  });

  server.post('/frames/new', loggedIn, function(req, res) {
    req.check('title', 'frame requires a title').notEmpty();

    if (req.validationErrors()) {
      res.render('frames/new', {errors: req.validationErrors()});
    } else {
      controllers.Frames.create({
        title: req.body.title,
        caption: req.body.caption,
        upload: req.files.image
      }, function(err, obj) {
        if (err) {
          res.render('frames/new', {errors: err});
        } else {
          res.redirect('/');
        }
      });
    }
  });
}

function loggedIn(req, res, done) {
  if (req.user) {
    done();
  } else {
    res.redirect('/login');
  }
}
