var mongoose = require('mongoose');

exports.connect = function(cb) {
  mongoose.connect(process.env['db'] || 'mongodb://localhost/db', function(err, d) {
    if (err) {
      console.log("º Error Connecting", JSON.stringify(err));
    } else {
      console.log("º DB Connected");
      setSchemas();
    }
  });
}

function setSchemas() {
  var frameSchema = mongoose.Schema({
    title: String,
    url: String,
    caption: String
  });

  var userSchema = mongoose.Schema({
    email: String
  });

  global.models = {
    frame: mongoose.model('frame', frameSchema),
    User: mongoose.model('user', userSchema)
  };
}

exports.inser