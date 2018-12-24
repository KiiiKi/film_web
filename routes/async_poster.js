
var fs = require('fs')//文件读写模块
var path = require('path')//文件路径模块
//因为文件的读写操作是异步的，所以一定要先读写后，才继续保存操作
//因此加入此中间件
var async = function(req, res, next){
  //经过express.multipart()中间件处理后
  //TODO:yct-science里面没有用<input type = file>的path属性以及没有用到readfile和writefile
  var posterData = req.files.uploadPoster//file
  //input上传的文件为file类型，且name为uploadposter
  var filePath = posterData.path//file的路径
  var originalFilename = posterData.originalFilename//file的原始名字（用来做是否上传文件的判断）
  console.log('files:', req.files)

  

  if(originalFilename){
    fs.readFile(filePath, function(err, file){
      //通过读取filepath获得海报的具体数据file
      var timestamp = Date.now()//生成时间戳用来命名新的poster文件名字
      var type = posterData.type.split('/')[1]//获得type，例如png
      var poster = timestamp + '.' + type//新的完整名字
      var newPath = path.join(__dirname, '../', 'public/upload/' + poster)//存入服务器中的存储地址
      /*__dirname为当前async_poster.js所在的目录
        ../public/upload/返回public/upload文件夹*/
      fs.writeFile(newPath,  file, function(err){
        req.poster = '/upload/' + poster //存在public中的相对路径海报（要自己拼接再使用）
        next()
      })
    })
  }else{
    next()
  }
}

module.exports.async = async;