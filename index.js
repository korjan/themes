var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var _ = require('underscore');

var events = [];

var MONGOHQ_URL="mongodb://heroku:qZb3jrB8TU34LStxxtKKCIiPo7mZoMQ6xZ2VNzyVBWNmy4tm2n8NsOFn0ebR0Wk7FaIqEuOhKN9XHRVO-ZKRRA@lennon.mongohq.com:10031/app32045436"

// npm install mongodb
var mongodb = require('mongodb')
  , MongoClient = mongodb.MongoClient
 
var db = MongoClient.connect(MONGOHQ_URL, function(err, db) {
  // operate on the collection named "test"
  console.log('oyooo');
});

server.listen(8080);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

// var rules = db.collection('rules').find();
