var prepareSocket = function(socket){

  console.log("A socket connected")

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
    var timeinterval = setInterval(updateClock,1000);
  }


  socket.on('set_timer',function(){
    var t = new Date();
    t.setSeconds(t.getSeconds()+5);
    initializeClock(t);
    socket.broadcast.emit('timer_is_set',t)
    socket.emit('timer_is_set',t)
  })

  socket.on('set_paragraph',function(para){
    global.paragraph = para
  })

  socket.on('disconnect',function(){
    console.log("Bye Bye");
  });

}
module.exports = prepareSocket
