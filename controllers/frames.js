module.exports = {
  find: find,
  create: create
}


function find(query, cb) {
  global.models.frame.find(query, cb);
}

function create(obj, cb) {
  var frame = new global.models.frame(obj);

  frame.save(cb)
}
