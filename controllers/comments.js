var sanitize    = require('validator').sanitize;

function create(req, res) {
  req.check('comment', "comment can not be blank").notEmpty();
  req.sanitize('comment').escape();

  if (req.validationErrors()) {
    res.render('/frames/'+req.body.frameID, {errors: req.validationErrors(), production: Boolean(process.env['NODE_ENV'])});
  } else {
    var comment = new global.models.Comment({
      text: req.body.comment,
      name: req.user.name,
      frameId: new global.models.db.ObjectID(req.body.frameID),
      userId: req.user.id
    });

    comment.save(function(err, model) {
      if (err) {
        res.render('/frames/'+req.body.frameID, {errors: err, production: Boolean(process.env['NODE_ENV'])});
      } else {
        res.redirect('/frames/'+req.body.frameID);
      }
    });
  }
}

module.exports = {
  create: create
};
