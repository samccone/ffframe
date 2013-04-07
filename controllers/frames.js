var s3Upload    = require('../util/images/upload_to_s3');

function getRecent(req, res) {
  global.models.frame.find({}, function(err, d) {
    if (err) {
      res.render('home', {
        errors: err,
        production: Boolean(process.env['NODE_ENV'])
      });
    } else {
      res.render('home', {
        frames: d,
        production: Boolean(process.env['NODE_ENV'])
      });
    }
  });
}

function show(req, res) {
  require('./controllers').Comments.findByFrameID(req.params.id, function(err, comments) {
    if (err) {
      res.render('home', {errors: err, production: Boolean(process.env['NODE_ENV'])});
    } else {
      global.models.frame.findOne({_id: req.params.id})
      .populate('_user')
      .exec(function(err, d) {
        if (err) {
          res.render('home', {errors: err, production: Boolean(process.env['NODE_ENV'])});
        } else {
          if (d) {
            res.render('frames/show', {data: d, comments: comments, user: req.user, production: Boolean(process.env['NODE_ENV'])});
          } else {
            res.redirect('/');
          }
        }
      });
    }
  });
}

function remove(req, res) {
  global.models.frame.findOne({_id: req.params.id})
  .populate('_user')
  .exec(function(err, d) {
    if (err) {
      res.render('/frames/'+req.body.frameID, {errors: err, production: Boolean(process.env['NODE_ENV'])});
    } else {
      if (d._user.email == req.user.email) {
        global.models.frame.remove({_id: req.params.id}, function(err) {
          if (err) {
            res.render('/frames/'+req.body.frameID, {errors: err, production: Boolean(process.env['NODE_ENV'])});
          } else {
            res.redirect('/');
          }
        });
      } else {
        res.render('/frames/'+req.body.frameID, {errors: "you can not delete this", production: Boolean(process.env['NODE_ENV'])});
      }
    }
  });
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
      _user: req.user
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
      var frame = new global.models.frame(obj);
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
