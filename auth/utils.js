var aesjs = require('aes-js');
var fs = require('fs');
var db = require('./db.json');
var path = require('path');

// Bibliotecas para encriptação do arquivo
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr';

// An example 128-bit key (16 bytes * 8 bits/byte = 128 bits) 
var key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
module.exports = {
    criptoToHex: function (texto){
    
        var textoBytes = aesjs.utils.utf8.toBytes(texto);
      
        var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
      
        var encryptedBytes = aesCtr.encrypt(textoBytes);
      
        var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
        return encryptedHex;
    },
    allUsers: function(){
      return db;  
    },
    findUserByLogin: function(login){
        return db.filter(user => user.login == login);
    },
    decriptFromHex: function (texto){
        
        var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    
        var encryptedBytes = aesjs.utils.hex.toBytes(texto);
      
        var decryptedBytes = aesCtr.decrypt(encryptedBytes);
      
        // Convert our bytes back into text 
        var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
        
        return decryptedText;          
    },
    // Encriptar arquivo
    encrypt: function(file_name, key) {
        
        var jsonPath = generatePath(file_name);
        var jsonPathCriptoFile = generatePath(`cripto-${file_name}`);
        var stream_plain = fs.createReadStream(jsonPath);
        var encrypt = crypto.createCipher(algorithm, key);
        var output = fs.createWriteStream(jsonPathCriptoFile);
        
        stream_plain.pipe(encrypt).pipe(output);
        
        return jsonPathCriptoFile;
    
    },
    // Decriptar arquivo
    decrypt: function(file_name, key){
        var jsonPath = generatePath(`cripto-${file_name}`);
        var jsonPathDecriptFile = generatePath(`decrypt-${file_name}`);
        var stream_plain = fs.createReadStream(jsonPath);
        var decrypt = crypto.createDecipher(algorithm, key);
        var output = fs.createWriteStream(jsonPathDecriptFile);
        
        stream_plain.pipe(decrypt).pipe(output);
        
        return jsonPathDecriptFile;
    },
    createUser: function(login, senha){
        fs.appendFile('/db.json', `{"login":"${login}", "senha": "${senha}"}`, 'utf8', (err) => {
            if (err) throw err;
            console.log(`Sucesso ao salvar arquivo!`)
        });
        return true;
    }

}



function generatePath(file){
    return path.join(__dirname, '..', 'uploads', file);
}