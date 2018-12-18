var express = require('express');
var router = express.Router();

var Comment = require('../models/Comment.js')
var right = require('./right.js')//查找权限

/* POST movie's comment 电影评论 */
router.post('/user/comment', right.signinRequired, function(req, res, next){
  var _comment = req.body.comment
  var movieId = _comment.movie
  
  // 没有点击头像-->没有动态插入input-->form表单里没有comment[cid]和comment[tid]-->post中没有cid和tid
  if(_comment.cid){
    //所以当点击了头像，则获得了评论楼id和楼主id，就可相应地插入reply内容
    Comment.findById(_comment.cid, function(err, comment){
      var reply = {
        //将post得来的_comment相关数据读取出来，再通过save到comment数据库的reply中
        //post得到的_comment有_id,cid,tid,movie,from,content,meta
        //按照楼号查询得到的comment有_id,movie,from,content,meta,relpy
        from: _comment.from,
        to: _comment.tid,
        content: _comment.content
      }
      comment.reply.push(reply)
      comment.save(function(err, comment){//save方法保存到数据库
        if(err){
          console.log(err)
        }
        res.redirect('/movie/' + movieId)
      })
    })
  }else{//表示这是新的评论楼，所以新建new一个comment
    var comment = new Comment(_comment)//新建数据库集合内容，并放入req中的评论详情
    comment.save(function(err, comment){//save方法保存到数据库
      if(err){
        console.log(err)
      }
      res.redirect('/movie/' + movieId)
    })
  }
})

module.exports = router;
