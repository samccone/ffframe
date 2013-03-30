var s3Upload = require('../util/images/upload_to_s3');

module.exports = {
  find: find,
  create: create
}


function find(query, cb) {
  global.models.frame.find(query, cb);
}

function create(obj, cb) {
  s3Upload({
    path: obj.upload.path,
    fileName: encodeURIComponent(obj.upload.name)
  }, function(err, d) {
    if (err) {
      cb(err, null);
    } else {
      obj.url = d.client._httpMessage.url
      var frame = new global.models.frame(obj);
      frame.save(cb)
    }
  });
}
