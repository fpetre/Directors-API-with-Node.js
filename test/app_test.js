var request = require('supertest');
var expect  = require('expect');
var express = require('express');
var app     = require('../server.js');


var mongoose   = require('mongoose');
var Director   = require('../app/models/director');


describe('directors API', function(){
  before(function(done) {
    if (mongoose.connection.db) return done();
    mongoose.connect('mongodb://directortest:directortest@proximus.modulusmongo.net:27017/syBoso9m');
    done();
  });

  after(function(done){
    mongoose.connection.db.dropDatabase(function(){
      mongoose.connection.close(function(){
        done();
      });
    });
  });


  describe('post to /directors', function(){
    afterEach(function(done){
      Director.remove({}, function(){
        done();
      });
    });

    it('registers a director', function(done){
      request(app)
      .post('/directors')
      .send({ 'livestream_id': '6488834' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(e, res){
        expect(e).toBe(null);
        Director.findOne({}, function(err, director){
          expect(director.livestream_id).toEqual('6488834');
          expect(director.full_name).toEqual('Steven Spielberg');
          done();
        });
      });
    });

    it('responds with the correct JSON response given correct livestream_id', function(done){
      request(app)
      .post('/directors')
      .send({ 'livestream_id': '6488834' })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(e, res){
        expect(e).toBe(null);
        expect(res.body.livestream_id).toEqual('6488834');
        expect(res.body.full_name).toEqual('Steven Spielberg');
        expect(res.body.dob).toEqual('1946-12-18T00:00:00.000Z');
        done();
      });
    });

    it('responds with 404 error given incorrect livestream_id', function(done){
      request(app)
      .post('/directors')
      .send({ 'livestream_id': '1234214324'})
      .expect(404)
      .end(function(e, res){
        expect(e).toBe(null);
        expect(res.status).toBe(404);
        expect(res.text).toBe("{\"name\":\"NotFoundError\",\"message\":\"Object account:1234214324 does not have an id.\"}")
        done();
      });
    });

    it('does not register a director twice');

  });

  describe('get to /directors', function(){
    beforeEach(function(done){

      new Director({
        livestream_id: 6488835,
        full_name: "Crystal Hybrid Perez",
        dob: "1986-12-11T00:00:00.000Z"
      }).save(function(err){
        new Director({
          livestream_id: 6488834,
          full_name: "Steven Spielberg",
          dob: "1946-12-18T00:00:00.000Z"
        }).save(function(err){
          done();
        });
      });
    });

    afterEach(function(done){
      Director.remove({}, function(){
        done();
      });
    });


    it('responds with the correct JSON response', function(done){
      request(app)
      .get('/directors')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(e, res){
        expect(e).toBe(null);
        expect(res.body.length).toBe(2);
        expect(res.body[0].livestream_id).toBe('6488835');
        done();
      });

    });

  });


  describe('get to /directors/:director_id', function(){
    beforeEach(function(done){
      new Director({
        livestream_id: 6488835,
        full_name: "Crystal Hybrid Perez",
        dob: "1986-12-11T00:00:00.000Z"
      }).save(function(err){
        done();
      });
    });

    afterEach(function(done){
      Director.remove({}, function(){
        done();
      });
    });


    it('responds with the correct JSON response', function(done){
      Director.findOne({}, function(err, director){
        var id = director.id;
        request(app)
        .get('/directors/' + id)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(e, res){
          expect(e).toBe(null);
          expect(res.body.livestream_id).toBe('6488835');
          done();
        });
      });
    });
  });


  describe('put to /directors/:director_id', function(){
    beforeEach(function(done){
      new Director({
        livestream_id: 6488835,
        full_name: "Crystal Hybrid Perez",
        dob: "1986-12-11T00:00:00.000Z"
      }).save(function(err){
        done();
      });
    });

    afterEach(function(done){
      Director.remove({}, function(){
        done();
      });
    });

    it('updates a director', function(done){
      Director.findOne({}, function(err, originalDirector){
        var id = originalDirector.id;
        request(app)
        .put('/directors/' + id)
        .send({'favorite_camera': "Sony F65"})
        .set('Authorization', 'Bearer 407655d5d5b7ebd602326b26f4df704e')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(e, res){
          Director.findOne({_id: id}, function(err, changedDirector){
            expect(e).toBe(null);
            expect(changedDirector.favorite_camera).toBe("Sony F65");
            done();
          });
        });
      });
    });

    it('responds with the correct JSON response', function(done){
      Director.findOne({}, function(err, director){
        var id = director.id;
        request(app)
        .put('/directors/' + id)
        .send({'favorite_camera': "Sony F65"})
        .set('Authorization', 'Bearer 407655d5d5b7ebd602326b26f4df704e')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(e, res){
          expect(e).toBe(null);
          expect(res.body.favorite_camera).toBe("Sony F65")
          done();
        });
      });
    });

    it('responds with 401 if authorization header is missing', function(done){
      Director.findOne({}, function(err, director){
        var id = director.id;
        request(app)
        .put('/directors/' + id)
        .send({'favorite_camera': "Sony F65"})
        .expect(401)
        .end(function(e, res){
          expect(e).toBe(null);
          expect(res.status).toBe(401);
          expect(res.text).toBe('missing authorization header');
          done();
        });
      });
    });

    it('responds with 401 if authorization header is wrong', function(done){
      Director.findOne({}, function(err, director){
        var id = director.id;
        request(app)
        .put('/directors/' + id)
        .send({'favorite_camera': "Sony F65"})
        .set('Authorization', 'Bearer 407655d5d5b7ebd626b26f4df704e')
        .expect(401)
        .end(function(e, res){
          expect(e).toBe(null);
          expect(res.status).toBe(401);
          expect(res.text).toBe('invalid authorization header');
          done();
        });
      });
    });
  });

  describe('delete to /directors/:director_id', function(){
    beforeEach(function(done){
      new Director({
        livestream_id: 6488835,
        full_name: "Crystal Hybrid Perez",
        dob: "1986-12-11T00:00:00.000Z"
      }).save(function(err){
        done();
      });
    });

    afterEach(function(done){
      Director.remove({}, function(){
        done();
      });
    });

    it('deletes a record', function(done){
      Director.findOne({}, function(err, director){
        var id = director.id;
        request(app)
        .delete('/directors/' + id)
        .expect(200)
        .end(function(e, res){
          expect(e).toBe(null);
          Director.findOne({}, function(err, director){
            expect(director).toBe(null);
            done();
          });
        });
      });
    });

    it('responds with the correct JSON response', function(done){
      Director.findOne({}, function(err, director){
        var id = director.id;
        request(app)
        .delete('/directors/' + id)
        .expect(200)
        .end(function(e, res){
          expect(e).toBe(null);
          expect(res.body.message).toBe('Successfully deleted');
          done();
        });
      });
    });
  });

});
