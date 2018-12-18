//用户权限
var signinRequired = function(req, res, next){
  var user = req.session.user
  if(!user){
    return res.redirect('/signin')
  }
  console.log("经过signin")
  next()
}
//管理员权限
var adminRequired = function(req, res, next){
  var user = req.session.user
  if(user.role <= 10){
    return res.redirect('/signin')
  }
  console.log("经过admin")
  next()
}
/**
 * 方法一：
 * router.get('**', right.signinRequired, right.adminRequired, function(req, res, next) {})
 */
module.exports.signinRequired = signinRequired;
module.exports.adminRequired = adminRequired;