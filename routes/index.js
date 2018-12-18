var express = require('express') 
var mongoose = require('mongoose')

//var path = require('path')
var router = express.Router();//路由
var Movie = require('../models/movie.js')//models里是数据库模型实例，其中模型和模型的方法是schemas里的
var Category = require('../models/category.js')
var right = require('./right.js')//查找权限
//var User = require('../models/user.js')
var _ = require('underscore')//使Object有像Array的 map()和filter()之类方法


// 连接mongodb数据库imooc，mongoose的连接要写在路由文件中
mongoose.connect('mongodb://localhost/imooc', { useNewUrlParser: true })
mongoose.Promise = global.Promise;//将mongoose已经不被建议的Promise方法替换
var db = mongoose.connection;// 实例化连接对象
db.on('error', console.error.bind(console, 'MongoDB连接错误:'));
db.once('open', (callback) => {console.log('MongoDB连接成功！！')})





/* pre handle user 路由拦截 */
router.all('*', function(req, res, next){
  var _user = req.session.user
  req.app.locals.user = _user;//检查登陆状态

  console.log('app.locals:',req.app.locals.user)
  return next()
})



/* midware for admin */
router.all('/admin/*' , right.signinRequired, right.adminRequired)



/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("user's sessison:",req.session.user)
  Category//Category实例
    .find({})
    /***********schema中：movies: [{type: ObjectId, ref: 'Movie'}]
   * .populate(path, [select], [model], [match], [options])
   *    path：要填充的关联字段，此处是movies;
   *    select:指定填充 document 中的哪些字段;
   *    model:指定关联字段的 model，如果没有指定就会使用Schema的ref,此处是Movie
   *    match:指定附加的查询条件。
   *    options:指定附加的其他查询选项，如排序以及条数限制等等。
   */
    .populate({path: 'movies', options: {limit: 5}})
    .exec(function(err, categories){
      if(err){
        console.log(err)
      }
      res.render('./pages/index', { 
        title: '首页',
        categories: categories
      })
      //这种挂载的变量信息除了放在res.render中，也可以写在res.local中（只会有当前请求中起作用）
      //对应挂载的常量信息写在app.local中（前应用所有的渲染模中访问）
    })

});


module.exports = router;
