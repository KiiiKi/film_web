var express = require('express');
var router = express.Router();

var User = require('../models/user.js')
//var right = require('./right.js')//查找权限

/* GET user signup用户注册页面 */
router.get('/signup', function(req, res){
  res.render('./pages/signup', {
    title: '注册',
  })
})



/* POST user signup用户注册功能 */
router.post('/user/signup', function(req, res, next){
  var _user = req.body.user
  /*  也可以使用req.param('user')
   *  它是express对body、query、路由三种的封装
   *  也就是路由为'/movie/:id'时可以通过req.params.id拿到param值
   *  若路由里有‘/movie/？userid=1111”这种就可以req.query.id获得query值
   *  而post的data传过来在body中就用req.body.**
   */
  User.findOne({name: _user.name}, function(err, user){
    if(err){
      console.log(err)
    }
    if(user){
      console.log("已注册!")
      return res.redirect('/signin')//有账户，重定向到登陆
    }
    else{
      var user = new User(_user)//数据库模型
      user.save(function(err, user){
        if(err){
          console.log(err)
        }
        console.log(user)
        return res.redirect('/')
      })
    }
  }) 
})


/* GET user signin用户登陆页面 */
router.get('/signin', function(req, res){
  res.render('./pages/signin', {
    title: '登陆',
  })

})



/* POST user signin用户登陆功能 */
router.post('/user/signin', function(req, res){
  var _user = req.body.user
  var {name, password} = _user
  User.findOne({name: _user.name}, function(err, user){
    if(err){
      console.log(err)
    }
    if(!user){
      return res.redirect('/signup')
    }
    user.comparePassword(password, function(err, isMatched){
      if(err){
        console.log(err)
      }
      if(isMatched){
        console.log("密码正确")
        req.session.user = user
        //将session存入了数据库sessions集合中，重启服务也能在get请求时一起发送给服务器（cookie中key为connect.sid的就是sessionid）
        return res.redirect('/')
      }else{
        console.log("密码错误")
        return res.redirect('/signin')
      }
    })
  })
})



/* GET user logout用户退出页面 
router.get('/logout', function(req, res){
  res.render('./pages/logout', {
    title: '退出',
  })
  next()
  
})
*/


/* GET user logout用户退出功能 */
router.get('/logout', function(req, res){
  delete req.session.user
  console.log("user's sessison:",req.session.user)
  delete req.app.locals.user
  console.log('app.locals:',req.app.locals.user)
  res.redirect('/')
})



/* GET userlist page用户列表页 */
//方法一：router.get('/admin/user_list', right.signinRequired, right.adminRequired, function(req, res, next) {
router.get('/admin/user/list', function(req, res, next) {
  User.fetch(function(err,users){
    if(err){
      console.log(err)
    }
    res.render('./pages/user_list', { 
      title: '用户列表页',
      users: users
    });
  }); 
});


module.exports = router;
