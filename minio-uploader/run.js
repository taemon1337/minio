var express = require('express')
  , Busboy = require('busboy')
  , Minio = require('minio')
  , app = express()
  , port = process.env.PORT || 8080

var mc = new Minio.Client({
  endPoint: "home.stello.org",
  port: 9001,
  secure: false,
  accessKey: "minio",
  secretKey: "zzz123zzz"
})

app.use(express.static('web'))

app.post('/', function(req, res) {
  var busboy = new Busboy({ headers: req.headers });
  var formdata = {};
  var filenames = [];

  busboy.on('error', function(err) {
    console.log('Parsing Error ', err);
  });

  busboy.on('field', function(fieldname, val, fieldnameTrunc, valTrunc, encoding, mimetype) {
    formdata[fieldname] = val;
  });

  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    mc.putObject('uploads', filename, file, 'application/octect-stream', function(err) {
      if(err) {
        console.log(err)
      } else {
        filenames.push(filename);
      }
    })
  });

  busboy.on('finish', function() {
    res.end();
  });

  req.pipe(busboy);
});

app.listen(port);
