var express = require('express');
var router = express.Router();

var Movie = require('../models/movie.js')
//var right = require('./right.js')//查找权限
var _ = require('underscore')
var Comment = require('../models/Comment.js')
var Category = require('../models/category.js')


/* GET movie detail page影片详情页 */
router.get('/movie/:id', function(req, res, next) {
  var id = req.params.id;
  console.log("这个/movie/:id的网页中的id是:" + id);
  if(id){
    Movie.findById(id, function(err, movie){
      console.log("detail页面的movie是："+ movie)
      /**
        * 在comment数据库中，找到当前movie的所有评论内容（有_id，meta，movie，from，content，to）
        * 通过populate方法获取from信息（schemas/comment中定义了from是去uers数据库查询），记录其key为from.name
        * 当查询到后，当作总体comments发送给detail.jade调用
        */
      Comment
        .find({movie: id})
        .populate('from', 'name')
        .populate('reply.from', 'name')//谁回复的
        .populate('reply.to', 'name')//回复给谁（楼主或层主）
        //传递给jade模版时key名为reply.to.name
        .exec(function(err, comments){
          console.log("comments:", comments)
          res.render('./pages/movie_detail', {
            title: movie.title,
            movie: movie,
            comments: comments
          })
        })
    })
  }
});



/* GET movie admin page新建影片信息界面 */
router.get('/admin/movie', function(req, res, next) {
  Category.find({}, function(err, categories){
    res.render('./pages/movie_admin', { 
      title: '后台电影录入页',
      movie: [{
        title:'',
        poster: '',
        director: '',
        country: '',
        year: '',
        language: '',
        flash: '',
        summary: '',
      }],
      //movie: {},
      categories: categories
    });
  })
});




/* GET list page影片列表页 */
router.get('/admin/movie/list', function(req, res, next) {
  Movie.fetch(function(err,movies){
    if(err){
      console.log(err)
    }
    res.render('./pages/movie_list', { 
      title: '后台电影列表页',
      movies: movies
    });
  }); 
});



/* list delete movie删除影片功能 */
router.delete('/admin/movie/list', function(req, res){
  //从list页面传来的delete操作
  var id = req.query.id
  if(id){
    Movie.remove({_id: id}, function(err, movie){//从数据库中remove移除
      if(err){
        console.log(err)
      }else{
        console.log(movie)
        res.json({success:1})
      }
    })
  }
})



/* list.jade upadate movie to admin.jade进入更新影片页面 */
router.get('/admin/movie/update/:id', function(req, res){
  var id = req.params.id
  if(id) {
    Category.find({}, function(err, categories){//获取所有分类放在页面中供选择
      Movie.findById(id, function(err, movie){
        res.render('./pages/movie_admin', {
          title: '后台电影更新页',
          movie: movie,
          categories: categories
        })
      })
    })
  }
})




/* post movie from admin.jade上传影片功能 */
router.post('/admin/movie/new', function(req, res){
  console.log(req.body)
  var id = req.body.movie.id//方法二  当向node服务器post发送数据时，键值对在请求的body里
  //var id = req.body.movie._id   方法一
  var movieObj = req.body.movie
  //var _movie = new Movie()
  var _movie

  if(id !== 'undefined'){
    console.log('已有电影')
    Movie.findById(id, function(err, movie){
      if(err){
        console.log(err)
      }
      //用新的数据movieObj替换掉老的movie，extend就是替换改变的对应字段的用于object的方法
      _movie = _.extend(movie, movieObj)
      _movie.save(function(err, movie){ //save方法是数据库的插入文档方法
        if(err){
          console.log(err)
        }
        res.redirect('/movie/' + movie._id)
      })
    })
  }else{
    console.log('新建电影')
    var _movie = new Movie(movieObj)//方法二
    /*方法一
    _movie = new Movie({
      director: movieObj.director,
      category: movieObj.category,
      title: movieObj.title,
      country: movieObj.country,
      language: movieObj.language,
      year: movieObj.year,
      poster: movieObj.poster,
      summary: movieObj.summary,
      flash: movieObj.flash
    })*/

    var categoryId = _movie.category

    _movie.save(function(err, movie){
      console.log(" _movie.save(function(err, movie):",movie)
      if(err){
        console.log(err)
      }
      
      console.log("跳转之前电影的id是：" + movie._id);
      Category.findById(categoryId, function(err, category){
        category.movies.push(movie._id)
        category.save(function(err, category){
          res.redirect('/movie/' + movie._id)
        })
      })
    })
    
  }
})





module.exports = router;