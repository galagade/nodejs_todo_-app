
var rp = require('request-promise');
var Todo = require('./models/todo');
var Q = require('q');

function getTodos(res) {
  Todo.find(function(err, todos) {
    if (err) res.send(err)
    res.json(todos);
  });
};

function deletedata(req, res){
  var deferred = Q.defer();
  Todo.remove({
      _id: req.params.todo_id
    }, function(err, todo) {
      if (err)
        res.send(err);

      getTodos(res);
    });
  return deferred.promise ;
}
function savedata(data, res) {
  var deferred = Q.defer();
    Todo.create({
      text: data.body.text,
      done: false
    },function(err, todo) {
        if (err)
          res.send(err);
        getTodos(res);
    });
  return deferred.promise; 
}

module.exports = function(app) {

  app.get('/api/todos', function(req, res) {
    getTodos(res);
  });

  app.post('/api/todos', function(req, res) {
      savedata(req, res);
  });

  app.delete('/api/todos/:todo_id', function(req, res) {
    deletedata(req, res);
  });

  app.get('/', function(req, res) {
    res.sendfile('./public/index.html');
  });

};
