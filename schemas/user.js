var mongoose = require('mongoose')
//schema定义类型，增加中间件、插件、静态方法等
var bcrypt = require('bcryptjs')//密码存储算法
var SALT_WORK_FACTOR = 10//密码计算强度

//给所有数据字段定义类型
var UserSchema = new mongoose.Schema({
  name: {
    unique: true,//唯一
    type: String
  },
  password:  String,
  role: {
    type: Number,//权限
    default: 0
  },
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


UserSchema.pre('save',function(next){
  var user = this;//因为下面用了闭包，this会改变为指向bcrypt？所以要指定user为函数最外层的userschema

  if(this.isNew) {//判断数据是否是新加入的
    this.meta.createAt = this.meta.updateAt = Date.now()
  }else {
    this.meta.updateAt = Date.now()
  }

  //先生成随机的盐，再将其与初始密码一起加密==》最终密码
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err,salt){
    if(err) return next(err)
    //进行哈希
    bcrypt.hash(user.password, salt, function(err, hash){
      if(err) return next(err);
      user.password = hash;
      next()//为了存储流程继续往下
    })
  })
})

//实例方法是要实例才能调，静态方法是模型就能调
//presave方法：在每次存储数据之前都调用一次
UserSchema.methods = {
  comparePassword: function(_password, cb){
    bcrypt.compare(_password, this.password, function(err, isMatched){
      if(err) return cb(err)
      cb(null, isMatched)
    })
  }
}

//静态方法
//(此处静态方法不会直接对数据库进行交互，要通过model编译实例化后才会具有这个方法)
UserSchema.statics = {
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


module.exports = UserSchema