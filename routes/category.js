var express = require('express');
var router = express.Router();

var Category = require('../models/category.js')


/* GET category 录入电影类别页面 */
router.get('/admin/category', function(req, res){
  res.render('./pages/category_admin', {
    title: '后台电影分类录入页',
    category: {}
  })
})

/* POST category 录入电影类别功能 */
router.post('/admin/catetory/new', function(req, res){
  console.log(req.body)
  var id = req.body.category._id//当向node服务器post发送数据时，键值对在请求的body里
  var _category = req.body.category
  var category = new Category(_category)

  category.save(function(err, category){
    if(err){
      console.log(err)
    }
    res.redirect('/admin/category/list')
  })
})

/* GET category 全部分类列表界面 */
router.get('/admin/category/list', function(req, res) {
  Category.fetch(function(err, categories){
    if(err){
      console.log(err)
    }
    res.render('./pages/category_list', { 
      title: '后台电影分类列表页',
      categories: categories
    });
  }); 
});



module.exports = router;
