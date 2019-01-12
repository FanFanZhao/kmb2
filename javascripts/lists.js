$(function () {
  layer_loading();
  $.ajax({
    type: "get",
    url: laravel_api + "/ltc/list",
    data: {

    },
    dataType: "json",
    success: function (data) {
      layer_close();
      console.log(data);
      if (data.type == "ok") {
        if (data.message.length > 0) {
          render_list(data.message)
        }
      } else {
        layer_msg(data.message)
        return false;
      }
    },
    error: function () {
      layer_close();
      layer_msg("网络请求错误！")
      $(".blank_box").show();
    }
  });
  // initData({url: laravel_api + "/ltc/user_hav"},function(res){
  //     $('.count').html(res.hav_number)
  //     $('.sum').html(res.sum)
  // })
  function render_list(list) {
    var html = "";
    for (i in list) {

      html += `<div class="list">
     <div class="list_box posRelt miancolor two ${'level'+list[i].level}">
         <span class="abstrot type">${list[i].name}(${list[i].price}/台)</span>
         <span class="name abstrot ft10">KMB</span>
         <span class="contain abstrot">总产${list[i].total_value}KMB/台</span>
         <div class="abstrot right circle2">
             <img src="images/list/list${list[i].level}_cir_${list[i].level}.png" alt="" class="outer">
             <img src="images/list/list${list[i].level}_cir.png" alt="" class="inner">
             <div class="miancolor doing heght4 abstrot flex alcenter fldir">
                 <p class="tc ft10">预计产量</p>
                 <p class="tc ft10 mb10">(KMB/台小时)</p>
                 <p class="tc ft18">+${list[i].hour_value}</p>
             </div>
         </div>
         <div class="abstrot bottom flex alcenter tc">
             <span class="black inblock mauto buy-ltc" data-price="${list[i].price}" data-id="${list[i].id}">立即购买</span>
         </div>
     </div>
 </div>`
    }
    // if (list.length <= 0) {
    //   $(".blank_box").show();
    // }
    $('.transfer').click(function () {
      location.href = 'miner_buy.html';
    })
    $(".lists").append(html);
    $('.list').on('click', '.buy-ltc', function () {
      var id = $(this).attr('data-id');
      layer.open({
        content: '<p class="active_surplus">确定要购买吗?</p><p class="active_surplus">价格:' + $(this).attr('data-price') + 'KMB</p>',
        btn: ['确认','取消'],
        yes: function (index, layero) {
          layer_loading();
          $.post(laravel_api + "/ltc/buy", {
            ltc_id: id
          }, function (res) {
            layer_close();
            layer_msg(res.message);
            if (res.type == 'ok') {
              // setTimeout(() => {
              //   location.href = 'miner_buy.html'
              // }, 1500);
            }
          });
        }
      });
    })
  }
});