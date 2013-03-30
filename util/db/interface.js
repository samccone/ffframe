var mongoose = require('mongoose');
var colors   = require('colors');

exports.connect = function(cb) {
  mongoose.connect(process.env['db'] || 'mongodb://localhost/db', function(err, d) {
    if (err) {
      console.log("º Error Connecting".red, JSON.stringify(err));
    } else {
      console.log("º DB Connected".green);
      setSchemas();
    }
  });
}

function setSchemas() {
  var frameSchema = mongoose.Schema({
    title: String,
    url: String,
    caption: String,
    _user: {type: mongoose.Schema.ObjectId, ref: 'user'},
    date: {type: Date, default: Date.now}
  });

  var userSchema = mongoose.Schema({
    email: String,
    name: String,
    createdAt: {type: Date, default: Date.now}
  });

  global.models = {
    frame: mongoose.model('frame', frameSchema),
    User: mongoose.model('user', userSchema)
  };
}
