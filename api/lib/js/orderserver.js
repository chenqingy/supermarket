var io = require('socket.io')();
//events

io.on("connection", function(client){
    client.on('LinkStart',function(){
        console.log('LinkStart');
    })
    client.on("printStart", function(){
        
        io.emit("printOpen");
    })
    client.on("printOver", function(){
        
        io.emit("printEnd");
    })
    // client.on("Printover", function(print){
    //     io.emit("Printover");
    // })
})

io.listen(888);