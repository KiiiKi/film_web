var mongoose = require('mongoose')
var CommentSchema = require('../schemas/comment.js')

//创建movie模型，传入模型名字和模型模式
var Comment = mongoose.model('Comment', CommentSchema)

//将这个构造函数导出
module.exports = Comment
