var http = require('http');
var path = require('path');
var utils = require('./auth/utils.js');
var async = require('async');
var express = require('express');
var bodyParser = require('body-parser');

var router = express();
var server = http.createServer(router);

router.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json())


router.get('/', function(req, res){
  var allUsers = utils.allUsers();
  res.status(200).send(allUsers);  

});

//Cadastrar novo usuario: [Melhorar]
router.post('/signup', function(req, res){
  var senha = req.body.senha;
  var login = req.body.login;
  
  var senhaCriptoHex = utils.criptoToHex(senha);
  var loginCriptoHex = utils.criptoToHex(login);
  
  console.log(`Senha antes de criptografar: ${senha}`);
  console.log(`Senha após criptografar: ${senhaCriptoHex}`);
  
  console.log(`Login antes de criptografar: ${login}`);
  console.log(`Login após criptografar: ${loginCriptoHex}`);
  
  //var result = utils.createUser(login, senhaCriptoHex);
  
  res.status(200).send("ok");  
});

//Fazer Login no sistema:
router.post('/auth', function(req, res){
  //Senha e Login vêm decriptados
  /*Deve-se: 
    * Procurar o login no banco junto com a senha [criptografada]
    * Descriptografar a senha [do bd] e comparar com a informada [na requisição]
  */
  
  var senhaReq = req.body.senha;
  var loginReq = req.body.login;
  
  var dados = utils.findUserByLogin(loginReq)[0];
  
  var senhaDesc = utils.decriptFromHex(dados.senha);
  console.log(senhaDesc)
  if(senhaDesc == senhaReq){
    res.status(200).send({"confirmed":true, "message":"ok auth"});    
  }
  else{
    res.status(200).send({"confirmed":false, "message":"Não foi possível autenticar!"});  
  }
});

router.post('/encrypt', function(req, res){
  var fileName = req.body.file_name;
  var key = req.body.key;
  var generatedFile = utils.encrypt(fileName, key);
  
  res.download(generatedFile);
});

router.post('/decrypt', function(req, res){
  var fileName = req.body.file_name;
  var key = req.body.key;
  var generatedFile = utils.decrypt(fileName, key);
  
  res.download(generatedFile);
});



router.get('/list-files', function (req, res) {
  var files = utils.listFiles();
  console.log(files);
  res.status(200).send(files);
});



server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("App server listening at", addr.address + ":" + addr.port);
});