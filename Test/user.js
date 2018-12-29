var crypto = require('crypto')
//密码类库，crypto是node 的 解密和加密模块
var bcrypt = require('bcryptjs')
//文件加密工具,对密码加密,是一种加密的方式

//获取随机字符串，用于user的用户名
function getRandomString(len){
  if(!len) len = 16
  return crypto.randomBytes(Math.ceil(len/2)).toString('hex')
  //randomBytes随机生成生成一个len/2长度的值，再hex转为16进制，再tostring
}

var should = require('should')
var app = require('../app.js')
var mongoose = require('mongoose')
var User = require('../models/user.js')

//test
//钩子函数有before，after，beforeEach，afterEach
var user
describe('<Unit Test', function(){
  describe('Model User:', function(){
    before(function(done){
      user = {//还未存数据库
        name: getRandomString(),
        password: 'password'
      }

      done()
    })
/**
 * 使用mocha测试异步代码是再简单不过了。
 * 只需要在测试完成的时候调用一下回调函数即可。
 * 通过添加一个回调函数(通常命名为done)给it()方法，
 * Mocha就会知道，它应该等这个函数被调用的时候才能完成测试。
 */
    describe('Before Method save:', function(){
      //it包裹测试用例,一个测试用例只能调用一次done
      it('should begin without test user', function(done){
        //对下面的内容进行检测，是不是length为0，是则输出‘√ should begin without test user’
        User.find({name: user.name}, function(err, users){
          //新创建用户时，检查这个用户名是否存在，
          //若不存在，才返回done，若存在，应该返回done(err)
          users.should.have.length(0)
     
          done()
        })
      })
    })


    describe('User save:', function(){
      it('should save without problems', function(done){
        var _user = new User(user)
        _user.save(function(err){
          should.not.exist(err)
          _user.remove(function(err){
            should.not.exist(err)

            done()
          })
        })
      })
      
      it('should password be hashed correctly', function(done){
        var password = user.password
        var _user = new User(user)
        _user.save(function(err){
          should.not.exist(err)
          _user.password.should.not.have.length(0)
          bcrypt.compare(password, _user.password, function(err, isMatch){
            should.not.exist(err)
            isMatch.should.equal(true)
            _user.remove(function(err){
              should.not.exist(err)

              done()
            })
          })
        })
      })
      it('should have default role 0', function(done){
        var _user = new User(user)
        _user.save(function(err){
          _user.role.should.equal(0)
          _user.remove(function(err){

            done()
          })
        })
      })
      it('should fail to save an existed user', function(done){
        var _user1 = new User(user)
        _user1.save(function(err){
          should.not.exist(err)
          var _user2 = new User(user)
          _user2.save(function(err){
            //疑问：不应该是save时出err，应该是不允许save（即findone出err）       
            should.exist(err)
            _user1.remove(function(err){
              if(!err){
                _user2.remove(function(err){
                  done()
                })
              }
            })
          })
        })
      })
    })

    after(function(done){
      done()
    })
  })

})

