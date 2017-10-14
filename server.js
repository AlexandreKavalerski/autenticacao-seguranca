//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');
var utils = require('./auth/utils.js');
var async = require('async');
var socketio = require('socket.io');
var express = require('express');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, 'client')));
// Add headers
router.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

router.get('/home', function(req, res){
  var home = [{"nome":"Alexandre"}, {"nome":"Henrique"}]
  res.status(200).send(home);  

});

//Cadastrar novo usuario: [Melhorar]
router.post('/signup', function(req, res){
  var senha = req.headers.senha;
  var login = req.headers.login;
  
  var senhaCriptoHex = utils.criptoToHex(senha);
  var loginCriptoHex = utils.criptoToHex(login);
  
  console.log(`Senha antes de criptografar: ${senha}`);
  console.log(`Senha após criptografar: ${senhaCriptoHex}`);
  
  console.log(`Login antes de criptografar: ${login}`);
  console.log(`Login após criptografar: ${loginCriptoHex}`);
  
  res.status(200).send("ok");  
});

//Fazer Login no sistema:
router.post('/auth', function(req, res){
  //Senha e Login vêm descriptografados
  /*Deve-se: 
    * Procurar o login no banco junto com a senha [criptografada]
    * Descriptografar a senha [do bd] e comparar com a informada [na requisição]
  */
  var senhaReq = req.headers.senha;
  var loginReq = req.headers.login;
  
  var dados = utils.findUserByLogin(loginReq)[0];
  
  var senhaDesc = utils.decriptFromHex(dados.senha);
  if(senhaDesc == senhaReq){
    res.status(200).send("ok auth");    
  }
  else{
    res.status(403).send("forbidden");  
  }
});

router.post('/encrypt', function(req, res){
  utils.encrypt();
  res.status(200).send("success");
});

router.get('/decrypt', function(req, res){
  utils.decrypt();
  res.status(200).send("success");
});

router.post('/upload', function (req, res, next) {
  
});



server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("App server listening at", addr.address + ":" + addr.port);
});