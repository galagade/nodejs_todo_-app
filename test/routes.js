var should = require('should'); 
var assert = require('assert');
var express = require('express');
var rewire = require('rewire');
var app = express();
var request = require('supertest');  
var mongoose = require('mongoose');
var winston = require('winston');
var config = require('../config/config'); 
var debug = require('debug')('test/routes.js');
var port = process.env.PORT || 8080;
var expect = require('expect.js');
var routes = rewire('../app/routes.js');
routes(app);

//loging api operations
console.log("starting logger...");
winston.add(winston.transports.File, {
  filename: config.logger.api
});

// loging all uncaught exceptions into exceptions.log
winston.handleExceptions(new winston.transports.File({
  filename: config.logger.exception
}));

console.log("logger started. Connecting to MongoDB...");
mongoose.connect(config.db.mongodb);
console.log("Successfully connected to MongoDB. Starting web server...");
app.listen(port);
console.log("Express server listening on port %d", port);

console.log("Successfully started web server. Waiting for incoming connections...");

describe('Testing Routes', function() {
 before(function mockCallsToMongoDb() {
    routes.__set__('Todo', {
      find: function find(conditions, projection, options, callback) {
        var payload = [{ text: 'Todo 1' }, { text: 'Todo 2' }, { text: 'Todo 3' }, { text: 'Todo 4' }, { text: 'Todo 5' }, { text: 'Todo 6' }];
        conditions(null, payload);
      }
    });
  });

  it('returns expected payload for /api/todos route', function(done) {
    request(app)
      .get('/api/todos')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        expect(res.body.length).to.eql(6);
        expect(res.body[0].text).to.eql('Todo 1');

        done();
      });
  });

  it('returns a HTML document for / route', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res) {
        expect(res.text.substring(0, 15)).to.eql('<!doctype html>');
        done();
      });
  });

  it('returns 404 for a URL route that doesn\'t exist', function(done) {
    request(app)
      .get('/api/this-does-not-exist')
      .expect(404)
      .end(function(err, res) {
        if (err) throw err;
        done();
      });
  });
});