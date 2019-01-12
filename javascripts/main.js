;(function () {
    var createElement = document.createElement;
    document.createElement = function (tag) {
        switch (tag) {
            case 'script':
                console.log('禁用动态添加脚本，防止广告加载');
                break;
            default:
                return createElement.apply(this, arguments);
        }
    }
})();
var domain = window.location.host
var laravel_api = "https://"+domain+"/api"
var socket_api = "https://"+domain+":2120"

var node_api = "https://47.92.171.137:3000"



//layer提示层
function layer_msg(content){
    if(content == ""){
        content = "请刷新重试"
    }
    layer.open({
        content: content
        ,skin: 'msg'
        ,time: 2 //2秒后自动关闭
    });
}
//layer提示层
function layer_loading(content){
    if(content == ""){
        content = "加载中"
    }
    layer.open({
        type: 2
        ,content: content
    });
}
function layer_close(){
    layer.closeAll()
}
function layer_msg_none(){
    var content='已经没有更多数据了！';
    layer.open({
        content: content
        ,skin: 'msg'
        ,time: 2 //2秒后自动关闭
    });
}
//获取字符串长度
function strlen(str){
    var len = 0;
    for (var i=0; i<str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
            len++;
        }
        else {
            len+=2;
        }
    }
    return len;
}
function layer_timeout(msg){
    if(msg==''){
        msg='网络错误，请稍后重试！'
    }
    layer.open({
        content:msg,
        skin:'msg',
        time:5,
    })
}

/***
 * 获取url中所有参数
 * 返回参数键值对 对象
 */
function get_all_params() {
    var url = location.href;
    var nameValue;
    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
    var paraObj = {};
    for (var i = 0; nameValue = paraString[i]; i++) {
        var name = nameValue.substring(0, nameValue.indexOf("=")).toLowerCase();
        var value = nameValue.substring(nameValue.indexOf("=") + 1, nameValue.length);
        if (value.indexOf("#") > -1) {
            value = value.split("#")[0];
        }
        paraObj[name] = decodeURI(value);
    }
    return paraObj;
}

/**获取url中字段的值
 * name : 字段名
 * */
function get_param(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

function initData(obj, callback){
    obj.type=obj.type||'get';
    obj.data=obj.data||{};
    
    layer_loading("正在加载...");
    $.ajax({
        url:laravel_api+obj.url,
        type:obj.type,
        data:obj.data,
        success:function(res){
            layer_close();
            if(res.type=='ok'){
                callback&&callback(res.message)
            }else if(res.type=='999'){
                location.href = "login.html"
            }else{
                layer_msg(res.message)
            }
        },error:function(err){
            // layer_close();
            layer_timeout();
        }
    })
}
$(document).ajaxSuccess(function(event, request, settings) {
    // console.log(event, request, settings);
    if( request.responseJSON.type==997 ){
        // alert('997');
        location.href='no_active.html';
        return false;
         
    }
   
    if( request.responseJSON.type==998 ){
        // alert('998');
        location.href='active.html';
         
    }
})
/** 返回上一页 */
    $(".backPage").click(function(){
        history.back(-1);
    })
$('.notopen').click(function(){
    layer_msg('功能暂未开放，敬请期待！');
    return false;
})
/* 交易页面开发中。。。。*/
$("#trade_nav").click(function(){
    layer_msg("功能还在开发中.....")
})
$("a[href='deal.html']").click(function(e){
    e.preventDefault();
    // layer_msg("即将开放...")
    window.location.href = 'deal.html'
})
// 设置缓存
function setStorage(key,value){
    window.localStorage.setItem(key,JSON.stringify(value))
}
function getStorage(key){
   return JSON.parse(window.localStorage.getItem(key))
}
function removeStorage(key){
    window.localStorage.removeItem(key);
}
$('.quit_btn').click(function(){
    removeStorage('userinfo');
})
$('.kefu').click(function(){
    $('.layer_box_kefu').show();
})
function code(result){
    layer_msg(result)
}
function save_down() {
    var img = document.getElementById("kefucode");
    var alink = document.createElement("a");
    alink.href = img.src;
    alink.download = "kefu.jpg";
    alink.click();
}

$('.savecode').click(function(){
    save_down();
})
$('.layer_box_kefu .close').click(function(){
    $('.layer_box_kefu').hide();
})

// function getAgent(){
//     var u = navigator.userAgent;
//     var isiOS;
//     isiOS = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
//     isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
//     console.log(u,isiOS)
//     if(isiOS){ 
//       $('.common_footer a.active').removeClass('active').addClass('iosActive');   
//     }
// }
// getAgent()