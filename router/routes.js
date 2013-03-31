var controllers = require('../controllers/controllers');
var _           = require('underscore');
var sanitize    = require('validator').sanitize;

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
    controllers.Comments.findByFrameID(req.params.id, function(err, comments) {
      if (err) {
        res.render('home', {errors: err});
      } else {
        global.models.frame.findOne({_id: req.params.id})
        .populate('_user')
        .exec(function(err, d) {
          if (err) {
            res.render('home', {errors: err});
          } else {
            res.render('frames/show', {data: d, comments: comments});
          }
        });
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
        upload: req.files.image,
        _user: req.user
      }, function(err, obj) {
        if (err) {
          res.render('frames/new', {errors: err});
        } else {
          res.redirect('/');
        }
      });
    }
  });

  server.post('/comments/new', function(req, res) {
    req.check('comment', "comment can not be blank").notEmpty();
    if (req.validationErrors()) {
      res.render('/frames/'+req.body.frameID, {errors: req.validationErrors()});
    } else {
      req.sanitize('comment').escape();
      controllers.Comments.create({
        text: req.body.comment,
        _frame: req.body.frameID,
        _user: req.user
      }, function(err, model) {
        if (err) {
          res.render('/frames/'+req.body.frameID, {errors: err});
        } else {
          res.redirect('/frames/'+req.body.frameID);
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
