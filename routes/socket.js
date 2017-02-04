var prepareSocket = function(socket){
  socket.emit('msg',"Welcome to the room");
  socket.on('msg',function(data){
    socket.broadcast.emit('msg',data)
  });
  socket.on('disconnect',function(){
    console.log("Bye Bye");
  })
}
module.exports()
