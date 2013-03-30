module.exports = {
  find: find,
  create: create
};


function find(query, cb) {
  global.models.User.find(query, cb);
}

function create(obj, cb) {
  var user = new global.models.User(obj);
  user.save(cb);
}
