var knox = require('knox');

var client = knox.createClient({
    key: process.env['S3_KEY'],
    secret: process.env['S3_SECRET'],
    bucket: 'ffframe'
});

function upload(props, cb) {
  client.putFile(props.path, props.fileName, {'x-amz-acl': 'public-read'}, cb);
}

module.exports = upload;
