
var createError = require('http-errors');// HTTP Error是一种响应错误。根据不同的错误,会提示相应的错误代码
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');//cookie-parser 的作用就是设置，获取和删除 cookie。
var session = require('express-session')
var mongoose = require('mongoose')
var mongoStore = require('connect-mongo')(session)
var logger = require('morgan');//记录日志
var bodyParser = require('body-parser');//对post请求的请求体进行解析，可获得一个JSON化的req.body,也就是将post的req.body初始化为一个对象
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var moviesRouter = require('./routes/movie');
var commentRouter = require('./routes/comment');
var categoryRouter = require('./routes/category');

var app = express();

app.set('views', path.join(__dirname, 'views'));//设置模版在views文件夹下。之后在路由中调用视图模版时，可以省略写views/路径
app.set('view engine', 'jade');//设置视图模版引擎为jade

app.use(logger('dev'));//将请求信息打印在控制台，便于开发调试
//生产环境中，需要将日志记录在log文件里：app.use(logger('combined', {stream : accessLog}));


//用户登陆保持session+cookie
app.use(cookieParser());
app.use(session({
  resave: true, //每次请求都重新设置session cookie，假设你的cookie是10分钟过期，每次请求都会再设置10分钟
  saveUninitialized: true, //无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
  secret: 'imooc',//secret防止篡改cookie
  store: new mongoStore({
    url: 'mongodb://localhost/imooc',
    collection: 'sessions' //存入的数据库的集合名（FIXME:只能存入当前登陆的用户信息？？？）
    //session信息在存入sessions数据库的时候会自动生成多这个session的_id和expires
  })
}))


app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));  
//app.use(express.urlencoded({ extended: false }));



app.use(express.static(path.join(__dirname, 'public')));//静态文件位置

app.locals.moment = require('moment')//获取各种时间格式

app.use('/', indexRouter);//设置主路由路径
app.use('/', usersRouter);
app.use('/', moviesRouter);
app.use('/', commentRouter);
app.use('/', categoryRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error')
});


//测试环境中的日志（好用！！！！）
var logger = require('morgan')
if('development' === app.get('env')){
  app.set('showStackError', true)
  app.use(logger(':method :url :status'))
  app.locals.pretty = true
  mongoose.set('debug', true)

}

module.exports = app;
