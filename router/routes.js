module.exports = function(server) {
  server.get("/", function(req, res) {
    res.render('home');
  });

  server.get("/frames/new", function(req, res) {
    res.render('frames/new');
  });

  server.post('/frames/new', function(req, res) {
    req.check('title', 'frame requires a title').notEmpty();

    if (req.validationErrors()) {
      res.render('frames/new', {errors: req.validationErrors()});
    } else {
      res.redirect('/');
    }
  });
}