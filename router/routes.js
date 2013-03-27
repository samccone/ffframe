var validator = require('validator');

module.exports = function(server) {
  server.get("/", function(req, res) {
    res.render('home');
  });

  server.get("/frames/new", function(req, res) {
    res.render('frames/new');
  });

  server.post('/frames/new', function(req, res) {
    req.check('title', 'frame requires a title').notEmpty();
    req.sanatize('caption').xss();
    res.redirect('/');
  });
}