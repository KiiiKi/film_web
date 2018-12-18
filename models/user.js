var mongoose = require('mongoose')
var UserSchema = require('../schemas/user.js')

//创建movie模型，传入模型名字和模型模式
var User = mongoose.model('User', UserSchema)

//将这个构造函数导出
module.exports = User
