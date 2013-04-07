var Schema    = require('jugglingdb').Schema;
var db        = null;
var colors    = require('colors');

exports.connect = function(cb) {
  db = new Schema('mongodb', {
    url: process.env['db'] || 'mongodb://localhost/db'
  });

  db.on('connected', function() {
    console.log("º DB Connected".green);
    setSchemas();
  });
}

function setSchemas() {
  var Frame = db.define("Frame", {
    title: String,
    url: String,
    caption: String,
    date: {type: Date, default: Date.now}
  });

  var User = db.define("User", {
    email: String,
    name: String,
    createdAt: {type: Date, default: Date.now}
  });

  var Comment = db.define("Comment", {
    text: String,
    name: String,
    createdAt: {type: Date, default: Date.now}
  });

  User.hasMany(Comment, {as: "comments", foreignKey: "userId"});
  User.hasMany(Frame, {as: "frames", foreignKey: "userId"});
  Frame.hasMany(Comment, {as: "comments", foreignKey: "frameId"});
  Frame.belongsTo(User, {as: "author", foreignKey: "userId"});

  global.models = {
    db: db,
    Frame: Frame,
    User: User,
    Comment: Comment
  };
}
