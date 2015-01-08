var app  = require('../server.js');
var port = 3000;

describe('app', function () {
  before (function (done){
    app.listen(port, function (err, result) {
      if (err) {
        done(err);
      } else {
        done();
      }
    });
  });

  after(function (done) {
    app.close();
  });

  it('should exist', function(done) {
    should.exist(app);
    done();
  });

  it('should be listening at localhost:3000', function (done) {
    var headers = defaultGetOptions("/");
    http.get(headers, function (res) {
      res.statusCode.should.eql(404);
      done();
    })
  })


});
