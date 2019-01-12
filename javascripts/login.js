$(function(){
    $('#account_number').val( getStorage('userinfo')&&getStorage('userinfo').username);
    $("#password").val(getStorage('userinfo')&&getStorage('userinfo').pwd)
    $(".login_btn").click(function () {
                    
        var account_number = $("#account_number").val() ;
        var password = $("#password").val()
        if (account_number == ""){
            layer_msg("请输入账号")
            return false;
        }
        if (password == ""){
            layer_msg("请输入密码")
            return false;
        }
        $.ajax({
            type: "POST",
            url: laravel_api + "/user/login?",
            data: {
                account_number:account_number,
                password:password
            },
            dataType: "json",
            success: function(data){
                console.log(data)

                if (data.type == "ok"){
                   layer_loading();
                   setStorage('userinfo',{username:account_number,pwd:password})
                    window.location.href = "no_active.html"
                } else{
                    alert(data.message)
                    return false;
                }
                // setTimeout(() => {
                //     layer_timeout();
                // }, 5000);
            },error:function(err){
                layer_timeout();
            }
        });
    })
    $('.register').click(function(){
        location.href='register.html'
    })
});