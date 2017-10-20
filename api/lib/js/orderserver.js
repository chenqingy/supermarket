var io = require('socket.io')();
//events

io.on("connection", function(client){
    // console.log(123);
    // client.on('ServerLogin', function(_person){
    //     io.emit("CreatePersons", JSON.stringify(onlinePersons));   
    // })

    client.on("printStart", function(){
        console.log('printStart');
        io.emit("printOpen");
    })

    // client.on("Printover", function(print){
    //     io.emit("Printover");
    // })
})

io.listen(888);