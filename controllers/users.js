module.exports = {
  find: find,
  tokenAuth: tokenAuth,
  create: create,
  enterAuthToken: enterAuthToken
};

function enterAuthToken(req, res) {
  res.render('users/new', {production: Boolean(process.env['NODE_ENV'])});
}

function tokenAuth(req, res, done) {
  if (0) {
    done();
  } else {
    res.render('users/login', {errors: "not a valid auth token", production: Boolean(process.env['NODE_ENV'])});
  }
}

function find(query, cb) {
  global.models.User.find(query, cb);
}

function create(obj, cb) {
  var user = new global.models.User(obj);
  user.save(cb);
}
