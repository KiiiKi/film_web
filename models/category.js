var mongoose = require('mongoose')
var CategorySchema = require('../schemas/category.js')

//创建movie模型，传入模型名字和模型模式
var Category = mongoose.model('Category', CategorySchema)

//将这个构造函数导出
module.exports = Category
