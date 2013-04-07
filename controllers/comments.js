var mongoose    = require('mongoose');
var sanitize    = require('validator').sanitize;

function findByFrameID(id, cb) {
  global.models.Comment.find({
    _frame: mongoose.Types.ObjectId(id)
  })
  .populate('_user')
  .exec(cb);
}

function create(req, res) {
  req.check('comment', "comment can not be blank").notEmpty();
  req.sanitize('comment').escape();

  if (req.validationErrors()) {
    res.render('/frames/'+req.body.frameID, {errors: req.validationErrors(), production: Boolean(process.env['NODE_ENV'])});
  } else {
    var comment = new global.models.Comment({
      text: req.body.comment,
      _frame: req.body.frameID,
      _user: req.user
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
  findByFrameID: findByFrameID,
  create: create
};
