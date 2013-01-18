$.extend(Tuli.mods,{
    //头部导航
    modHeadNav:function(){
        var $this = $(this);
        //上传图片
        Tuli.mods.uploadPhoto();
        if($('#User_info').length>0){
            var rel = $('#User_info .Add_atten').attr('rel');
            $('#page_nav a').attr('href','/index/2/?user_id='+rel);
        };
        if($('#Header .FH').length>0){
            var rel = $('#Header .Avatar').attr('rel');
            $('#page_nav a').attr('href','/index/2/?user_id='+rel);
        };
        if($('#Header .HotH').length>0){
            if (location.search == '?client=zx_ad_tc') {
                $.get('api/record/ip/', function() {
                    // skip
                });
            }
            $('#page_nav a').attr('href','/hot/2.html');
        };
        //根据触发源跳转登录相应页面
        //未登录导航条好友收藏，我的好友点击弹出登录框
        $('#Header .FFav,#Header .Fav').click(function(ev){
            var ev = ev || window.event;
            var target = ev.target || ev.srcElement;
            var type = $(target).attr('title');
            var rel = $(this).attr('rel');
            if(rel == 1){
                $('#Header .Log_btn').trigger('click');
                if(type == '好友收藏'){
                    $('#Tuli_log').attr('rel',3);
                }else{
                    $('#Tuli_log').attr('rel',2);
                }
                return false;
            };
        });
        $('.dialogField .Tuli .Login input').each(function(){
            Tuli.mods.eventFocus($(this),$(this).parent());
        });
        //图丽用户登录弹窗
        $('#Header .Log_btn').click(function(){
            $('#PlayerGuide').hide();
            $('#Tuli_log').attr('rel',1);
            $('#Tuli_log .wrong').hide();
            var left = Math.floor(document.body.clientWidth/2-382);
            var y = 0;
            if(mybrowser.ie && mybrowser.version == 6.0){
                y = document.body.scrollTop || document.documentElement.scrollTop;
                $('html,body').addClass('unScroll');
            }
            var top = Math.floor(y + window.screen.availHeight*0.35-150);
            if(Tuli.mods.kwVerson && Tuli.mods.kwVerson <3.0){
                left = 0;
                top = Math.floor(y);
            };
            if(mybrowser.ie && mybrowser.version == 6.0){
                $('html,body').addClass('unScroll');
                var top =  (document.body.scrollTop || document.documentElement.scrollTop);
                $('.dialog').css('top',top).show();
            }else{
                $('.dialog').show();
            }
            $('#Tuli_log').css({'left':left,"top":top}).show();
            return false;
        });
        $('.dialogField #Tuli_log .log_btn').click(function(){
            var username = $('#Tuli_log input[name=username]').val();
            var password = $('#Tuli_log input[name=password]').val();
            var auto_login = 0;
            if($('#Tuli_log input[type=checkbox]').attr('checked') == 'checked'){
                auto_login = 1;
            }
            if(username =="" || password == ""){
                alert("请输入用户名密码！");
            }else{
                var user_id  = '';
                var album_id = '';
                if($('.imgView').length > 0){
                    user_id = $('.imgNav .Avatar').attr('id');
                    album_id = $('.imgNav').attr('rel');
                }
                $.post('/login/?number='+Math.random(),{username:username,password:password,auto_login:auto_login,client_type:0,user_id:user_id,album_id:album_id},function(data){
                    var source = JSON.parse(data);
                    var id = source.data.user_id;
                    if(source.ok == false){
                        $('#Tuli_log .wrong').show();
                    }else{
                        var type = $('#Tuli_log').attr('rel');
                        var url = '';
                        switch (type){
                            case '1':url = window.location.href;
                                    break;
                            case '2':url = '/user/'+id+'/';
                                    break;
                            case '3':url = '/friend/albums/';
                                    break;
                            case '4':
                                    $('#Header .refresh').show();
                                    $('#Tuli_log,#Header .User .Log_btn,.dialogIE,.QfeedOut').hide();
                                    $('.Nav').css('z-index',1002);
                                    $('#mod-head-nav .User .Log_btn').attr('rel','');
                                    $('#Header .FFav,#Header .Fav').attr('rel','');
                                    $('#Header .Fav').attr('href','/user/'+id+'/');
                                    //改变头像 确定是否已经收藏或者关注
                                    var follow = source.data.is_already_follow;
                                    var forward = source.data.is_already_forward;
                                    var head = source.data.small_head_url;
                                    var relation = source.data.relation_info;
                                    if(relation){
                                        if(relation.token){
                                            var kktvUrl = relation.value+'&token='+relation.token;
                                            $('.toKKTV').attr('href',kktvUrl);
                                            $('.toKKTV').attr('rel',0);
                                        }
                                    }
                                    if( follow == true){
                                        $('.imgNav .Add_atten').parent().hide();
                                        $('.imgNav .Cancel-atten').parent().show();
                                    }
                                    if(forward == true){
                                        $('.imgNav .Pop_Fav').hide();
                                        $('.imgNav .collectBtn').show();
                                    }
                                    if(head != 'null'){
                                        $('.Header .Avatar img').attr('src',head);
                                    }
                                    if(user_id == id){
                                        $('.imgNav .Add_atten').parent().show();
                                        $('.imgNav .Cancel-atten').parent().hide();
                                    }
                                    if($('.downActive').length > 0 || (Tuli.mods.kwClient&&Tuli.mods.kwVerson ==3.0)){
                                        Tuli.mods.imageViewScroll = setInterval(function(){
                                            var y = $('.imgView').scrollTop();
                                            var increate = y + 2;
                                            $('.imgView').scrollTop(increate);
                                        },15);
                                    }
                                    break;
                        }
                        if( url != '' ){
                            window.location.href = url;
                        }
                    };
                });
            };
            return false;
        });
        $('.dialogField #Tuli_log .Close2').click(function(){
            $('.dialogField #Tuli_log,.dialogIE').hide();
            $('#Tuli_log form[name=tuliUser]')[0].reset();
            if($('.imgView').length == 0){
                $('.dialog').hide();
                if(mybrowser.ie && mybrowser.version ==6.0){
                    $('html,body').removeClass('unScroll');
                }
            }else{
                $('.dialogIE').hide();
                if($('.downActive').length > 0 || Tuli.mods.kwClient){
                    Tuli.mods.imageViewScroll = setInterval(function(){
                        var y = $('.imgView').scrollTop();
                        var increate = y + 2;
                        $('.imgView').scrollTop(increate);
                    },15);
                }
            }
            return false;
        });
        //快播、快玩弹窗 微博 QQ跳转
        $('.dialogField .Others li a').click(function(event){
            var $self = $(this);
            var ev = event || window.event; // 事件
            var target = ev.target || ev.srcElement; // 获得事件源
            var type = $(target).find('em').attr('class');
            if(type == 'KW' || type =='KB'){
                if(type == 'KW'){
                    $('.dialogField #Login h3').text('快玩帐号登录图丽');
                    $('.dialogField #Login .clientType').attr('rel','1');
                }else if( type == 'KB'){
                    $('.dialogField #Login h3').text('快播帐号登录图丽');
                    $('.dialogField #Login .clientType').attr('rel','2');
                }
                $('#Tuli_log,#Register').hide();
                $('#Tuli_log form[name=tuliUser]')[0].reset();
                $('#Login form[name=loginField]')[0].reset();
                var left = Math.floor(document.body.clientWidth/2-241);
                var y = 0;
                if(mybrowser.ie && mybrowser.version == 6.0){
                    y = document.body.scrollTop || document.documentElement.scrollTop;
                }
                var top = Math.floor(y + window.screen.availHeight*0.35-141);
                if(Tuli.mods.kwVerson && Tuli.mods.kwVerson <3.0){
                    left = 0;
                    top = Math.floor(y);
                }
                $('#Login').css({'left':left,"top":top}).show();
            }else if(type == 'WB'){
                $.get('weibo/sina/authorize/',function(data){
                    var source = JSON.parse(data);
                    var url = JSON.stringify(source.data);
                    if(url != '{}'){
                        window.location.href=source.data;
                    }else{
                        window.location.href = '/all/';
                        return false;
                    }
                });
            }else if(type == 'QQ'){
                $.get('weibo/qq/authorize/',function(data){
                    var source = JSON.parse(data);
                    var url = JSON.stringify(source.data);
                    if(url != '{}'){
                        window.location.href=source.data;
                    }else{
                        window.location.href = '/all/';
                        return false;
                    }
                });
            }else if(type == 'RR'){
                $.get('renren/authorize/',function(data){
                    var source = JSON.parse(data);
                    var url = JSON.stringify(source.data);
                    if(url != '{}'){
                        window.location.href=source.data;
                    }else{
                        window.location.href = '/all/';
                        return false;
                    }
                });
            }else if(type == 'DB'){
                $.get('douban/authorize/',function(data){
                    var source = JSON.parse(data);
                    var url = JSON.stringify(source.data);
                    if(url != '{}'){
                        window.location.href=source.data;
                    }else{
                        window.location.href = '/all/';
                        return false;
                    }
                });
            }
            return false;
        });
        //快播、快玩用户登录
        $('#Login .log_btn').click(function(){
            var username = $('#Login input[name=username]').val();
            var password = $('#Login input[name=password]').val();
            var type = $('#Login .clientType').attr('rel');
            var auto_login = 0;
            if($('#Login input[type=checkbox]').attr('checked') == 'checked'){
                auto_login = 1;
            }
            if(username =="" || password == ""){
                $('#Login .wrong').text('请输入用户名密码！').show();
            }else{
                $.post('/login/?number='+Math.random(),{username:username,password:password,auto_login:auto_login,client_type:type},function(data){
                    var source = JSON.parse(data);
                    var id = source.data.user_id;
                    if(source.ok == false){
                        $('#Login .wrong').text('用户名或密码错误！').show();
                    }else{
                        var type = $('#Tuli_log').attr('rel');
                        var url = '';
                        var urlname = source.data.urlname;
                        switch (type){
                            case '1':url = window.location.href;
                                    break;
                            case '2':url = ( urlname == null )?'http://'+Tuli.realmName+'/user/'+id+'/':'http://'+urlname+'.'+Tuli.realmName+'/';
                                    break;
                            case '3':url = ( urlname == null )? 'http://'+Tuli.realmName+'/friend/albums/':'http://'+urlname+'.'+Tuli.realmName+'/friend/albums/';
                                    break;
                            case '4':
                                    $('#Header .refresh').show();
                                    $('#Tuli_log,#Header .User .Log_btn,.dialogIE,.QfeedOut').hide();
                                    $('.Nav').css('z-index',1002);
                                    $('#mod-head-nav .User .Log_btn').attr('rel','');
                                    $('#Header .FFav,#Header .Fav').attr('rel','');
                                    $('#Header .Fav').attr('href','/user/'+id+'/');
                                    //改变头像 确定是否已经收藏或者关注
                                    var follow = source.data.is_already_follow;
                                    var forward = source.data.is_already_forward;
                                    var head = source.data.small_head_url;
                                    if( follow == true){
                                        $('.imgNav .Add_atten').parent().hide();
                                        $('.imgNav .Cancel-atten').parent().show();
                                    }
                                    if(forward == true){

                                    }
                                    if(head != 'null'){
                                        $('.Header .Avatar img').attr('src',head);
                                    }
                                    if(user_id == id){
                                        $('.imgNav .Add_atten').parent().show();
                                        $('.imgNav .Cancel-atten').parent().hide();
                                    }
                                    break;
                        }
                        if( url != '' ){
                            window.location.href = url;
                        }
                    }
                });
            };
            return false;
        });
        $('.dialogField #Login .Close2').click(function(){
            $('#Login').hide();
            if($('.imgView').length == 0){
                $('.dialog').hide();
                if(mybrowser.ie && mybrowser.version ==6.0){
                    $('html,body').addClass('unScroll');
                }
            }else{
                $('.dialogIE').hide();
                if($('.downActive').length > 0 || (Tuli.mods.kwClient&&Tuli.mods.kwVerson ==3.0)){
                    Tuli.mods.imageViewScroll = setInterval(function(){
                        var y = $('.imgView').scrollTop();
                        var increate = y + 2;
                        $('.imgView').scrollTop(increate);
                    },15);
                }
            }
            return false;
        });
        //跳转到用户注册
        $('.dialogField #Tuli_log .red').click(function(){
            $('#Tuli_log form[name=tuliUser]')[0].reset();
            $('.dialog').show();
            $('#Tuli_log').hide();
            var left = Math.floor(document.body.clientWidth/2-397);
            var y = 0;
            if(mybrowser.ie && mybrowser.version == 6.0){
                y = document.body.scrollTop || document.documentElement.scrollTop;
            }
            var top = Math.floor(y + window.screen.availHeight*0.35-170);
            if(Tuli.mods.kwVerson && Tuli.mods.kwVerson <3.0){
                left = 0;
                top = Math.floor(y);
            }
            $('.Register form')[0].reset();
            $('.Register li em').each(function(){
                $(this).hide();
            });
            $('#Register li .require').each(function(){
                $(this).show();
            });
            $('#Register').css({'left':left,"top":top}).show();
            return false;
        });
        //注册窗口关闭
        $('.dialogField #Register .Close2').click(function(){
            $('#Register').hide();
            if($('.imgView').length == 0){
                $('.dialog').hide();
                if(mybrowser.ie && mybrowser.version ==6.0){
                    $('html,body').removeClass('unScroll');
                };
            }else{
                $('.dialogIE').hide();
                if($('.downActive').length > 0 || (Tuli.mods.kwClient&&Tuli.mods.kwVerson ==3.0)){
                    Tuli.mods.imageViewScroll = setInterval(function(){
                        var y = $('.imgView').scrollTop();
                        var increate = y + 2;
                        $('.imgView').scrollTop(increate);
                    },15);
                }
            };
            $('#Register form')[0].reset();
            return false;
        });
        Tuli.mods.keySubmit($('form[name=register]'),$('.Register .log_btn'));
        Tuli.mods.keySubmit($('form[name=tuliUser]'),$('#Tuli_log .log_btn'));
        Tuli.mods.keySubmit($('form[name=loginField]'),$('#Login .log_btn'));
        //检查密码格式
        $('#Register input[name=password]').keyup(function(){
            var str = $(this).val();
            var len = str.length;
            if(len == 0){
                $('.pwdRight,.pwd2Right').hide().attr('rel',0);
                $('.pwdWrong a').text('密码不能为空！').parent().show();
            }else{
                if(len<6){
                    $('.pwdRight,.pwd2Right').hide().attr('rel',0);
                    $('.pwdWrong a').text('密码必须是6-16位').parent().show();
                }else{
                    $('.pwdRight,.pwd2Right').hide().attr('rel',0);
                    $('.pwdWrong').hide();
                    $('.pwdRight').show().attr('rel',1);
                    var pwd2 = $('#Register .confirm').val();
                    if(pwd2 !="" && str != pwd2 ){
                        $('.pwd2Right').hide().attr('rel',0);
                        $('.pwdSame a').text('密码输入不一致！').parent().show();
                    }
                    return true;
                }
            }
        });
        //确认密码一致
        $('#Register .confirm').keyup(function(){
            var pwd = $('#Register input[name=password]').val();
            var pwd2 = $(this).val();
            var len = pwd2.length;
            if($('.pwdRight').attr('rel') ==1){
                if(pwd2 == pwd && pwd !=''){
                    $('.pwdSame').hide();
                    $('.pwdRight,.pwd2Right').show().attr('rel',1);
                }else{
                    $('.pwd2Right').hide().attr('rel',0);
                    $('.pwdSame a').text('密码输入不一致！').parent().show();
                }
            }
        });
        function checkCount(strCount) {
            var emailReg = /^\w+$/;
            if( emailReg.test(strCount) ){
                return true;
            }else{
                return false;
            }
        }
        //检测账号
        $('.Register input[name=username]').focusout(function(){
            var email = $(this).val();
            if(email == ''){
                $('.Register .emailRight').hide().attr('rel',0);
                $('.Register .emailWrong a').text('帐号不能为空').parent().show();
                return false;
            }else if(email.length < 2){
                $('.Register .emailRight').hide().attr('rel',0);
                $('.Register .emailWrong a').text('帐号名称过短').parent().show();
            }else{
                var isEmail = email.indexOf('@');
                if(isEmail == -1){
                    var result = checkCount(email);
                    if(result){
                        $.get('check/username/',{username:email},function(data){
                            var source = JSON.parse(data);
                            if(source.ok == false){
                                $('.Register .emailRight').hide().attr('rel',0);
                                $('.Register .emailWrong a').text('帐号已被注册！').parent().show();
                            }else{
                                $('.Register .emailWrong').hide()
                                $('.Register .emailRight').show().attr('rel',1);
                            };
                        })
                    }else{
                        $('.Register .emailRight').hide().attr('rel',0);
                        $('.Register .emailWrong a').text('帐号格式有误！').parent().show();
                    }
                }else{
                    var result = Tuli.mods.checkEmail(email);
                    if(result){
                        $.get('check/email/',{email:email},function(data){
                            var source = JSON.parse(data);
                            if(source.ok == false){
                                $('.Register .emailRight').hide().attr('rel',0);
                                $('.Register .emailWrong a').text('邮箱已被注册！').parent().show();
                            }else{
                                $('.Register .emailWrong').hide()
                                $('.Register .emailRight').show().attr('rel',1);
                            };
                        })
                    }else{
                        $('.Register .emailRight').hide().attr('rel',0);
                        $('.Register .emailWrong a').text('邮箱格式有误！').parent().show();
                    }
                }

            }
        });
        //昵称是否重复和长度
        function checkName(strName){
            var len = strName.length;
            if( len>20 || len < 2 ){
                $('.nameRight').hide().attr('rel',0);
                $('.nameWrong a').text('2~20个字符之间').parent().show();
                return false;
            }else{
                $('.nameRight').hide().attr('rel',0);
                $('.nameWrong').hide();
                return true;
            }
        };
        $('#Register input[name=nickname]').keyup(function(){
            var str = $(this).val();
            checkName(str);
        });
        $('#Register input[name=nickname]').focusout(function(){
            var str = $(this).val();
            var result = checkName(str);
            if(result){
                $.get('check/nickname/',{nickname:str},function(data){
                    var source = JSON.parse(data);
                    if(source.ok == false){
                        $('.nameRight').hide().attr('rel',0);
                        $('.nameWrong a').text('昵称已被注册！').parent().show();
                    }else{
                        $('.nameWrong').hide();
                        $('.nameRight').show().attr('rel',1);
                    };
                })
            }
        });
        //提交注册表单
        $('#Register .log_btn').click(function(){
            var user = $('#Register input[name=username]').val();
            var pwd = $('#Register input[name=password]').val();
            var name = $('#Register input[name=nickname]').val();
            var pwd2 = $('#Register .confirm').val();
            var result = true;
            $('#Register .eR').each(function(){
                var rel =  $(this).attr('rel');
                if(rel == 0){
                    result = false;
                }
            })
            if(result && pwd2 == pwd && pwd !=''){
                $.post('/register/?number='+Math.random(),{username:user,password:pwd,nickname:name},function(data){
                    var source = JSON.parse(data);
                    var id = source.data.user_id;
                    if(source.ok == false){
                        var reason = source.reason;
                    }else{
                        if($('.imgView').length == 0){
                            window.location.href='/pin/manager/';
                        }else{
                            $('#Header .refresh').show();
                            $('#Register,#Header .User .Log_btn,.dialogIE').hide();
                            $('.Nav').css('z-index',1002);
                            $('#mod-head-nav .User .Log_btn').attr('rel','');
                            $('#Header .FFav,#Header .Fav').attr('rel','');
                            $('#Header .Fav').attr('href','/user/'+id+'/');
                            if($('.downActive').length > 0 || (Tuli.mods.kwClient&&Tuli.mods.kwVerson ==3.0)){
                                Tuli.mods.imageViewScroll = setInterval(function(){
                                    var y = $('.imgView').scrollTop();
                                    var increate = y + 2;
                                    $('.imgView').scrollTop(increate);
                                },15);
                            }
                        }
                    };
                });
            }
            return false;
        });
        //focus 去掉提示
        $('form[name=register] input').each(function(){
            var $self = $(this);
            $self.focusin(function(){
                $self.parent().find('a').hide();
            });
            $self.focusout(function(){
                var inputValue = $self.val();
                if(inputValue == ''){
                    $self.parent().find('a').show();
                }
            })
        });
        $('form[name=register] span').each(function(){
            var $self = $(this);
            var inputValue = $self.val();
            $self.click(function(){
                $self.parent().find('input').focus();
                return false;
            });
        });
        //忘记密码模块
        $('#Tuli_log .forget').click(function(){
            $('#Tuli_log,.Sent-mail').hide();
            $('#forgetPwd form[name=forgetPwd]')[0].reset();
            $('.Forget-psw').show();
            var y = document.body.scrollTop || document.documentElement.scrollTop;
            var left = $('#Tuli_log').css('left');
            $('#forgetPwd').css({'left':left,"top":y+120}).show();
            return false;
        });
        $('#forgetPwd .Close2').click(function(){
            $('#forgetPwd,form[name=forgetPwd] a').hide();
            $('#forgetPwd form[name=forgetPwd]')[0].reset();
            if($('.imgView').length == 0){
                $('.dialog').hide();
                if(mybrowser.ie && mybrowser.version ==6.0){
                    $('html,body').removeClass('unScroll');
                }
            }else{
                $('.dialogIE').hide();
            }
            return false;
        });
        $('#forgetPwd .remember').click(function(){
            $('#Tuli_log form[name=tuliUser]')[0].reset();
            $('#forgetPwd form[name=forgetPwd]')[0].reset();
            $('form[name=forgetPwd] a').hide();
            $('#Tuli_log').show();
            $('#forgetPwd').hide();
            return false;
        });
        var ifNotNull = false;
        $('#forgetPwd input[name=email]').keyup(function(){
            var email = $(this).val()
            if(email == ''){
                $('#forgetPwd .emailRight').hide().attr('rel',0);
                $('form[name=forgetPwd] a').text('邮箱不能为空！').show();
                ifNotNull = false;
            }else{
                $('form[name=forgetPwd] a').hide();
                ifNotNull = true;
            }
        });
        $('#forgetPwd input[name=email]').focusout(function(){
            if(ifNotNull){
                var email = $('#forgetPwd input[name=email]').val();
                var result = Tuli.mods.checkEmail(email);
                if(result){
                    $.get('check/email/',{email:email},function(data){
                        var source = JSON.parse(data);
                        if(source.ok == false){
                            $('#forgetPwd .emailRight').show().attr('rel',1);
                        }else{
                            $('#forgetPwd .emailRight').hide().attr('rel',0);
                            $('form[name=forgetPwd] a').text('邮箱不存在！').show();
                        };
                    })
                }else{
                    $('#forgetPwd .emailRight').hide().attr('rel',0);
                    $('form[name=forgetPwd] a').text('邮箱格式有误！').show();
                }
            }
        });
        $('#forgetPwd .Red_btn').click(function(){
            var email = $('#forgetPwd input[name=email]').val();
            var result = $('#forgetPwd .emailRight').attr('rel');
            if(result==1){
                $.get('forget/password/',{email:email},function(data){
                    var source = JSON.parse(data);
                    if(source.ok == false){
                        $('#forgetPwd .emailRight').hide();
                        $('form[name=forgetPwd] a').text('提交邮箱失败！').show();
                    }else{
                        $('.Forget-psw').hide();
                        $('.Sent-mail').show();
                    };
                });
            }
            return false;
        });
        //域名跳转与复制及宽度自适应
        $('#Header .Website input').each(function(){
            var input_size = $(this).val().length;
            $(this).css('width',input_size*7.5);
        })
        $('#Header .Website .White-A').click(function(){
            var type = $(this).attr('rel');
            if(type == 1){
                window.location.href = '/settings/?head_url=1';
            }else{
                if(document.all){
                    var copyText = $(this).find('input').val();
                    window.clipboardData.setData("Text",copyText);
                    $('#Header').css('overflow','visible');
                    $('.copyRealm').show().fadeOut();
                }else{
                    $(this).find('input').focus();
                    $(this).find('input').select();
                }
            }
            return false;
        });
        $('#Header .White-A').focusout(function(){
            $('.copyRealm').hide();
            $('#Header').css('overflow','hidden');
        });
        var judgeNav = 1;
        var userOption = 0;
        //滚动速度
        Tuli.mods.scrollSpeed = 33;
        //回到顶部显示和隐藏效果
        $(window).scroll( function(){
            if($(document).scrollTop() > 30 && !($('#Fold .Fold_btn').is(':animated')) ) {
                if(userOption != 1 && judgeNav == 1){
                    $('#Fold .Fold_btn').trigger('click');
                    userOption = 0;
                };
            }else if($(document).scrollTop() == 0 && !($('#Fold .Fold_btn').is(':animated'))) {
                if(userOption != 1 && judgeNav == 0){
                    $('#Fold .Fold_btn').trigger('click');
                    userOption = 0;
                };
            };
        });
        //导航下拉效果
        $('#Fold .Fold_btn').click(function(event){
            userOption = 1;
            if(judgeNav == 1){
                $('#Header').hide('blind',function(){
                    $('#Fold').addClass('down');
                });
                if(!(mybrowser.ie && mybrowser.version ==6.0)){
                    if($('.Intro').length>0){
                        $('.autoW').animate({"marginTop":"22px"});
                    }else{
                        $('.autoW').animate({"paddingTop":"22px"});
                    }
                }
                judgeNav = 0;
            }else if(judgeNav == 0){
                $('#Header').show('blind',function(){
                    $('#Fold').removeClass('down');
                });
                if(!(mybrowser.ie && mybrowser.version ==6.0)){
                    if($('.Intro').length>0){
                        $('.autoW').animate({"marginTop":"75px"});
                    }else{
                        $('.autoW').animate({"paddingTop":"75px"});
                    }
                }
                judgeNav = 1;
            };
            event.stopPropagation();
            event.preventDefault();
        });
        var textUrl = window.location.href;
        var musicPlay = false;
        if($('#Header .HH').length>0){
            musicPlay = true;
        }
        //播放器及操作模块
        var $a_top = $('#audioField .top');
        var $a_play = $('#audioField .play');
        var $a_list = $('#audioField .musicList');
        var $a_down = $('#audioField .down');
        //点击回到顶部
        $a_top.hover(function(){
            var h1= window.screen.availHeight;
            var h2=document.body.scrollHeight;
            scrollDown = setInterval(function(){
                var y = document.body.scrollTop || document.documentElement.scrollTop;
                if( y!=0){
                    var increate = y - 1;
                    if(mybrowser.chrome){
                        document.body.scrollTop = increate ;
                    }else{
                        document.documentElement.scrollTop = increate;
                    }
                }
            },Tuli.mods.scrollSpeed);
            return false;
        },function(){
            clearTimeout(scrollDown);
        });
        //hover自动滚动向上
        $a_top.click(function(){
            clearInterval(Tuli.mods.scrollDownAuto);
            $('.downActive').removeClass('downActive').addClass('down');
            $('html,body').animate({scrollTop: '0px'},800);return false;
        });
        //播放与暂停
        var audio=document.createElement("audio");
        audio.loop = 'loop';
        var firstMusic = $('#AudioList .Music li:first-child a').attr('rel');
        firstClick = true;
        $a_play.click(function(){
            if(firstClick){
                $('#AudioList .Music li:first-child a').trigger('click');
                firstClick = false;
            }else{
                if($(this).hasClass('play')){
                    $(this).removeClass('play').addClass('stop');
                    if(mybrowser.ie && mybrowser.version < 9.0){
                        fPlay();
                    }else{
                        audio.play();
                    }
                }else{
                    $(this).removeClass('stop').addClass('play');
                    $('#AudioList').hide();
                    $a_list.removeClass('listActive').addClass('musicList');
                    if(mybrowser.ie && mybrowser.version < 9.0){
                        fPause();
                    }else{
                        audio.pause();
                    }
                }
            }
            return false;
        });
        //播放列表按钮
        $a_list.click(function(){
            if($(this).hasClass('musicList')){
                $(this).removeClass('musicList').addClass('listActive');
                $('#AudioList').show();
            }else{
                $(this).removeClass('listActive').addClass('musicList');
                $('#AudioList').hide();
            }
            return false;
        });
        var listLen = $('#AudioList ul').length;
        //听歌瀑布流加载变量 判断正则匹配规则
        var datumStr = $('#page_nav a').attr('href');
        var loadPageType = window.location.href;
        //新手提示
        var firstHover = 0;
        if(loadPageType=='http://'+Tuli.realmName+'/all/'||loadPageType=='http://'+Tuli.realmName+'/'){
            loadPageType = true;
            firstHover = 1;
        };
        var datum = '';
        if(datumStr){
            if(loadPageType != true){
                datum = datumStr.match(/^(.*?)\d+(.*?$)/).toString().split(',')[1];
            }else{
                datum = datumStr.match(/^(.*?)\d+(\.\w+)$/).toString().split(',')[1];
            };
        };
        Tuli.mods.curpage = 2;
        $('body').click(function(){
            if($('#PlayerGuide').length>0 && firstHover == 0){
                $('#PlayerGuide').remove();
                firstHover = 0;
            }
        });
        $('#audioField').hover(function(){
            if(firstHover){
                $.get('helpinfo/',function(data){
                    var source = JSON.parse(data);
                    if(source.ok){
                        $('#PlayerGuide').show();
                        $('.iKnow,.Guide-close').click(function(){
                            $('#PlayerGuide').remove();
                            return false;
                        });
                        $('.knowAbout').click(function(){
                            $('#PlayerGuide').remove();
                        });
                    }
                    firstHover = 0;
                });8
            }
            return false;
        });
        //播放列表--选择歌曲
        $('#AudioList .Music li a').each(function(){
            var $self = $(this);
            var music = $self.attr('rel');
            var type = $self.attr('sel');
            var color = $self.attr('col');
            $self.click(function(event){
                if($('.musicDialog').is(":animated")){    //判断元素是否正处于动画状态
                    //如果当前没有进行动画，则添加新动画
                    $(".musicDialog,.musicTip").stop();
                    $('.musicDialog,.musicTip').css('height',0);
                    //$('.musicTip').css('height','100%');
                }
                var speed = $self.attr('speed');
                if($self.hasClass('MusicOn')){
                    if($a_play.hasClass('stop')){
                        $a_play.removeClass('stop').addClass('play');
                        audio.pause();
                    }else{
                        $a_play.removeClass('play').addClass('stop');
                        audio.play();
                    }
                }else{
                    Tuli.mods.scrollSpeed = speed;
                    var ori_height = $('#Waterfall').height();
                    if(musicPlay){
                        //if(Tuli.mods.curpage >=3 ){
                            $('#infscr-loading').remove();
                            $('#Waterfall').infinitescroll('destroy');
                            $("#Waterfall").removeData('infinitescroll');
                            $('#page_nav a').attr('href','/all/'+type+'/'+Tuli.mods.curpage+'.html');
                            //无限制按歌曲显示对应瀑布流
                            // if(loadPageType==true){
                                // $('#page_nav a').attr('href','/all/'+type+'/'+Tuli.mods.curpage+'.html');
                            // }else{
                                // $('#page_nav a').attr('href',datum+'/'+type+'/'+Tuli.mods.curpage+'.html');
                            // }
                            $("#Waterfall").infinitescroll({
                                state:{
                                    currPage:Tuli.mods.curpage
                                },
                                loading:{
                                    finished: undefined,
                                    finishedMsg: "你好坏，都被你看光了!",
                                    img: '/images/waterLoading.gif',
                                    msg: null,
                                    msgText: "",
                                    selector: null,
                                    speed: 'fast',
                                    start: undefined
                                },
                                navSelector : '#page_nav',
                                nextSelector : '#page_nav a',
                                itemSelector : '.Pin',
                                debug: false ,
                                extraScrollPx: 0,
                                appendCallback: true,
                                errorCallback: function(){

                                }},
                                function( newElements ){
                                    var $newElems = $( newElements );
                                    //取里面的img 加载前隐藏
                                    var $img = $(newElements ).find('.showGirl').css({ opacity:0});
                                    var $default = $(newElements).find('.Pin_default');
                                    $container.masonry( 'appended', $newElems, true ,function(){});
                                    //在添加到masonry布局之前保证图片载入
                                    $newElems.imagesLoaded(function(){
                                        //现在可以显示所有的元素了
                                        $img.animate({ opacity: 1 });
                                        $default.hide().remove();
                                    });
                                    Tuli.mods.curpage ++;
                                }
                            );
                            var y = document.body.scrollTop || document.documentElement.scrollTop;
                            var top = y + (window.screen.availHeight)/2;
                            clearInterval(Tuli.mods.scrollDownAuto);
                            //$('.musicTip').slideToggle(1000);
                            var lineH = window.screen.availHeight;
                            $('.musicTip span').text($self.text());
                            $('.musicTip').show().css('lineHeight',(lineH*0.8)+'px').animate({height:'100%'},(1100));
                            $('.musicDialog').css('backgroundColor',color).show().animate({height:'100%'},1000,function(){
                                $('.musicDialog').animate({height:0},2000,function(){
                                    $(this).hide();
                                });
                                $('.musicTip').animate({height:0},1900,function(){
                                    $(this).hide();
                                });
                                $('html,body').animate({scrollTop:top},1000,function(){
                                    clearInterval(Tuli.mods.scrollDownAuto);
                                    Tuli.mods.scrollDownAuto = setInterval(function(){
                                    var y = document.body.scrollTop || document.documentElement.scrollTop;
                                    var increate = y + 1;
                                    if(increate < $('body').height()){
                                            if(mybrowser.chrome){
                                                document.body.scrollTop = increate;
                                            }else{
                                                document.documentElement.scrollTop = increate;
                                            }
                                        }
                                    },Tuli.mods.scrollSpeed);
                                    $a_down.removeClass('down').addClass('downActive');
                                });
                                if($('.Pin_default').length == 30){
                                    //触发一次滚轮加载事件
                                    $('#Waterfall').infinitescroll('retrieve');
                                }
                            });
                        // }
                        // else{
                            // $('#Waterfall').infinitescroll('destroy');
                            // $("#Waterfall").removeData('infinitescroll');
                            // if($('.newIndex').length == 0){
                                // $('body').append('<div class="newIndex"></div>');
                            // }
                            // $('#mod-index').remove();
                            // $('.newIndex').load('/all/',{music_id:type,is_contain_header:true},function(data){
                                // $('#page_nav a').attr('href','/all/'+type+'/'+'2.html');
                            // });
                        // }
                    }
                    //更改播放歌曲
                    $a_play.removeClass('play').addClass('stop');
                    var playType = 1;
                    if(mybrowser.mozilla){
                        audio.src="/music/"+music+".ogg";
                    };
                    if(mybrowser.chrome || (mybrowser.ie && mybrowser.version == 9.0)){
                        audio.src="/music/"+music+".mp3";
                    };
                    if(mybrowser.ie && mybrowser.version < 9.0){
                        fSet("/music/"+music+".mp3");
                        playType = 2;
                    }
                    if(playType==1){
                        audio.play();
                    }else{

                    }
                    $('.MusicOn').removeClass('MusicOn');
                    $self.addClass('MusicOn');
                    if(firstClick){
                        //统计是否点击播放
                        $.get("/counter/",{"counter_type":2});
                        firstClick = false;
                    }else{
                        //统计是否切歌
                        $.get('counter/',{'counter_type':3});
                    }
                    $('#AudioList').hide();
                    $a_list.removeClass('listActive').addClass('musicList');
                }
                return false;
                event.stopPropagation();
                event.preventDefault();

            });
        });
        //播放列表--翻页
        $('.Pagearea a').click(function(){
            if($(this).hasClass('PreList')){

            }else{

            }
            return false;
        });
        //点击自动滚动向下
        var scrollDownHover = '';
        Tuli.mods.scrollDownAuto = '';
        //判断是否正在自动下拉
        Tuli.mods.autoScrollDown = false;
        $a_down.click(function(){
            if($(this).hasClass('down')){
                Tuli.mods.autoScrollDown = true;
                clearInterval(scrollDownHover);
                clearInterval(Tuli.mods.scrollDownAuto);
                $(this).removeClass('down').addClass('downActive');
                Tuli.mods.scrollDownAuto = setInterval(function(){
                    var y = document.body.scrollTop || document.documentElement.scrollTop;
                    var increate = y + 1;
                    if(increate < $('body').height()){
                        if(mybrowser.chrome){
                            document.body.scrollTop = increate;
                        }else{
                            document.documentElement.scrollTop = increate;
                        }
                    }
                },Tuli.mods.scrollSpeed);
            }else{
                clearInterval(Tuli.mods.scrollDownAuto);
                clearInterval(scrollDownHover);
                $(this).removeClass('downActive').addClass('down');
                Tuli.mods.autoScrollDown = false;
            };
            return false;
        });
        //hover自动滚动向下
        $a_down.hover(function(){
            if(Tuli.mods.autoScrollDown == false){
                scrollDownHover = setInterval(function(){
                    var y = document.body.scrollTop || document.documentElement.scrollTop;
                    var increate = y + 1;
                    if(increate < $('body').height()){
                        if(mybrowser.chrome){
                            document.body.scrollTop = increate;
                        }else{
                            document.documentElement.scrollTop = increate;
                        }
                    }
                },33);
            }
            return false;
        },function(){
                clearTimeout(scrollDownHover);
            return false;
        });
        //播放器Flash 兼容
        function getSWF(movieName) {
            if (navigator.appName.indexOf("Microsoft") != -1)
            {
                return window[movieName];
            }
            else
            {
                return document[movieName];
            }
        }
        function fPlay(){
            getSWF('tuli_player').dewplay();
        }
        function fPause() {
            getSWF('tuli_player').dewpause();
        }
        function fSet(file) {
            getSWF('tuli_player').dewset(file);
        }
    },
    //快玩客户端
    kwClientmod:function(){
        Tuli.mods.kwClient = false;
        Tuli.mods.kwVerson = '';
        if(mybrowser.ie){
            //判断是否在客户端内
            if(checkAPI()){
                //判读快玩版本
                Tuli.mods.kwVerson = parseFloat(CALL_API("getVersion",''));
                if(isNaN(Tuli.mods.kwVerson)){
                    Tuli.mods.kwVerson = 2.7;
                };
                //判读用户是否登录
                if($('#Header .userImg img').length == 0){
                    Tuli.mods.kwClient = true;
                    //判断是否已用快玩帐号登录
                    if(KW_Config.check_authenticated()){
                        var token = CALL_API("getUserInfo", "token");
                        $.post('/login/client/kw/',{'token':token},function(data) {
                            var source = JSON.parse(data);
                            if(source.ok == true){
                                window.location.href ="http://"+Tuli.realmName+"/?client=kw";
                            }
                        });
                    }
                }
            }
        }
    },
    //首页模块
    modIndex:function(){
        Tuli.mods.kwClientmod();
        var $this = $(this);
        //瀑布流列数调整
        Tuli.mods.resizeWater(true);
        //QQ通信
        function starQQ(qq) {
            this.link = "tencent://message/?uin="+qq+"&Site=wrud.sinaapp.com&Menu=yes";
            postiframe=document.createElement("iframe");
            postiframe.cssText="display:none; width:0px; height: 0px;";
            postiframe.frameborder=0;
            postiframe.width="0px";
            postiframe.height="0px";
            postiframe.src=this.link;
            document.body.appendChild(postiframe);
            setTimeout(function(){
                    document.body.removeChild(postiframe);
            },1000);
        };
        $('#User_info .Qme_btn,.Qme span').click(function(){
            var qq = $('#User_info .Qme_btn').attr('rel');
            starQQ(qq);
            return false;
        });
        //判断十秒后未登录用户提示登录
        Tuli.mods.judgeLogin = setTimeout(function(){
            var sign = $('#mod-head-nav .User .Log_btn').attr('rel');
            if(sign){
                $.get('login/tip/',function(data){
                    var source = JSON.parse(data);
                    if(source.ok == true){
                        if($('.imgNav').length>0){
                            clearInterval(Tuli.mods.imageViewScroll);
                            $('#Header .Log_btn').trigger('click');
                            $('.dialogIE').show();
                            $('#Tuli_log').attr('rel',4);
                        }else{
                            if($('.dialog').css('display') != 'block'){
                                $('.Log_btn').trigger('click');
                            }
                        }
                    }
                })
            };
        },10000);
        //首页统计公开与未公开
        var showWidth = $('body').width();
        if($('.Data-Msg').length>0){
            var $self = $('.Data-Msg');
            var type = $self.attr('rel');
            if(type == 1){
                var url = 'new/pin/count/';
                var left = $('#Header .HH').offset().left;
            }else if(type == 2){
                var url = 'hot/pin/count/';
                var left = $('#Header .HotH').offset().left;
            }else{
                var url = 'friend/pin/count/';
                var left = $('#Header .FFH').offset().left;
            }
            $.get(url,{random:Math.random()},function(data){
                var source = JSON.parse(data);
                if(source.ok == true){
                    if(url == 'friend/pin/count/'){
                        $self.find('.pub span').text(source.data.follow_count);
                        $self.find('.unpub span').text(source.data.unlock_pin_count);
                    }else{
                        $self.find('.pub span').text(source.data.unlock_pin_count);
                        $self.find('.unpub span').text(source.data.lock_pin_count);
                    }
                    $self.css('left',left).show();
                };
                setTimeout(function(){$self.parent().hide(1000)},5000);
            });
        };
        $('.Data-Msg .Data-close').click(function(){
            $('.Data-Msg').parent().remove();
            return false;
        });
        //用户界面--转换公开与未公开模块
        $('.File-Num a').click(function(){
            if($('#Header .User .Log_btn').length>0){
                $('#Header .User .Log_btn').trigger('click');
            }else{
                if(!$(this).hasClass('Data-now')){
                    var type = '';
                    if($(this).hasClass('Data-Unlock')){
                        type = 1;
                    }else{
                        type = 2;
                    };
                    var id = $('.Info .Add_atten').attr('rel');
                    var loadPage = $('#page_nav a').attr('href');
                    $.get('user/pin/'+id+'/',{is_use_head:type},function(data){
                        if (!data.match("^\{(.+:.+,*){1,}\}$")){
                            $('#mod-index').remove();
                            var $new = $('#changeField').append(data);
                            $new.find('page_nav a').attr('href',loadPage);
                            if(type==1){
                                $('.Data-now').removeClass('Data-now');
                                $('.Data-Unlock').addClass('Data-now');
                            };
                        }else{
                            var left = Math.floor(document.body.clientWidth/2-205);
                            $('#Tip').css({left:left,top:200}).show();
                        };
                    });
                }
            }
            return false;
        });
        //关闭提示
        $('#Tip .Close2').click(function(){
            $('#Tip').hide();
            return false;
        });
        $('#Tip .Red_btn').click(function(){
            Tuli.mods.tipBox(190,110,1,'请求已发出！');
            $('#Tip').hide();
            return false;
        });
        //用户界面--加关注
        $('.Info .Add_atten').click(function(){
            var $self = $(this);
            if($('#Header .User .Log_btn').length>0){
                $('#Header .User .Log_btn').trigger('click');
            }else{
                var id = $self.attr('rel');
                $.post('/follow/?number='+Math.random(),{"follow_user_ids[]":id},function(data){
                    var source = JSON.parse(data);
                    if(source.ok == false){

                    }else{
                        $self.hide().parent().find('span').show();
                    };
                });
            }
            return false;
        });
        //用户界面取消关注
        $('.Info .Cancel-atten a').click(function(){
            var $self = $(this);
            var id = $self.attr('rel');
            $.post('/unfollow/?number='+Math.random(),{"unfollow_user_id[]":id},function(data){
                var source = JSON.parse(data);
                if(source.ok == false){
                }else{
                    $self.parent().hide().parent().find('.Add_atten').show();
                };
            });
        });
        //首页瀑布效果
        $container = $('#Waterfall');
        if($('.newIndex').length == 0){
            $("#Waterfall").masonry({
                singleMode: true,
                columnWidth: 222,
                itemSelector: '.Pin',
                isFitWidth:true,
                gutterWidth:15
            });
        }else{
            $("#Waterfall").masonry({
                singleMode: true,
                columnWidth: 222,
                itemSelector: '.Pin',
                isFitWidth:true,
                gutterWidth:15,
                isAnimated:true,
                animationOptions:{queue:false,duration:500}
            });
        };
        if($('.Log_btn').length>0){
            scrollLogin = 0;
        };
        $("#Waterfall").infinitescroll({
            loading:{
                finished: undefined,
                finishedMsg: "你好坏，都被你看光了!",
                img: 'images/waterLoading.gif',
                msg: null,
                msgText: "",
                selector: null,
                speed: 'fast',
                start: undefined
            },
            navSelector : '#page_nav',
            nextSelector : '#page_nav a',
            itemSelector : '.Pin',
            debug: false,
            extraScrollPx: 240,
            errorCallback: function(){}},
            function( newElements ){
                var $newElems = $( newElements );
                $container.masonry( 'appended', $newElems, true );
                //取里面的img 加载前隐藏
                 var $img = $( newElements ).find('.showGirl').css({ opacity:0});
                 var $default = $( newElements ).find('.Pin_default');
                //在添加到masonry布局之前保证图片载入
         $newElems.imagesLoaded(function(){
                    //现在可以显示所有的元素了
                    $img.animate({opacity:1});
                    $default.hide().remove(); 
                });
                Tuli.mods.curpage++;
            }
        );
        //小图hover效果
        $('#mod-index').delegate('.Pin ','mouseover',function(){
            if($(this).find('.Over_Link img').length>0){
                $(this).find('#Group').show();
            };
        });
        $('#mod-index').delegate('.Pin ','mouseout',function(){
            if($(this).find('.Over_Link img').length>0){
                $(this).find('#Group').hide();
            };
        });
        $('#mod-index .Pin .Over_Link').delegate('a','click',function(e){
            $(this).parents('.Pin').find('.showGirl').trigger('click');
            return false;
            e.stopPropagation();
            e.preventDefault();
        });
        $('#mod-index .Over_Link').delegate('img','click',function(e){
            $(this).parents('.Pin').find('.showGirl').trigger('click');
            e.stopPropagation();
            e.preventDefault();
        });
        //查看大图动画模块
        var x,y='';
        $('body').mousemove(function(e){
            x = e.clientX;
            y = e.pageY;
        });
        $('#mod-index').delegate('.showGirl','click',function(event){
            var $self = $(this);
            var $selfParent = $self.find('img');
            var    id = $self.attr('id');
            var url = '/album/'+id+'/';
            var top = $selfParent.offset().top;
            var left = $selfParent.offset().left;
            var height = $selfParent.height();
            var width = $selfParent.width();
            var divWidth = Math.floor(document.body.clientWidth/2-375);
            var realHeight = 1;
            //隐藏新手提示
            $('#PlayerGuide').hide();
            $.post(url,{album_id:id,random:Math.random()},function(data){
                var source = JSON.parse(data);
                    if(source.ok == false){
                        alert('请求报错！');
                    }else{
                        //判断是否有自己的头像
                        clearTimeout(Tuli.mods.scrollDownAuto);
                        Tuli.mods.autoScrollDown = false;
                        //判断是否为KKTV的主播
                        var kktv = false;
                        //login token
                        var login_token = false;
                        if(source.data.relation_info){
                            kktv = true;
                            if(source.data.relation_info.token){
                                login_token = source.data.relation_info.token;
                            };
                        };
                        if(!(mybrowser.ie && mybrowser.version ==6.0)){
                            $('#Audio-Con').hide();
                        };
                        if(mybrowser.ie && mybrowser.version ==6.0){
                            var H = document.body.scrollTop || document.documentElement.scrollTop ;
                            $('.dialog').css({top:H}).show();
                        }else{
                            $('.dialog').show();
                        };
                        var defaultHead = '<a href="/user/'+source.data.user_id+'/" target="_blank" class="Avatar" id='+source.data.user_id+' >';
                        if(source.data.medium_head_url == null){
                            defaultHead +='<img src="/images/medium_head.jpg" /></a>';
                        }else{
                            defaultHead +='<img src='+source.data.medium_head_url+' /></a>';
                        };
                        //获取公开与未公开数
                        var publicAndLock = '<p><span class="Pop-Num-Unlock">'+source.data.unlock_pin_count+'</span><span class="Pop-Num-Lock">'+source.data.lock_pin_count+'</span></p>';
                        //获取昵称
                        var nickname = '<p><a href="/user/'+source.data.user_id+'/"  target="_blank" class="WA">'+source.data.nickname+'</a></p>';
                        //判断是否已经关注
                        var follow = (source.data.is_already_follow == 1)?1:0;
                        var followCode = '';
                        if(follow == 1){
                            followCode='<p style="display:none"><a href="#" class="Add_atten" title="加关注"></a></p><p><span class="Cancel-atten"><a class="Red_A">取消</a></span></p>';
                        }else{
                            followCode='<p><a href="#" class="Add_atten" title="加关注"></a></p><p style="display:none"><span class="Cancel-atten"><a class="Red_A">取消</a></span></p>';
                        };
                        var leftMod = '<div class="Pop_user"><div class="Name-con"><div class="Fav_msgl"><span></span></div><div class="userInfo">'+defaultHead+nickname+publicAndLock+followCode+'</div></div><a href="#" class="PopFold Pop-user-fold"></a></div>';
                        //判断是否收藏过图集
                        var forward = (source.data.is_already_forward == 1)?1:0;
                        var forwardCode = '<a href="#" class="Closed" title="关闭"></a>';
                        var a_id = source.data.album_id;
                        //var o_id = source.data.origin_album_id;
                        var album_type = source.data.album_type;
                        if(forward == 1){
                            forwardCode +='<a style="display:none" href="#" class="Pop_Fav" id='+a_id+' title="加入收藏"></a><a href="#" id='+a_id+' rel='+album_type+' class="collectBtn" title="取消收藏"></a><div class="Fav_msg"><span></span><em></em></div>';
                        }else{
                            forwardCode +='<a href="#" class="Pop_Fav" id='+a_id+' title="加入收藏"></a><a style="display:none" href="#" id='+a_id+' rel='+album_type+' class="collectBtn" title="取消收藏"></a><div class="Fav_msg"><span></span><em></em></div>';
                        }
                        var rightMod = '<div class="Pop_Ac">'+forwardCode+'</div>';
                        //图集名称
                        if(kktv){
                            var title = '<div class="Pop_Title"><a class="statc_album" href="/static/album/'+a_id+'/" target="_blank">'+source.data.album_name+'</a><a href="'+source.data.relation_info.value+'" class="toKKTV" title="穿越到美味KKTV直播间" target="_blank"><img title="穿越到美味KKTV直播间" src="/images/KKTV_black.gif"></a></div>';
                        }else{
                            var title = '<div class="Pop_Title"><a class="statc_album" href="/static/album/'+a_id+'/" target="_blank">'+source.data.album_name+'</a></div>';
                        };
                        var Head = '<div class="Pop_Head">'+leftMod+rightMod+title+'</div>';
                        var imgNav = '<div class="imgNav" rel='+a_id+'>'+leftMod+rightMod+title+'</div>';
                        //循环图集
                        var img = source.data.pin_info_list;
                        var len = source.data.pin_info_list.length;
                        var images = '<div class="Pop_img">';
                        var autoCreate = 10;
                        for(var i=0;i<len;i++){
                            autoCreate +=10;
                            realHeight +=Math.floor(img[i].large_image_height);
                            images += '<img id='+img[i].pin_id+' alt="'+source.data.album_name+'" src='+img[i].large_image_url+ ' width='+source.data.album_width+ ' height='+img[i].large_image_height+' />';
                        }
                        realHeight += (110+autoCreate);
                        images = images+'<div class="F_msg"></div></div>';
                        var popContent =Head+images;
                        $('.Pop').append(popContent+imgNav);
                        var popTop = document.body.scrollTop || document.documentElement.scrollTop;
                        if(document.all){
                            $('html,body').addClass('unScroll');
                        }else{
                            $('body').addClass('unScroll');
                        };
                        if(Tuli.mods.kwVerson){
                            if(Tuli.mods.kwVerson <3.0)
                                divWidth = 0;
                            else{
                                //realHeight = window.screen.height - 127;
                            }
                        };
                        $('.Pop').css({top:top,left:left,width:width,height:height,opacity:1}).show().animate({top:popTop,left:divWidth,width:'798px',height:realHeight+'px',minHeight:'100%',paddingBottom:'50px'},function(){
                            if(mybrowser.ie && mybrowser.version ==6.0){
                                var H = document.body.scrollTop || document.documentElement.scrollTop ;
                                $('.dialog').css({top:H});
                                var $new = $(this).wrap("<div class='imgView' style='display:block;top:"+H+";'></div>");
                                $new.each(function(){
                                    $('.Pop').css("top",0);
                                    $('.imgView').css("overflow-y","auto");
                                });
                            }else{
                                $(this).wrap("<div class='imgView' style='display:block'></div>").css("top",0);
                            }
                            if(!Tuli.mods.kwClient || (Tuli.mods.kwVerson <3.0)){
                                $('.imgView').css("overflow-y","auto");
                                scroll($('.imgView'),$('.Pop'));
                            }else{
                                var ImgHeight = $('.imgView').height() - 127;
                                var $new = $('.Pop_img').wrap("<div class='kwView' style='display:block'></div>");
                                $new.each(function(){
                                    $('.kwView').css({'overflow-x':'hidden','overflow-y':'auto','height':ImgHeight+'px','position':'relative'});
                                });
                                scroll($('.kwView'),$('.Pop_img'));
                            }
                            Tuli.mods.modAlbumDetail();
                            //判断是否取消收藏刷新页面
                            window.refresh = 0;
                            window.changeOrNot = 0;
                            //滚动至底部时消失
                            window.scrollHide = false;
                            var scrollClose ='';
                            //判断是否有自动滚动是否进行
                            Tuli.mods.imageViewScroll = '';
                            if($('.downActive').length > 0){
                                if(!Tuli.mods.kwClient||Tuli.mods.kwVerson <3.0){
                                    Tuli.mods.imageViewScroll = setInterval(function(){
                                        var y = $('.imgView').scrollTop();
                                        var increate = y + 2;
                                        $('.imgView').scrollTop(increate);
                                    },15);
                                }else{
                                    Tuli.mods.imageViewScroll = setInterval(function(){
                                        var y = $('.kwView').scrollTop();
                                        var increate = y + 2;
                                        $('.kwView').scrollTop(increate);
                                    },15);
                                }
                            }
                            function scroll(scrollOne,warpOne){
                                scrollOne.scroll(function(event){
                                    var $this = this;
                                    var h1=this.scrollTop;
                                    var h2=this.clientHeight;
                                    var h3=this.scrollHeight;
                                    if(h1+h2 >= h3-10){
                                        $('.Pop_img .F_msg').show();
                                        scrollClose = setTimeout(function(){
                                            //$('.F_msg').fadeOut(500);
                                            var Pheight = warpOne.height();
                                            warpOne.css('height',Pheight+1);
                                            scrollHide = true;
                                        },500);
                                        if(scrollHide==true){
                                            //统计是否看完
                                            $.get('counter/',{'counter_type':1});
                                            closeImgViewDialog();
                                            clearTimeout(scrollClose);
                                        }
                                    }else{
                                        scrollHide = false;
                                        clearTimeout(scrollClose);
                                    }
                                    event.stopPropagation();
                                    event.preventDefault();
                                });
                            };
                            function closeImgViewDialog() {
                                $("div.dialog").hide();
                                if(Tuli.mods.imageViewScroll){
                                    clearInterval(Tuli.mods.imageViewScroll);
                                }
                                if($('#UserFriendS').hasClass('FH')&&changeOrNot==1){
                                    var url = window.location.href;
                                    window.location.href = url;
                                };
                                $('.dialogIE').show();
                                $('.imgView').html("").remove();
                                var $new =  $('body').append('<div style="top:'+popTop+'px;left:'+divWidth+'px;width:798px;minHeight:100%;opacity:1;" class="Pop"></div>');
                                $new.each(function(){
                                    if(document.all){
                                        $('html,body').removeClass('unScroll');
                                    }else{
                                        $('body').removeClass('unScroll');
                                    }
                                    $('.Pop').show().css('minHeight',0).animate({top:top,left:left,width:width,height:height-40,paddingBottom:'50px',opacity:0.5},500,function(){
                                        $('.dialogIE,.Pop').hide();
                                    });
                                });
                                if(!(mybrowser.ie && mybrowser.version ==6.0)){
                                    $('#Audio-Con').show();
                                };
                                if($('#audioField a:last-child').hasClass('downActive')){
                                    Tuli.mods.scrollDownAuto = setInterval(function(){
                                        var y = document.body.scrollTop || document.documentElement.scrollTop;
                                        var increate = y + 1;
                                        if(increate < $('body').height()){
                                            if(mybrowser.chrome){
                                                document.body.scrollTop = increate;
                                            }else{
                                                document.documentElement.scrollTop = increate;
                                            }
                                        }
                                    },Tuli.mods.scrollSpeed);
                                }
                            };
                            /*close*/
                            $(".Closed,.imgView").click(function(event){
                                closeImgViewDialog();
                                return false;
                            });
                            if(!(mybrowser.ie && mybrowser.version ==6.0)){
                                $('.imgNav').css('left',divWidth).show();
                            }
                            $('.imgNav .PopFold').click(function(){
                                $('.imgNav').addClass('unScroll');
                                if($(this).hasClass('Pop-user-fold')){
                                    $('.Name-con').animate({marginLeft:'-225px'},350);
                                    $('.PopFold').addClass('Pop-user-pull').removeClass('Pop-user-fold');
                                }else{
                                    $('.Name-con').show().animate({marginLeft:0},350);
                                    $('.PopFold').addClass('Pop-user-fold').removeClass('Pop-user-pull');;
                                }
                                return false;
                            });
                        });
                        $('.Pop').click(function(){
                            return false;
                        });
                        $('.Pop .Pop_Title a.statc_album').click(function(){
                            window.open($(this).attr("href"));
                            return false;
                        });
                    };
            });
            return false;
            event.stopPropagation();
            event.preventDefault();
        });
        //滚动至底部时消失
        function scroll(){
            $('.imgView').scroll(function(event){
                var h1=this.scrollTop;
                var h2=this.clientHeight;
                var h3=this.scrollHeight;
                if(h1+h2 >= h3-10){
                    if(scrollHide){
                        $('.Closed').trigger('click');
                    }else{
                        $('.F_msg').show();
                        setTimeout(function(){scrollHide = true;$('.F_msg').css("height",151);},1000);
                    }
                };
                event.stopPropagation();
                event.preventDefault();
            });
        };
        //用户界面无收藏时显示内容
        if($('#Fav_NA').length>0){
            $.get('recommend/album/',function(data){
                var source = JSON.parse(data);
                if(source.ok == true){
                    var code ="<div class='Pin'>";
                    var len =source.data.length;
                    var htmlData = '';
                    for(var  i=0;i<len;i++){
                        htmlData += "<div class='Pin'><a href='#' class='showGirl' id="+source.data[i].album_id+" ><img height="+source.data[i].medium_image_height+" src="+ source.data[i].medium_image_url+"></a><div id='Group'><div class='Over'></div><div class='Over_Link'>";
                        var sImgList = '';
                        for(var o=0;o<source.data[i].thumbail_pin_info_list.length;o++){
                            sImgList += "<img src="+source.data[i].thumbail_pin_info_list[o].small_image_url+" />";
                        }
                        sImgList+="</div></div><a href='#' class='Save_btn'>收藏美味</a></div>";
                        htmlData +=sImgList;
                    }
                    var $new = $('.NA_Img').append(htmlData);
                    $new.parent().find('.Save_btn').each(function(){
                        $(this).click(function(){
                            var id = $(this).parents('.Pin').find('.showGirl').attr('id');
                            $.get('album/forward/?number='+Math.random(),{origin_album_id:id},function(data){
                                var source = JSON.parse(data);
                                if(source.ok == false){
                                    Tuli.mods.tipBox(190,100,1,'收藏失败！');
                                }else{
                                    location.reload();
                                };
                            });
                            return false;
                        });
                    });
                }
            });
        }
        //如果用户无好友时显示内容
        if($('#Frd_NA').length>0){
            $.get('friend/search/',{pagesize:10},function(data){
                var $new = $('#Frd_NA .NA_Img .Frd_list').append(data);
                $new.each(function(){
                    $('.Frd_list li img').each(function(){
                        var $self = $(this);
                        var $li = $(this).parents('li');
                        var $box = $li.find('.Frd_Cbox');
                        $self.click(function(){
                            var $checkbox = $li.find('input');
                            var checked = $checkbox.attr('checked');
                            if(checked == "checked"){
                                $checkbox.attr('checked',false);
                                $box.addClass('Cbox-off');
                            }else{
                                $checkbox.attr('checked','checked');
                                $box.removeClass('Cbox-off');
                            };
                            return false;
                        });
                    });
                    $('.Frd_avatar .Cbox-off').each(function(){
                        var $img = $(this).parents('li').find('img');
                        $(this).click(function(){
                            $img.trigger('click');
                            return false;
                        })
                    });
                })
            });
        }
        //resize动画
        $(window).resize(function(){
            Tuli.mods.resizeWater(true);
            if($('.imgNav').length > 0 && !(mybrowser.ie && mybrowser.version ==6.0)){
                var left = Math.floor(document.body.clientWidth/2-375);
                if(Tuli.mods.kwVerson && Tuli.mods.kwVerson <3.0){
                    left = 0;
                }
                if(Tuli.mods.kwVerson>2.8){
                    var Height = $('.imgView').height() - 127;
                    $('.kwView').css({'overflow-x':'hidden','overflow-y':'auto','height':Height+'px','position':'relative'});
                }
                $('.Pop,.imgNav').css("left",left);
            }
        });
        var resizeOrNot = document.body.clientWidth;
        setInterval(function(){
            if (Tuli.mods.kwVerson && (resizeOrNot >document.body.clientWidth+20 || resizeOrNot <document.body.clientWidth-20)){
                resizeOrNot = document.body.clientWidth;
                $(window).trigger('resize');
            }
        },1000);
    },
    //首页查看大图模块
    modAlbumDetail:function(){
        if($('#Header .Avatar').attr('rel') == $('.imgNav .Avatar').attr('id')){
            $('.imgNav .Add_atten').attr('rel','self');
        }
        /*加入收藏*/
        $('.Pop_Ac .Pop_Fav').click(function(){
            var $self = $(this);
            //判断是否登录
            var sign = $('#mod-head-nav .User .Log_btn').attr('rel');
            if(sign == 1){
                $('.Nav').css('z-index','auto');
                //取消默认滚动
                clearInterval(Tuli.mods.imageViewScroll);
                $('#Header .Log_btn').trigger('click');
                $('.dialogIE').show();
                $('#Tuli_log').attr('rel',4);
            }else{
                var id = $('.collectBtn').attr('id');
                $.get('album/forward/?number='+Math.random(),{origin_album_id:id},function(data){
                    var source = JSON.parse(data);
                    if(source.ok == false){
                        $('.Fav_msg span').text('收藏失败').parent().show();
                    }else{
                        $('.Fav_msg span').text('已收藏').parent().show();
                        changeOrNot =(changeOrNot==1)?0:1;
                        $('.collectBtn').show();
                        $('.Pop_Fav').hide();
                    };
                });
            }
            return false;
        });
        // 取消收藏
        $('.Pop_Ac .collectBtn').click(function(){
            var id = $('.collectBtn').attr('id');
            var rel = $('.collectBtn').attr('rel');
            if( rel== "false" ){
                $('.Fav_msg span').text('自己收藏无法取消').parent().show();
            }else{
                $.get('album/unforward/?number='+Math.random(),{origin_album_id:id},function(data){
                    var source = JSON.parse(data);
                    if(source.ok == false){
                        $('.Fav_msg span').text('取消收藏失败').parent().show();
                    }else{
                        $('.Fav_msg span').text('已取消收藏').parent().show();
                        changeOrNot =(changeOrNot==1)?0:1;
                        $('.collectBtn').hide();
                        $('.Pop_Fav').show();
                    };
                });
            }
            return false;
        });
        //跳转好友收藏
         $('.Pop_user .Avatar,.Pop_user .WA').click(function(event){
            var id = $(this).parents('.Pop_user').find('.Avatar').attr('id');
            window.open('/user/'+id+'/');
            event.preventDefault();
        });
        //加关注
        $('.imgNav .Add_atten').click(function(event){
            var $self = $(this);
            //判断是否登录
            var sign = $('#mod-head-nav .User .Log_btn').attr('rel');
            if(sign == 1){
                $('#Header .Log_btn').trigger('click');
                clearInterval(Tuli.mods.imageViewScroll);
                $('.dialogIE').show();
                $('#Tuli_log').attr('rel',4);
            }else{
                //判断是否本人
                var rel = $self.attr('rel');
                if(rel == 'self'){
                    $('.Fav_msgl span').text('不要太自恋').parent().show().fadeOut(3000);
                }else{
                    var id = $self.parents('.Pop_user').find('.Avatar').attr('id');
                    $.post('/follow/?number='+Math.random(),{"follow_user_ids[]":id},function(data){
                        var source = JSON.parse(data);
                        if(source.ok == false){
                            $('.imgNav').addClass('unScroll');
                            $('.Fav_msgl span').text('关注失败').parent().show().fadeOut(3000);
                        }else{
                            $('.imgNav .Add_atten').parent().hide();
                            $('.imgNav .Cancel-atten').parent().show();
                            if($('#Waterfall .Info').length>0){
                                $('#Waterfall .Info .Add_atten').hide();
                                $('#Waterfall .Info .Cancel-atten').show();
                            }
                        };
                    });
                }
            }
            event.preventDefault();
        });
        //取消关注
        $('.imgNav .Cancel-atten .Red_A').click(function(){
            var $self = $(this);
            var id = $self.parents('.Pop_user').find('.Avatar').attr('id');
            $.post('/unfollow/?number='+Math.random(),{"unfollow_user_id[]":id},function(data){
                var source = JSON.parse(data);
                if(source.ok == false){
                    $('.Fav_msgl span').text('取消关注失败').parent().show().fadeOut(3000);
                }else{
                    $('.Fav_msgl span').text('取消关注').parent().show().fadeOut(3000);
                    $('.imgNav .Add_atten').parent().show();
                    $('.imgNav .Cancel-atten').parent().hide();
                    if($('#Waterfall .Info').length>0){
                        $('#Waterfall .Info .Add_atten').show();
                        $('#Waterfall .Info .Cancel-atten').hide();
                    }
                };
            });
            return false;
        });
        //跳转KKTV
        $('.toKKTV').click(function(){
            var $self = $(this);
            var sign = $('#mod-head-nav .User .Log_btn').attr('rel');
            if(sign == 1){
                $('#Header .Log_btn').trigger('click');
                clearInterval(Tuli.mods.imageViewScroll);
                $('.dialogIE').show();
                $('#Tuli_log').attr('rel',4);
            }else{
                var url = $self.attr('href');
                window.open('/api/jump/?callback='+url);
            };
            return false;
        });
    },
    //忘记页面模块 for modIndex
    modForgetPassword:function(){
        var $this = $(this);
        //检查密码格式
        function checkPwdL(str){
            var pwdReg = /^[0-9a-zA-Z]+$/g;
            if( pwdReg.test(str) ){
                return true;
            }else{
                return false;
            };
        };
        $this.find('input').focusin(function(){
            $(this).parents('li').find('.Color-red').hide();
        });
        var pwd1 = false;
        $this.find('input[name=password]').keyup(function(){
            var str = $(this).val();
            var len = str.length;
            if(len == 0){
                $(this).parents('li').find('img').hide();
                $(this).parents('li').find('.Color-red').text('密码不能为空').show();
                pwd1 = false;
            }else{
                if(len<6){
                    $(this).parents('li').find('img').hide();
                    $(this).parents('li').find('.Color-red').text('必须是6-16位数字或字母').show();
                    pwd1 = false;
                }else{
                    var result = checkPwdL(str);
                    if(result){
                        $(this).parents('li').find('.Color-red').hide();
                        $(this).parents('li').find('img').show();
                        pwd1 = true;
                        var pwd2 = $this.find('.confirm').val();
                        if(pwd2 !="" && str == pwd2 ){
                            $this.find('.confirm').parents('li').find('.Color-red').hide();
                            $this.find('.confirm').parents('li').find('img').show();
                        }else if(pwd2 !=''){
                            $this.find('.confirm').parents('li').find('img').hide();
                            $this.find('.confirm').parents('li').find('.Color-red').text('密码输入不一致！').show();
                        }
                        return true;
                    }else{
                        $(this).parents('li').find('img').hide();
                        $(this).parents('li').find('.Color-red').text('必须是6-16位数字或字母').show();
                        pwd1 = false;
                        return false;
                    }
                }
            }
        });
        $this.find('input[name=password]').focusout(function(){
            var str = $(this).val();
            if(str==''){
                $(this).parents('li').find('.Color-red').text('密码不能为空').show();
            }
        });
        $this.find('.confirm').keyup(function(){
            var pwd2 = $(this).val();
            if(pwd1){
                if( pwd2 !='' && pwd2 == $this.find('input[name=password]').val()){
                    $(this).parents('li').find('.Color-red').hide();
                    $(this).parents('li').find('img').show();
                }else if(pwd2 == ''){
                    $(this).parents('li').find('img').hide();
                    $(this).parents('li').find('.Color-red').text('密码不能为空！').show();
                }else{
                    $(this).parents('li').find('img').hide();
                    $(this).parents('li').find('.Color-red').text('密码输入不一致！').show();
                }
            }
        });
        $this.find('.Save_btn').click(function(){
            var pwd = $this.find('input[type="password"]').val();
            var email = $this.find('input[name=email]').val();
            var time = $this.find('input[name=time]').val();
            $.post('/password/reset/?number='+Math.random(),{password:pwd,email:email,time:time},function(data){
                var source = JSON.parse(data);
                if(source.ok){
                    Tuli.mods.tipBox(190,100,1,'修改成功！');
                }else{
                    Tuli.mods.tipBox(190,155,3,'修改失败,请重试！');
                }
            });
            return false;
        });
    },
    //用户反馈页面
    modFeedback:function(){
        var $this = $(this);
        $this.find('textarea').click(function(){
            $this.find('.Color-red').hide();
        });
        $this.find('input[name=contact]').click(function(){
            $this.find('label').hide();
        });
        $this.find('input[name=contact]').focusout(function(){
            if($(this).val() == ''){
                $this.find('label').show();
            }
        });
        $this.find('label').click(function(){
            $(this).hide();
            $this.find('input[name=contact]').focus();
        });
        $this.find('.Save_btn').click(function(){
            var content = $this.find('textarea').val();
            if(content ==''){
                $this.find('.Color-red').show();
            }else{
                var contact = $this.find('input[name=contact]').val();
                $.post('/feedback/?number='+Math.random(),{contact:contact,content:content},function(data){
                    var source = JSON.parse(data);
                    if(source.ok == true){
                        var left = Math.floor(document.body.clientWidth/2-135);
                        $this.find('.tipBox').css({left:left,top:150,width:270}).show();
                        $this.find('textarea').val('');
                        setTimeout(function(){
                            $('.tipBox').fadeOut(2000);
                        },1500);
                    }else{
                        Tuli.mods.tipBox(190,155,3,'提交失败,请重试！');
                    }
                });
            }
            return false;
        });
        //Tuli.mods.tipBox(272,190,1,'收到');
    },
    //图丽单图集查看页面
    modAlbumDetailView:function(){
        var $this = $(this);
        var id = $this.find('.Avatar').attr('rel');
        var a_id = $this.find('.forward').attr('rel');
        //关注
        $this.find('.Add_atten').click(function(){
            var sign = $('#mod-head-nav .User .Log_btn').attr('rel');
            if(sign){
                $('.Log_btn').trigger('click');
            }else{
                $.post('/follow/?number='+Math.random(),{"follow_user_ids[]":id},function(data){
                    var source = JSON.parse(data);
                    if(source.ok == false){

                    }else{
                        $this.find('.Cancel-atten').show();
                        $('.Add_atten').hide();
                    };
                });
            }
            return false;
        });
        //取消关注
        $this.find('.Cancel-atten .Red_A').click(function(){
            $.post('/unfollow/?number='+Math.random(),{"unfollow_user_id[]":id},function(data){
                var source = JSON.parse(data);
                if(source.ok == false){

                }else{
                    $this.find('.Add_atten').show();
                    $('.Cancel-atten').hide();
                };
            });
            return false;
        });
        //收藏
        var $Fav = $this.find('.forward');
        $Fav.click(function(){
            var sign = $('#mod-head-nav .User .Log_btn').attr('rel');
            if(sign){
                $('.Log_btn').trigger('click');
            }else{
                if($(this).hasClass('AddFav')){
                    $.get('album/forward/?number='+Math.random(),{origin_album_id:a_id},function(data){
                        var source = JSON.parse(data);
                        if(source.ok == false){

                        }else{
                            $Fav.addClass('isAddFav').removeClass('AddFav');
                        };
                    });
                }else{
                    $.get('album/unforward/?number='+Math.random(),{origin_album_id:a_id},function(data){
                        var source = JSON.parse(data);
                        if(source.ok == false){

                        }else{
                            $Fav.addClass('AddFav').removeClass('isAddFav');
                        };
                    });
                }
            }
            return false;
        });
        //跳转KKTV
        $('.toKKTV').click(function(){
            var $self = $(this);
            var sign = $('#mod-head-nav .User .Log_btn').attr('rel');
            if(sign == 1){
                $('#Header .Log_btn').trigger('click');
                clearInterval(Tuli.mods.imageViewScroll);
                $('.dialogIE').show();
                $('#Tuli_log').attr('rel',4);
            }else{
                var url = $self.attr('href');
                window.open('/api/jump/?callback='+url);
            };
            return false;
        });
    },
    //图丽单独注册页
    modRegisterSingle:function(){
        var $this = $(this);
        //触发登录
        $this.find('.Reglog .Red_A').click(function(){
            $('#Header .Log_btn').trigger('click');
            return false;
        });
        //优化--账号登录
        $this.find('.Log_otherlink .Acc_links a').click(function(event){
            var $self = $(this);
            var ev = event || window.event; //事件
            var target = ev.target || ev.srcElement; //获得事件源
            var type = $(target).find('em').attr('class');
            if(type == 'KW' || type =='KB'){
                if(type == 'KW'){
                    $('.dialogField #Login h3').text('快玩帐号登录图丽');
                    $('.dialogField #Login .clientType').attr('rel','1');
                }else if( type == 'KB'){
                    $('.dialogField #Login h3').text('快播帐号登录图丽');
                    $('.dialogField #Login .clientType').attr('rel','2');
                }
                $('#Tuli_log,#Register').hide();
                $('#Tuli_log form[name=tuliUser]')[0].reset();
                $('#Login form[name=loginField]')[0].reset();
                var left = Math.floor(document.body.clientWidth/2-241);
                var y = 0;
                if(mybrowser.ie && mybrowser.version == 6.0){
                    y = document.body.scrollTop || document.documentElement.scrollTop;
                }
                var top = Math.floor(y + window.screen.availHeight*0.35-141);
                if(Tuli.mods.kwVerson && Tuli.mods.kwVerson <3.0){
                    left = 0;
                    top = Math.floor(y);
                }
                $('#Login').css({'left':left,"top":top}).show();
                $('.dialog').show();
            }else if(type == 'WB'){
                $.get('weibo/sina/authorize/',function(data){
                    var source = JSON.parse(data);
                    var url = JSON.stringify(source.data);
                    if(url != '{}'){
                        window.location.href=source.data;
                    }else{
                        window.location.href = '/all/';
                        return false;
                    }
                });
            }else if(type == 'QQ'){
                $.get('weibo/qq/authorize/',function(data){
                    var source = JSON.parse(data);
                    var url = JSON.stringify(source.data);
                    if(url != '{}'){
                        window.location.href=source.data;
                    }else{
                        window.location.href = '/all/';
                        return false;
                    }
                });
            }else if(type == 'RR'){
                $.get('renren/authorize/',function(data){
                    var source = JSON.parse(data);
                    var url = JSON.stringify(source.data);
                    if(url != '{}'){
                        window.location.href=source.data;
                    }else{
                        window.location.href = '/all/';
                        return false;
                    }
                });
            }else if(type == 'DB'){
                $.get('douban/authorize/',function(data){
                    var source = JSON.parse(data);
                    var url = JSON.stringify(source.data);
                    if(url != '{}'){
                        window.location.href=source.data;
                    }else{
                        window.location.href = '/all/';
                        return false;
                    }
                });
            }
        });
        //-------注册事件

        //检查密码格式
        $this.find('input[name=password]').keyup(function(){
            var str = $(this).val();
            var len = str.length;
            if(len == 0){
                $this.find('.pwdRight,.pwd2Right').hide().attr('rel',0);
                $this.find('.pwdWrong a').text('密码不能为空！').parent().show();
            }else{
                if(len<6){
                    $this.find('.pwdRight,.pwd2Right').hide().attr('rel',0);
                    $this.find('.pwdWrong a').text('密码必须是6-16位').parent().show();
                }else{
                    $this.find('.pwdRight,.pwd2Right').hide().attr('rel',0);
                    $this.find('.pwdWrong').hide();
                    $this.find('.pwdRight').show().attr('rel',1);
                    var pwd2 = $this.find('.confirm').val();
                    if(pwd2 !="" && str != pwd2 ){
                        $this.find('.pwd2Right').hide().attr('rel',0);
                        $this.find('.pwdSame a').text('密码输入不一致！').parent().show();
                    }
                    return true;
                }
            }
        });
        //确认密码一致
        $this.find('.confirm').keyup(function(){
            var pwd = $this.find('input[name=password]').val();
            var pwd2 = $(this).val();
            var len = pwd2.length;
            if($this.find('.pwdRight').attr('rel') ==1){
                if(pwd2 == pwd && pwd !=''){
                    $this.find('.pwdSame').hide();
                    $this.find('.pwdRight,.pwd2Right').show().attr('rel',1);
                }else{
                    $this.find('.pwd2Right').hide().attr('rel',0);
                    $this.find('.pwdSame a').text('密码输入不一致！').parent().show();
                }
            }
        });
        function checkCount(strCount) {
            var emailReg = /^\w+$/;
            if( emailReg.test(strCount) ){
                return true;
            }else{
                return false;
            }
        }
        //检测账号
        $this.find('input[name=username]').focusout(function(){
            var email = $(this).val();
            if(email == ''){
                $this.find('.emailRight').hide().attr('rel',0);
                $this.find('.emailWrong a').text('帐号不能为空').parent().show();
                return false;
            }else if(email.length < 2){
                $this.find('.emailRight').hide().attr('rel',0);
                $this.find('.emailWrong a').text('帐号名称过短').parent().show();
            }else{
                var isEmail = email.indexOf('@');
                if(isEmail == -1){
                    var result = checkCount(email);
                    if(result){
                        $.get('check/username/',{username:email},function(data){
                            var source = JSON.parse(data);
                            if(source.ok == false){
                                $this.find('.emailRight').hide().attr('rel',0);
                                $this.find('.emailWrong a').text('帐号已被注册！').parent().show();
                            }else{
                                $this.find('.emailWrong').hide()
                                $this.find('.emailRight').show().attr('rel',1);
                            };
                        })
                    }else{
                        $this.find('.emailRight').hide().attr('rel',0);
                        $this.find('.emailWrong a').text('帐号格式有误！').parent().show();
                    }
                }else{
                    var result = Tuli.mods.checkEmail(email);
                    if(result){
                        $.get('check/email/',{email:email},function(data){
                            var source = JSON.parse(data);
                            if(source.ok == false){
                                $this.find(' .emailRight').hide().attr('rel',0);
                                $this.find('.emailWrong a').text('邮箱已被注册！').parent().show();
                            }else{
                                $this.find('.emailWrong').hide()
                                $this.find('.emailRight').show().attr('rel',1);
                            };
                        })
                    }else{
                        $this.find('.emailRight').hide().attr('rel',0);
                        $this.find('.emailWrong a').text('邮箱格式有误！').parent().show();
                    }
                }

            }
        });
        //昵称是否重复和长度
        function checkName(strName){
            var len = strName.length;
            if( len>20 || len < 2 ){
                $this.find('.nameRight').hide().attr('rel',0);
                $this.find('.nameWrong a').text('2~20个字符之间').parent().show();
                return false;
            }else{
                $this.find('.nameRight').hide().attr('rel',0);
                $this.find('.nameWrong').hide();
                return true;
            }
        }
        $this.find('input[name=nickname]').keyup(function(){
            var str = $(this).val();
            checkName(str);
        });
        $this.find('input[name=nickname]').focusout(function(){
            var str = $(this).val();
            var result = checkName(str);
            if(result){
                $.get('check/nickname/',{nickname:str},function(data){
                    var source = JSON.parse(data);
                    if(source.ok == false){
                        $this.find('.nameRight').hide().attr('rel',0);
                        $this.find('.nameWrong a').text('昵称已被注册！').parent().show();
                    }else{
                        $this.find('.nameWrong').hide();
                        $this.find('.nameRight').show().attr('rel',1);
                    };
                })
            }
        });
        //提交注册表单
        $this.find('.Red_btn').click(function(){
            var user = $this.find('input[name=username]').val();
            var pwd = $this.find('input[name=password]').val();
            var name = $this.find('input[name=nickname]').val();
            var pwd2 = $this.find('.confirm').val();
            var result = true;
            $this.find('.eR').each(function(){
                var rel =  $(this).attr('rel');
                if(rel == 0){
                    result = false;
                }
            })
            if(result && pwd2 == pwd && pwd !=''){
                $.post('/register/?number='+Math.random(),{username:user,password:pwd,nickname:name},function(data){
                    var source = JSON.parse(data);
                    var id = source.data.user_id;
                    if(source.ok == false){
                        var reason = source.reason;
                    }else{
                        if($('.imgView').length == 0){
                            window.location.href='/pin/manager/';
                        }
                    };
                });
            }
            return false;
        });
        //focus 去掉提示
        $this.find('form[name=register_single] input').each(function(){
            var $self = $(this);
            $self.focusin(function(){
                $self.parent().find('a').hide();
            });
            $self.focusout(function(){
                var inputValue = $self.val();
                if(inputValue == ''){
                    $self.parent().find('a').show();
                }
            });
        });
        $this.find('form[name=register_single] span').each(function(){
            var $self = $(this);
            var inputValue = $self.val();
            $self.click(function(){
                $self.parent().find('input').focus();
                return false;
            });
        });
    },
    //忘记密码
    modSendPassword:function(){
        var $this = $(this);
        var ifNotNull = false;
        var emailSend = false;
        $this.find('input[name=email]').keyup(function(){
            var email = $(this).val()
            if(email == ''){
                emailSend = false;
                $this.find('form[name=sendEmail] .Txt_right').text('邮箱不能为空！').show();
                ifNotNull = false;
            }else{
                $('form[name=sendEmail] .Txt_right').hide();
                ifNotNull = true;
            }
        });

        $this.find('input[name=email]').focusout(function(){
            if(ifNotNull){
                var email = $this.find('input[name=email]').val();
                var result = Tuli.mods.checkEmail(email);
                if(result){
                    $.get('check/email/',{email:email},function(data){
                        var source = JSON.parse(data);
                        if(source.ok == false){
                            emailSend = true;
                        }else{
                            emailSend = false;
                            $('form[name=sendEmail] .Txt_right').text('邮箱不存在！').show();
                        };
                    })
                }else{
                    emailSend = false;
                    $('form[name=sendEmail] .Txt_right').text('邮箱格式有误！').show();
                };
            }
        });
        $this.find('#sendEmail').click(function(){
            var email = $this.find('input[name=email]').val();
            if(emailSend){
                $('.Getpsw_tips').show();
                $.get('forget/password/',{email:email},function(data){
                    var source = JSON.parse(data);
                    if(source.ok == false){
                        $('form[name=sendEmail] .Txt_right').text('提交邮箱失败！').show();
                    }else{
                        $('.Getpswform').hide();
                        $('.sendCallBack').show();
                    };
                });
            }
            return false;
        });
    }
});
