var mongoose = require('mongoose')
var MovieSchema = require('../schemas/movie.js')

//创建movie模型，传入模型名字和模型模式
var Movie = mongoose.model('Movie', MovieSchema)

//将这个构造函数导出
module.exports = Movie


