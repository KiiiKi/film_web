var mongoose = require('mongoose')
//schema定义类型，增加中间件、插件、静态方法等
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

//给所有数据字段定义类型
var CategorySchema = new Schema({
  name: String,
  movies: [{type: ObjectId, ref: 'Movie'}],//此分类下的所有电影id
  //movie和category双向映射
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

//presave方法：在每次存储数据之前都调用一次
CategorySchema.pre('save',function(next){
  if(this.isNew) {//判断数据是否是新加入的
    this.meta.createAt = this.meta.updateAt = Date.now()
  }else {
    this.meta.updateAt = Date.now()
  }

  next()//为了存储流程继续往下
})



//静态方法
//(此处静态方法不会直接对数据库进行交互，要通过model编译实例化后才会具有这个方法)
CategorySchema.statics = {
  //fetch用于取出数据库所有数据
  fetch: function(cb) {
    //find里为空表示查询所有内容，并按照更新时间sort排序
    return this.find({}).sort('meta.updateAt').exec(cb)
    //如果 exec() 找到了匹配的文本，则返回一个结果数组。否则，返回 null。
    
  },
  findById: function(id, cb) {
    return this.findOne({_id: id}).exec(cb)
  }
}


module.exports = CategorySchema