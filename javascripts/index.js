$(function () {
  var rotate=0;
  /* 切换状态 */
  $('.tab>div').click(function () {
    $(this).addClass('active').siblings().removeClass('active');
    if ($(this).hasClass('stop')) {
      $('.now').hide();
      $('.complete').show();
      if($('.complete').length<=0){
        $('.nodata').show();
      }else{
        $('.nodata').hide();
      }
    } else {
      $('.now').show();
      $('.complete').hide();
      if($('.now').length<=0){
        $('.nodata').show();
      }else{
        $('.nodata').hide();
      }
    }
  })
  layer_loading();
  $.ajax({
    type: "get",
    url: laravel_api + "/ltcbuy/list",
    data: {

    },
    dataType: "json",
    success: function (data) {
      layer_close();
      console.log(data);
      if (data.type == "ok") {
        if (data.message.length > 0) {
          render_list(data.message)
        }else{
          $('.nodata').show();
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
  initData({
    url: "/ltc/user_hav"
  }, function (res) {
    // $('.count').html(res.hav_number)
    $('.sum').html(res.sum)
    $('.number').html(res.hav_number);
  })

  function render_list(list) {
    var html = "";
    
    for (i in list) {
      if(list[i].status==1){
        rotate++;
      }
      var ret = list[i].surplus_return - 0;
      html += `<a href="kg_detail.html?id=${list[i].id}" class="block a_list_box">
      <div class="list ${list[i].status == 1?'now':'complete'}">
       <div class="list_box posRelt miancolor ${'level'+list[i].level}">
           <span class="abstrot type">${list[i].ltc_name}</span>
           <div class="abstrot left flex fldir ${'cirLv'+list[i].level}">
               <p class="tc ft10">今日收益</p>
               <p class="ft14 tc">${(list[i].today-0).toFixed(2)}</p>
               <p class="tc ft10">(KMB)</p>
           </div>
           <div class="abstrot right circle2">
               <img src="images/list/list${list[i].level}_cir_${list[i].level}.png" alt="" class="outer">
               <img src="images/list/list${list[i].level}_cir.png" alt="" class="inner">
               <div class="miancolor doing heght4 abstrot flex alcenter fldir">
                   <p class="tc mb10 ft18">${list[i].price}</p>
                   <p class="tc ft10">矿机价格(KMB)</p>
               </div>
           </div>
           <div class="abstrot bottom flex alcenter tc  renewal ${list[i].is_continue == 1?'':'hide'}" data-id="${list[i].id}" data-price="${list[i].continue_price}">
               <span class="black inblock mauto" >续费</span>
           </div>
           <div class="abstrot bottom flex alcenter tc upgrade ${list[i].is_up == 1?'':'hide'}" data-id="${list[i].id}">
               <span class="black inblock mauto" >升级</span>
           </div>
       </div>
   </div>
      </a>`

    }
    console.log(rotate,123)
    if(rotate>0){
      $('.wking').removeClass('complete2');
      $('.wktext').html('挖矿中...')
    }
    
    if (list.length <= 0) {
      $(".blank_box").show();
    }
    $(".total-list").append(html);
    if($('.now').length<=0){
      $('.nodata').show();
    }else{
      $('.nodata').hide();
    }
  }
  // $('.transfer').click(function () {
  //   location.href = 'asset2_details.html'
  // })
  var currency_id;

  $('.total-list').on('click', '.upgrade', function (e) {
    e.preventDefault();
    currency_id = $(this).attr('data-id');
    $.get(laravel_api + "/ltc/up_list", {
      id: currency_id
    }, function (res) {
      console.log(res)
      layer_close();
      if (res.type == 'ok') {
        render_list2(res.message)
        $('.layer_box').show();
      }
    });
  })
  // 续费
  $('.total-list').on('click', '.renewal', function (e) {
    e.preventDefault();
    console.log('HAHAH')
    var id = $(this).attr('data-id');
    layer.open({
      content: '<p class="active_surplus">续费价格:</p><p class="active_surplus">' + $(this).attr('data-price') + 'KMB</p>',
      btn: ['确认'],
      yes: function (index, layero) {
        layer_loading();
        $.post(laravel_api + "/ltc/continue", {
          id: id
        }, function (res) {
          layer_close();
          layer_msg(res.message);
          if (res.type == 'ok') {
            setTimeout(() => {
              // location.href = 'miner_buy.html'
              window.location.reload;
            }, 1500);
          }
        });
      }
    });
  })
  // 升级
  $('.layer_box ').on('click', '.updateok', function () {
    var ltc_id = $(this).data('id')
    layer.open({
      content: '<p class="active_surplus">升级价格:</p><p class="active_surplus">' + $(this).attr('data-price') + 'KMB</p>',
      btn: ['确认升级'],
      yes: function (index, layero) {
        layer_loading();
        $.post(laravel_api + "/ltc/up", {
          id: currency_id,
          ltc_id: ltc_id,
        }, function (res) {
          layer_close();
          layer_msg(res.message);
          if (res.type == 'ok') {
            setTimeout(() => {
              window.location.reload()
            }, 1500);
          }
        });
      }
    });
    return false;
  })
  $('.layer_box').click(function () {
    $(this).hide();
  })

  function render_list2(list) {
    var html = "";
    for (i in list) {

      html += `
           <li class="  ptb10 mlr10 plr10 alcenter bdb">
                <div class='flex alcenter'>
                        <div class="flex2">
                            <p class="ft16 mb10 black">${list[i].name}</p>
                            <p class="ft12 mb10">每小时挖矿${list[i].hour_value} KMB</p>
                            <p class="ft12 mb10">总产量${list[i].total_value} KMB</p>
                            <p class="ft14 red2">升级价格：${list[i].up_price} KMB</p>
                        </div>
                        <div class='flex1 tr'>
                            <button class="bglinear white updateok" data-price="${list[i].up_price}" data-id="${list[i].id}">升级</button>
                        </div>
                </div>
        </li>
           `
    }
    $('.uplists').html(html);
  }

})