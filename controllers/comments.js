var mongoose = require('mongoose');

function findByFrameID(id, cb) {
  global.models.Comment.find({
    _frame: mongoose.Types.ObjectId(id)
  })
  .populate('_user')
  .exec(cb);
}

function create(obj, cb) {
  var comment = new global.models.Comment(obj);
  comment.save(cb)
}

module.exports = {
  findByFrameID: findByFrameID,
  create: create
};
