var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', (req,res)=>{
   res.sendFile(__dirname +'/index.html');
});

var existingMessages = [];
var existingMessageCount = 0;
const maxMessages =  5;
var connectedClients = 0;

io.on('connection', (socket)=>{
connectedClients+=1;
console.log('client connected');
var thisSocketId = socket.id;
    io.emit('chat message', 'someone connected, with id:\t' +thisSocketId);
for(var i =0; i <existingMessageCount;i++){
console.log('old:\t'+existingMessages[i]);
io.to(thisSocketId).emit('chat message', existingMessages[i]);
}
socket.on('disconnect', ()=>{console.log('client DISconnected');     io.emit('chat message', 'someone left:\t'+thisSocketId); connectedClients-=1; if(connectedClients<1){existingMessages = [];
existingMessageCount = 0;}});
socket.on('chat message', function(msg){
existingMessageCount += 1;
if(existingMessageCount >maxMessages){
//handle overflow of messages;
}
existingMessages[existingMessageCount-1] = msg;
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

http.listen(3000, ()=>{
  console.log('server started on port 3000');
});
