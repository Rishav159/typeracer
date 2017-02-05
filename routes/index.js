var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('new_player')
});
router.get('/admin',function(req,res,next){
  if(req.session['loggedin'] && req.session['loggedin'] == "admin"){
    res.render('admin');
  }else{
    res.redirect('/');
  }
})
router.post('/',function(req,res,next){
  if(req.body.name && req.body.password){
    if(req.body.name in global.players){
      res.send("Someone with same username already logged in")
    }
    else if(req.body.name == "admin") {
      if(req.body.password == "csemundis"){
        req.session['loggedin'] = req.body.name;
        res.redirect('/admin');
      }else {
        res.send("Trespassing is prohibited!")
      }
    }else{
      if(req.body.password == "typeracer"){
        req.session['loggedin'] = req.body.name
        console.log(req.session['loggedin']);
        res.redirect('/player/'+req.body.name);
      }else{
        res.send("Invalid Password")
      }
    }
  }else{
    res.send("Not enough information")
  }
})
router.get('/player/:name',function(req,res,next){
  console.log(req.session['loggedin']);
  console.log(req.params.name);
  if(req.session['loggedin'] == req.params.name){
    res.render('index');
  }else{
    res.redirect('/');
  }
})
module.exports = router;
