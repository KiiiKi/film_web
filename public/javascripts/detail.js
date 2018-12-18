$(function(){
  //点击class为comment的a组件，进行回复操作
  $('.comment').click(function(e){
    //$(e.target)和$(this)都是指当前点击对象
    var target = $(this)
    // data-*属性来嵌入自定义数据，通过$(selector).data(name)获取值
    var commentId = target.data('cid')//commentid是评论楼的id
    var toId = target.data('tid')//toid是楼主的id

    if($('#commentId').length > 0){
      $('#commentId').val(commentId)
    }else{
      $('<input>').attr({
        type: 'hidden',
        id: 'commentId',
        name: 'comment[cid]',
        value: commentId
      }).appendTo('#commentForm')
    }
   
    if($('#toId').length > 0){
      $('#toId').val(toId)
    }else{
      $('<input>').attr({
        type: 'hidden',
        id: 'toId',
        name: 'comment[tid]',
        value: toId
      }).appendTo('#commentForm')
    }
  })
})

