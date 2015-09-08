var app = require('./config/express');
var configAws = require('./config/aws');
var fs = require('fs');
var aws = require('aws-sdk');
var multipart = require('connect-multiparty');

var multipartMiddleware = multipart();

var done = false;

aws.config.update({accessKeyId: configAws.AWS_ACCESS_KEY, secretAccessKey: configAws.AWS_SECRET_KEY});

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
            Bucket: configAws.S3_BUCKET,
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

var server = app.listen(app.get('port'));
console.log('Servidor inicializado na porta ' + app.get('port'));
