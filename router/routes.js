var controllers = require('../controllers/controllers');

module.exports = function(server, passport) {
  server.get("/", loggedIn, controllers.Frames.getRecent);

  server.get('/auth/google', passport.authenticate('google'));
  server.get('/auth/google/return', passport.authenticate('google', {failureRedirect: '/login'}), function(req, res) { res.redirect('/'); });

  server.get('/users/login', function(req, res) { res.render('users/login', {production: Boolean(process.env['NODE_ENV'])}); });
  server.get('/users/new/:id', controllers.Users.tokenAuth, passport.authenticate('google'));

  server.get("/frames/new", loggedIn, function(req, res) { res.render('frames/new', {production: Boolean(process.env['NODE_ENV'])}); });
  server.get("/frames/:id/delete", loggedIn, controllers.Frames.remove);
  server.get("/frames/:id", loggedIn, controllers.Frames.show);
  server.post('/frames/new', loggedIn, controllers.Frames.create);

  server.post('/comments/new', controllers.Comments.create);
}

function loggedIn(req, res, done) {
  if (req.user) {
    done();
  } else {
    res.redirect('/users/login');
  }
}
