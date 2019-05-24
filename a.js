//删除文件夹
//删除文件
//拦截非图片文件
const fs = require('fs');
const formidable = require('formidable');
const util = require('util');
const express = require('express');
const rf = require('rimraf');
const app = express();
app.engine('html',require('express-art-template'));
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use('/public', express.static('public'));
app.use('/uploads', express.static('uploads'));
var server = app.listen(4000,"0.0.0.0",function () {
    const host= server.address().address;
    const port = server.address().port;
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
});
app.get('/',function (req,res) {
    fs.readdir('./uploads',function (err,files) {
        res.render('index.html',{files})
    })
});
app.get('/show',function (req,res) {
    const dirName=req.query.dirName;
    fs.readdir('./uploads/'+dirName,function (err,files) {
        res.render('photo.html',{files,dirName})
    })
});
app.get('/del/:dir/:file',function (req,res) {
    const name=req.url.slice(4);
    fs.unlink('./uploads'+name,err=>console.log(err));
    res.redirect('/show?dirName='+req.params.dir)
});
app.get('/del/:dir',function (req,res) {
    const name=req.url.slice(4);
    rf('./uploads'+name,function (err) {
        console.log(err);
        res.redirect('/')
    })
});
app.post('/newDir',function (req,res) {
    fs.mkdir('./uploads/'+req.body.name,function (err) {
        if(err){
            return res.send('文件夹已存在')
        }
         res.redirect('/');
    })
});
app.post('/upload',function (req,res) {
    var form = new formidable.IncomingForm();
    console.log(req);
    form.uploadDir='./';
    form.parse(req, function(err, fields, files) {
      // res.writeHead(200, {'content-type': 'text/plain'});
      // res.write('received upload:\n\n');
      // res.end(util.inspect({fields: fields, files: files}));
        const oldPath=files.upload.path;//'uploads\\upload_eaf3aae723a63fa69532ded31e6dd10f'
        const name=files.upload.name.toLowerCase();//'寰俊鎴浘_20190328145925.png'
        const re=/(jpg|png|gif|bmp|jpeg)/;
        if(re.test(name)){
            const last=name.slice(name.indexOf('.'));
            const na= (new Date()).toLocaleString().replace(/[- :]/g,'');//'寰俊鎴浘_20190328145925.png'
            const dir=fields.dirList;
            fs.rename(oldPath,'./uploads/'+dir+'/'+na+last,function (err) {
                console.log(err)
            })
            res.redirect('/show?dirName='+dir);
        }else{
            res.send('非图片文件,请重新上传<a href="/">返回</a>')
            fs.unlink(oldPath,err=>console.log(err))
        }
    });
});


