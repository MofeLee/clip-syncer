var io = require('socket.io')(8987);
var clients = {};
var usercount = 0;

io.on('connection', function(socket) {
  var currentUserId;
  currentUserId = ++usercount;
  clients[currentUserId] = socket;

  remoteOk(currentUserId);
  getUserLists(currentUserId);
  disconnected(currentUserId);
});

function remoteOk(currentUserId){
  var socket = clients[currentUserId];

  socket.emit('server-ok', {
    userid: currentUserId,
    msg: `user${usercount}成功连接到服务器`
  });

  socket.on('client-ok', function(data) {
    socket.broadcast.emit('new message', {
      userid: currentUserId,
      msg: `Hello World!`
    });
    console.log(data.msg);
  });
}


function getUserLists(currentUserId){
  var socket = clients[currentUserId];

  socket.on('get user lists', function(){
    socket.emit('new message', {
      userid: 'server',
      msg: `[${Object.keys(clients)}]`
    });
  });
}

function disconnected(currentUserId){
  var socket = clients[currentUserId];

  socket.on('disconnect', function() {
    console.log(`user${currentUserId}失去连接`);
    delete clients[currentUserId];
    io.emit('user disconnected', {
      userid: currentUserId
    });
  });
}
