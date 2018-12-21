$(function(){
  //拿到所有的删除按钮，并得出当前按下的删除target
  $('.del').click(function(e){
    //e.target是dom对象，$(e.target)是jq对象
    // var target = $(e.target)
    var id = $(e.target).data('id')//就是list.jade中对应的每个的item._id
    var tr = $('.item-id-' + id)//对应这个id的一整行内容（由class名获取）

    $.ajax({
      type: 'DELETE',
      url: '/admin/movie/list?id='+id
      //请求发给/admin/movie/list页带一个id的query
    })
    .done(function(results){
      if(results.success === 1){
        if(tr.length > 0){
          tr.remove()//删除当前行
        }
      }
    })
  })

  $('#douban').blur(function(e){
    var douban = $(this)
    var id = douban.val()
    if(id){
      $.ajax({
        url: 'https://api.douban.com/v2/movie/subject/' + id,
        cache: true,
        type: 'get',
        dataType: 'jsonp',
        crossDomain: true,
        jsonp: 'callback',
        success: function(data){
          $('#inputTitle').val(data.title),//data来自豆瓣的数据返回
          $('#inputDirector').val(data.directors[0].name),
          $('#inputCountry').val(data.countries[0]),
          $('#inputPoster').val(data.images.large),
          $('#inputYear').val(data.year),
          $('#inputSummary').val(data.summary)    
        }
      })
    }
  })

})

