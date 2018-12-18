#### 安装grunt
1. npm install grunt -g
2. npm install grunt-cli -g  （grunt的命令行接口，会把grunt命令植入到系统路径里，就允许从任意的目录来运行
3. 安装加载任务的插件  


##### 1. Fatal error: Unable to find local grunt.  
> 先安装grunt-cli后npm install grunt --save-dev  

##### 2. Running "concurrent:tasks" (concurrent) task卡住，不跳出窗口/localhost没有运行
```
//把nodemon改一下
nodemon: {
        dev: {
          script: './bin/www',
          options: {
            args: [],
            nodeArgs: ['--inspect'],
            ignore: ['README.md', 'node_modules/**', '.DS_Store'],
            ext: '',
            watch: ['./'],
            delay: 1000,
            env: {
              PORT: 3000
            },
            cwd: __dirname
          }
        }
    },
```

 ##### 3. pass option { useNewUrlParser: true } to MongoClient.connect.
 > 在routes/index里的mongoose.connect加上{ useNewUrlParser: true }
    
 ##### 4. 密码加盐哈希
 
 应该使用什么哈希算法：
 * 哈希加密算法，比如SHA256，SHA512，RipeMD，WHIRLPOOL，SHA3等等
 * 设计良好的密钥扩展算法，如PBKDF2，bcrypt，scrypt
 * 安全的crypt()版本（$2y$，$5$，$6$）
 
 ##### 5. 安装bcrypt出node-pre-gyp WARN Using needle for node-pre-gyp https download
 > npm install bcryptjs --save  
var bcrypt = require('bcryptjs')

 ##### 6. 录入到数据库不用自己新建库
 > 例如models/user.js中mongoose.model('User', UserSchema) 那么数据库中包含这些数据的库就自动建成users库，就是“模型名字”+“s”
 
 ##### 7. express4的cookie-parser和express-session安装
 > npm install express-session --save  
   npm install cookie-parser --save
  ```
    var cookieParser = require('cookie-parser')
    var session = require('express-session')
    app.use(cookieParser())
    app.use(session({
        secret: 'imooc'
    }))
  ```
  
 ##### 8. require('connect-mongo')时 Most middleware (like session) is no longer bundled with Express and must be installed separately.
 > 改成var mongoStore = require('connect-mongo')(session)
 
 ##### 9. 在router里挂载app.locals全局变量
 > res.locals属性仅在请求的生命期内有效。（相当于res.render），但是app.locals又是在app.js中用的，不能用在router中  
 在中间件中用req.app.local，此属性保存对使用中间件的Express应用程序的实例的引用。
 
 ##### 10. Router.use() requires a middleware function but got a Object
 > router文件中忘了写module.exports = router;
 
 ##### 11. 评论二层\<a>中的data-tid是 #{reply.from._id}不是 #{reply.to._id}
 > 1. 当进入此页面时，router会包裹user、movie、comment信息。  
 > 2. 插入detail.jade界面，c点击二层评论（a评论b）时，传递comment._id和reply.from._id（__当用户c点击层主a来评论时，点击的target是（reply.from：a，reply.to：b），所以要获取reply.from来POST__）给javascript/detail.js  
 > 3. javascript/detail.js将传来的递comment._id和reply.from._id以name为comment[cid]和comment[tid]的<input>插入到detail.jade的form里  
 > 4. 点击提交，POST给/user/comment路由，检测到这个评论楼存在，所以只push新的reply到数据库。此时reply的内容from=_comment.from即user._id;  to= _comment.tid即旧评论的reply.from._id
 
 ##### 12. OverwriteModelError: Cannot overwrite \`User` model once compiled.
 > mongoose.model()不能在两处将同一model定义两次
 
 ##### 13. CastError: Cast to ObjectId failed for value "" at path "_id" for model "Movie"
>  **因为post给'/admin/movie/new'里的var _movie = new Movie(movieObj)时把_id值（空的或者“undefined”）一起传递给了_movie并继续下面的保存操作**  
 > 从而mongodb认为已经有一个_id值了，就**没有**自动分配正确的objectid格式的_id值给_movie。所以导致save时出错，所以 _movie.save(function(err, movie)获取不到movie值  
 
**方法一：**  
 新建电影上传时手动选择不上传所写的_id
 ```
 //不用var _movie = new Movie(movieObj),用回：
 _movie = new Movie({
      director: movieObj.director,
      category: movieObj.category,
      title: movieObj.title,
      country: movieObj.country,
      language: movieObj.language,
      year: movieObj.year,
      poster: movieObj.poster,
      summary: movieObj.summary,
      flash: movieObj.flash
    })
 ```
 **方法二：**
> 1、admin.jade中写name = movie[id]  
> 2、movie-router中写var id = req.body.movie.id  
> 3、保存处继续写var _movie = new Movie(movieObj)  

* 这样做能通过判断id=='undefined'来决定是新建电影还是更新电影。但是在保存的时候，因为建立movie schema时没有id字段，所以并不会保存id字段（与方法一中的_id不同，_id是会自动创建的，不需要自己写字段）  
* 在保存时，mongodb自动为新建电影设置了_id,并保存到了movie数据库中，当选择更新电影时，movie_admin.jade中的value自动就是数据库中的#{movie._id}。  
* 更新保存时，movie[id]取到的就是_id,通过判断id=='undefined'得到为已有电影，则Movie.findById(id)也就是Movie.findById(_id)取到正确的内容。

 
        
 
 