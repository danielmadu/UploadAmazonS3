var express = require('express');
var fs = require('fs');
var aws = require('aws-sdk');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');

var multipartMiddleware = multipart();

var AWS_ACCESS_KEY = ''; // Não se esqueça de colocar a chave de acesso gerada no console da Amazon
var AWS_SECRET_KEY = ''; // // Não se esqueça de colocar a chave secrets gerada no console da Amazon
var S3_BUCKET = 'meu-bucket';

var done = false;

aws.config.update({ accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY });

var app = express();

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return next();
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


// Rotas

app.get('/upload', function(req, res){
    res.sendfile('views/upload.html');
});

app.post('/upload_submit', multipartMiddleware, function(req, res) {
    console.log(req.files.arquivo);
    fs.readFile(req.files.arquivo.path, function (err, data) {
        if (err) { throw err; }

        var base64data = new Buffer(data, 'binary');
        var s3 = new aws.S3();
        s3.putObject({
            Bucket: S3_BUCKET,
            Key: Date.now() + '-' + req.files.arquivo.name,
            Body: base64data,
            ContentType: req.files.arquivo.type,
            ACL: 'public-read'
        },function (resp, data) {
            console.log(data);
            console.log('Arquivo enviado com sucesso!');
        });
    });

    if(req.files !== undefined){
        res.redirect("/upload");
    }else{
        res.send("Erro: Nenhum arquivo selecionado");
    }

});

var server = app.listen(3000);
console.log('Servidor inicializado na porta 3000');
