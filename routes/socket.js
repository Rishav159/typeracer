var prepareSocket = function(socket){

  var getTimeRemaining = function(endtime){
    var now = new Date();
    var t = Date.parse(endtime) - Date.parse(now);
    var seconds = Math.floor( (t/1000) % 60 );
    var minutes = Math.floor( (t/1000/60) % 60 );
    var hours = Math.floor( (t/(1000*60*60)) % 24 );
    var days = Math.floor( t/(1000*60*60*24) );

    if(t<=0){
      return {
        'total': 0,
        'days': 0,
        'hours': 0,
        'minutes': 0,
        'seconds': 0
      };
    }else{
      return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
      };
    }
  }
  var initializeClock = function(endtime){
    function updateClock(){
      var t = getTimeRemaining(endtime);
      if(t.total<=0){
        clearInterval(timeinterval);
        socket.emit('start_game',global.paragraph)
        socket.broadcast.emit('start_game',global.paragraph)
      }
    }
    updateClock()
    var timeinterval = setInterval(updateClock,10);
  }


  socket.on('set_timer',function(){
    var t = new Date();
    global.start_time = t
    t.setSeconds(t.getSeconds()+5);
    initializeClock(t);
    socket.broadcast.emit('timer_is_set',t)
    socket.emit('timer_is_set',t)
  })

  socket.on('set_paragraph',function(para){
    global.paragraph = para
  })

  socket.on('disconnect',function(){
    delete global.players[socket.id];     //deletes ID of socket on disconnection
    //console.log("global.players="+JSON.stringify(global.players));
    console.log("Bye Bye socket with id="+socket.id);
  });

  socket.on('new_player',function(data){
    socket.id = data
    console.log("A new player connected with socket_id="+socket.id);
    global.players[socket.id]={};
    global.players[socket.id]['score']=0;
    global.players[socket.id]['time']=new Date();
    global.players[socket.id]['finish_time'] = 0;
    console.log("global.players="+JSON.stringify(global.players));
  });

  //gets ID of the socket that emits 'correct' event and increments its score in global.players
  socket.on('correct',function(time){
    global.players[socket.id]['score']++;
    global.players[socket.id]['time'] = time;
    console.log("correct word by player with socket_id "+socket.id);
    console.log(JSON.stringify(global.players));
    socket.broadcast.emit('leaderboards',global.players,global.start_time);
  });

  socket.on('finish',function(data){
    global.players[socket.id]['finish_time']=Date.parse(global.start_time)-Date.parse(data);
    console.log(socket.id+" finished @"+global.players[socket.id]['finish_time']);
  });

}
module.exports = prepareSocket
