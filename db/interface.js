var Db  = require('mongodb')

exports.connect = function(cb) {
  Db.connect(process.env['db'] || 'mongodb://localhost/db', function(err, d) {
    if (err) {
      console.log("º Error Connecting", JSON.stringify(err));
    } else {
      console.log("º DB Connected");
    }
  })
}