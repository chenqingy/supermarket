var SocketServer = require('ws').Server;
var ws = new SocketServer({
    port: 222
})

ws.on("connection", function(client){
    console.log('connection');
    client.on("message", function(_data){
        // console.log(_data);
        // client.send("我是机器人，你好吗，我在.");
        // ws.aa(client, _data);
        if(_data){

        }
    })

    client.on('close', function(){
        console.log("你的好友***已经离开人世");
        // client.send("")
    })
})