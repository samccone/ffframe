var s3Upload    = require('../util/images/upload_to_s3');
var async       = require('async');

function getRecent(req, res) {
  global.models.Frame.all({limit: 10}, function(err, d) {
    if (err) {
      res.render('home', {
        errors: err,
        production: Boolean(process.env['NODE_ENV'])
      });
    } else {
      res.render('home', {
        frames: d.reverse(),
        production: Boolean(process.env['NODE_ENV'])
      });
    }
  });
}

function show(req, res) {
  async.waterfall([
    function(cb) {
      global.models.Frame.find(req.params.id, cb);
    },
    function(model, cb) {
      model.author(function(e, author) {
        cb(e, model, author);
      });
    },
    function(model, author, cb) {
      model.comments(function(e, comments) {
        cb(e, model, author, comments);
      });
    }
    ], function(err, model, author, comments) {
      if (err) {
        res.render('home', {frames: [], errors: err, production: Boolean(process.env['NODE_ENV'])});
      } else {
        res.render('frames/show', {data: model, comments: comments, author: author, user: req.user, production: Boolean(process.env['NODE_ENV'])});
      }
  });
}

function remove(req, res) {
  async.waterfall([
    function(cb) {
      global.models.Frame.find(req.params.id, cb);
    },
    function(model, cb) {
      model.comments(function(e, comments) {
        cb(e, model, comments);
      });
    }],
    function(e, model, comments, cb) {
      async.each(comments, function(c, cb) {
        c.destroy(cb)
      }, function(err) {
        if (err) { console.log(err)}
        model.destroy(cb);
      });
      if (e) {
        res.render('/frames/'+req.body.frameID, {errors: e, production: Boolean(process.env['NODE_ENV'])});
      } else {
        res.redirect('/');
      }
    }
  );
}


function create(req, res) {
  req.check('title', 'frame requires a title').notEmpty();
  validUpload = isValidUpload(req);

  if (req.validationErrors() || !validUpload) {
    if (!validUpload) {
      res.render('frames/new', {errors: "a valid image is required", production: Boolean(process.env['NODE_ENV'])});
    } else {
      res.render('frames/new', {errors: req.validationErrors(), production: Boolean(process.env['NODE_ENV'])});
    }
  } else {
    uploadToS3({
      title: req.body.title,
      caption: req.body.caption,
      upload: req.files.image,
      userId: req.user.id
    }, function(err, obj) {
      if (err) {
        res.render('frames/new', {errors: err, production: Boolean(process.env['NODE_ENV'])});
      } else {
        res.redirect('/');
      }
    });
  }
}

function uploadToS3(obj, cb) {
  s3Upload({
    path: obj.upload.path,
    fileName: encodeURIComponent(obj.upload.name)
  }, function(err, d) {
    if (err) {
      cb(err, null);
    } else {
      obj.url = d.client._httpMessage.url
      var frame = new global.models.Frame(obj);
      frame.save(cb)
    }
  });
}

function isValidUpload(req) {
  var validType = ~["image/png", "image/jpg", "image/jpeg"].indexOf(req.files.image.type);
  return Boolean(validType);
}

module.exports = {
  getRecent: getRecent,
  create: create,
  remove: remove,
  show: show
}
