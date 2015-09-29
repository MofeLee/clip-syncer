var userid;
var client;

module.exports = function(io) {
  client = io.connect('http://10.10.1.182:8987');

  serverOk(client);
  newMessage(client);
  disconnected(client);

  return client;
};

function newMessage(client){
  client.on('new message', function(data){
    console.log(data.userid + ' : ' + data.msg);
  });
}

function serverOk(client) {
  client.on('server-ok', function(data) {
    console.log(data.msg);
    userid = data.userid;

    client.emit('client-ok', {
      userid: userid,
      msg: `成功连接到user${userid}客户端`
    });
  });
}

function disconnected(client) {
  client.on('connect', function() {
    // 握手
    client.on('user disconnected', function(data) {
      console.log(`user${data.userid}退出了连接`);
    });
  });

}
