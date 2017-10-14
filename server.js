var http = require('http');
var path = require('path');
var utils = require('./auth/utils.js');
var async = require('async');
var express = require('express');
var bodyParser = require('body-parser');

var router = express();
var server = http.createServer(router);

router.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    res.setHeader('Access-Control-Allow-Credentials', true);

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
  var senha = req.headers.senha;
  var login = req.headers.login;
  
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
  var senhaReq = req.headers.senha;
  var loginReq = req.headers.login;
  
  var dados = utils.findUserByLogin(loginReq)[0];
  
  var senhaDesc = utils.decriptFromHex(dados.senha);
  if(senhaDesc == senhaReq){
    res.status(200).send("ok auth");    
  }
  else{
    res.status(200).send("Não foi possível autenticar!");  
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



router.post('/upload', function (req, res, next) {
  
});



server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("App server listening at", addr.address + ":" + addr.port);
});