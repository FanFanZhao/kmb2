$(function(){
    var cod = get_param("cod");
    if(cod != "" && cod != undefined){
            $("#parent_id").val(cod);
    }
    
    $('#send-auth-code').click(function () {
        if ($("#account_number").val() == '') {
            layer_msg("请输入手机号")
            return false;
        }
        if ($(this).text() != '获取验证码') {
            return false;
        }
        console.log('abc')

        var self = $(this);
        self.text('59秒');
        var interval = setInterval(function () {
            var text=parseInt(self.text());
            if ( text== 0) {
                clearInterval(interval);
                self.text('获取验证码');
            } else {
                self.text(text - 1+'秒');
            }
        }, 1000)

        $.get(laravel_api + '/send_auth_code', {
            mobile: $("#account_number").val(),
            type: 'register'
        }, function (res) {
            if (res.type != 'ok') {
                layer_msg(res.message);
                clearInterval(interval);
                self.text('获取验证码');
                return false;
            }else{
                layer_msg(res.message)
            }
        })
        return false;
    })
    $(".mt20").click(function () {
        var account_number = $("#account_number").val()
        var card_number = $("#card_number").val()
        var password = $("#password").val()
        var confirm_password = $("#confirm_password").val()
        // var parent_id = $("#parent_id").val()
        var auth_code = $('#auth_code').val()
        if(account_number == ""){
            layer_msg("请输入手机号")
            return false;
        }
        var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
        if (!myreg.test(account_number)) {
            layer_msg("请输入正确手机号")
            return false;
        }
        if(password == ""){
            layer_msg("请输入密码")
            return false;
        }
        if(strlen(password) < 8){
            layer_msg("密码过于简单")
            return false;
        }
        if(confirm_password == ""){
            layer_msg("请确认密码")
            return false;
        }
        if(password != confirm_password){
            layer_msg("两次输入的密码不一致")
            return false;
        }
        if (auth_code == '') {
            layer_msg("请输入短信验证码")
            return false;
        }
        // if(!card_number){
        //     return layer_msg('请输入身份证号')
        // }
        // var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; 
        // if(!reg.test(card_number)){
        //     return layer_msg('身份证号码有误，请重新输入')
        // }
        // if(!parent_id){
        //     return layer_msg('邀请码不能为空')
        // }
        layer_loading();
        $.ajax({
            type: "POST",
            url: laravel_api + "/user/register",
            data: {
                // id_card:card_number,
                password:password,
                account_number:account_number,
                
                auth_code: auth_code,
            },
            dataType: "json",
            success: function(data){
                layer_close();
                if(data.type == "ok"){
                    window.location.href = "login.html"
                }else{
                    layer_msg(data.message)
                    return false;
                }
            }
        });
    })
});