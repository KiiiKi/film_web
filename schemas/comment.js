var mongoose = require('mongoose')
//schema定义类型，增加中间件、插件、静态方法等
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId
//给所有数据字段定义类型
var CommentSchema = new Schema({
  movie: {type: ObjectId, ref: 'Movie'},//ref为指向movie这个模型（schema）
  from: {type: ObjectId, ref: 'User'},
  //使用objectid（每个schema都会默认配置objectid这个属性，属性名就是_id。是一个主键，索引时也是默认使用主键来索引）
  //的字段类型实现关联文档的查询
  reply:[{//评论里的叠楼回复
    from: {type: ObjectId, ref: 'User'},//谁回复的
    to: {type: ObjectId, ref: 'User'},//回复给谁（楼主或层主）
    //当此条comment为楼中楼时，那么comment.from和comment.reply.to都是被回复人
    //而comment.reply.from才是回复人
    content: String
  }],
  /* 在routes/movie.js中：
   * 使用populate功能来在定义一个schema时规定某一个字段时引用自另一个schema的字段。
   * mongo通过这个功能来通过引用schema和id来找到关联内容并代替
   * mongo没有关系型数据库中的join功能
   */
  content: String,
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
CommentSchema.pre('save',function(next){
  if(this.isNew) {//判断数据是否是新加入的
    this.meta.createAt = this.meta.updateAt = Date.now()
  }else {
    this.meta.updateAt = Date.now()
  }

  next()//为了存储流程继续往下
})



//静态方法
//(此处静态方法不会直接对数据库进行交互，要通过model编译实例化后才会具有这个方法)
CommentSchema.statics = {
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


module.exports = CommentSchema