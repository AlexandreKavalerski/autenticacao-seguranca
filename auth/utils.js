var aesjs = require('aes-js');
var fs = require('fs');
var db = require('./db.json');

// Bibliotecas para encriptação do arquivo
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = '31233333321';

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
    findUserByLogin: function(login){
        /*
        var db = fs.readFile('./db.json', 'utf8', (erro, dados) => {
             //if (erro) throw erro;
             console.log(dados);
             
        });
        */
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
    encrypt: function(file_url) {
        file_url = '200px-1-Up_Mushroom_Artwork_-_Super_Mario_3D_World.png';
        var stream_plain = fs.createReadStream(file_url);
        var encrypt = crypto.createCipher(algorithm, password);
        var output = fs.createWriteStream('test-enc.txt');
        
        stream_plain.pipe(encrypt).pipe(output);
    },
    // Decriptar arquivo
    decrypt: function(file_url){
        file_url = 'test-enc.txt';
        var stream_encryp = fs.createReadStream(file_url);
        var decrypt = crypto.createDecipher(algorithm, password);
        var output = fs.createWriteStream('test-dec.png');
        
        stream_encryp.pipe(decrypt).pipe(output);
    }

}