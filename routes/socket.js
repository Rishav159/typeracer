var prepareSocket = function(socket){

  global.players = global.players || {};
  global.paragraph = global.paragraph || '';
  global.start_time = global.start_time || null;

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
        var payload = {
          paragraph: global.paragraph,
          start_time: global.start_time
        };
        socket.emit('start_game',payload)
        socket.broadcast.emit('start_game',payload)
      }
    }
    updateClock()
    var timeinterval = setInterval(updateClock,10);
  }


  socket.on('set_timer',function(){
    for(var player in global.players){
      global.players[player]['score'] = 0
      global.players[player]['time'] = 0
    }
    var countdownSeconds = 5;
    var raceStart = new Date(new Date().getTime() + (countdownSeconds * 1000));
    global.start_time = raceStart;
    initializeClock(raceStart);
    var timerPayload = { countdown_to: raceStart };
    socket.emit('timer_is_set',timerPayload)
    socket.broadcast.emit('timer_is_set',timerPayload)

  })

  socket.on('set_paragraph',function(para){
    global.paragraph = para;
    console.log("Paragraph set to: "+para.substring(0,40)+"...");
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
    global.players[socket.id]['time']=0;
    console.log("global.players="+JSON.stringify(global.players));
    socket.emit('leaderboards',global.players,global.start_time);
    socket.broadcast.emit('leaderboards',global.players,global.start_time);
  });

  //gets ID of the socket that emits 'correct' event and increments its score in global.players
  socket.on('correct',function(time){
    global.players[socket.id]['score']++;
    global.players[socket.id]['time'] = time;
    console.log("correct word by player with socket_id "+socket.id);
    console.log(JSON.stringify(global.players));
    socket.broadcast.emit('leaderboards',global.players,global.start_time);
    socket.emit('leaderboards',global.players,global.start_time);
  });

  socket.emit('leaderboards',global.players,global.start_time);

}
module.exports = prepareSocket
