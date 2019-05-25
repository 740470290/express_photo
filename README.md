## 2019-5-25
### 1.后端的正则改为在前端用原生js进行正则判断
传到后端的数据直接就是图片格式,无需更多的逻辑处理,直接存储
### 2.监听input-file的onchange事件
选择的文件改变时,会在input框下面显示选择的文件名称,遍历file.files属性,得到一个数组,其中的name属性可以拿到文件名
### 3.实现一次上传多个文件
```sh
let allFiles = [];
    form.on('file', function (filed, file) {
        allFiles.push([filed, file]);
        console.log(allFiles);
    });
```
formidable有一个on方法,每多一个文件上传过来,它就会运行一次,得到一个数组allFiles,它包含一次上传的所有文件,然后进行遍历rename
