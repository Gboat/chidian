;String.prototype.realLength = function(){
    return this.replace(/[^\x00-\xff]/g,"**").length;
};
;var Tuli={};
(function(project,$){
    project.getMethod=function(id){
        var arr=id.split("-");
        var modName=arr[0];
        for (var i = 1; i < arr.length; i++) {
            var item=arr[i];
            modName+=item.substr(0,1).toUpperCase();
            modName+=item.substr(1);
        }
        return modName;
    };
    project.modsBind=function(obj){
        var mods=obj?obj.find("div[id^='mod-'][isInit!='true']"):$("div[id^='mod-'][isInit!='true']");
        if(!obj && project.mods["body"]){
            project.mods["body"]();
        }
        mods.each(function(i){
            var modMethod=project.getMethod(this.id);
            if(project.mods[modMethod]){
                
                project.mods[modMethod].apply(this,[this.id,modMethod]);
               $(this).attr("isInit","true");
            }
        });
        if(project.mods.complete){
            project.mods.complete();
        }
    }
    project.ajaxConfig=function(){
        $.ajaxSetup({
           timeout : 600000
         });
         
        $(document.body).ajaxError(function(e, jqxhr, settings, exception) {
              //alert(exception);
              $('.cmp-loading').fadeOut();
        });
        
        $('.cmp-loading').ajaxStart(function(){
            $(this).fadeIn();
        });

        $(document.body).ajaxComplete(function(event,request, settings){
            if($.trim(request.responseText).substr(0,1)=="<"){
                var o=$(request.responseText);
                o.each(function(){
                    if(this.id){
                        project.modsBind($("#"+this.id).parent());                        
                    }
                });
                
            }
            $('.cmp-loading').fadeOut();
            
        });
    };
    project.methods={

    }
    project.mods={

    }
    project.init=function(){
        project.ajaxConfig();
    };
})(Tuli,jQuery);
;(function($){
    $(document).ready(function(){
        Tuli.ajaxConfig();
        Tuli.modsBind();
    });
})(jQuery);
//初始化 公共部分
Tuli.realmName = 'localhost/eat360';
//document.domain = Tuli.realmName;
//浏览器判断
var browserName = navigator.userAgent.toLowerCase();
mybrowser = {
    version: (browserName.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, '0'])[1],
    safari : /webkit/i.test(browserName) && !this.chrome,
    opera  : /opera/i.test(browserName),
    firefox:/firefox/i.test(browserName),
    ie       : /msie/i.test(browserName) && !/opera/.test(browserName),
    mozilla: /mozilla/i.test(browserName) && !/(compatible|webkit)/.test(browserName) && !this.chrome,
    chrome : /chrome/i.test(browserName) && /webkit/i.test(browserName) && /mozilla/i.test(browserName)
}
//图集上传
function uploadAlbum(data){
    var source = JSON.parse(data);
    if(source.ok == true){
        var s_img_h = source.data.small_image_height;
        var s_img_w = source.data.small_image_width;
        var img_url = source.data.img_url;
        var img_id  = source.data.pin_id;
        var cover_img_h = source.data.cover_image_height; 
        var cover_img_w = source.data.cover_image_width;
        var img = "<img src="+img_url+" width="+cover_img_w+" height="+cover_img_h+" />";
        $('.localUpload .Feng_img img').remove();
        $('.localUpload .Feng_img').append(img);
        $('.localUpload input[name=cover_pin_id]').val(img_id);
        var src="<li class=''><a href='#' class='checked'><img src="+img_url+" cwidth="+cover_img_w+" cheight="+cover_img_h+" width="+s_img_w+" height="+s_img_h+" id="+img_id+" /><span class='Frd_Cbox'><input name='pin_ids[]' type='checkbox' checked='checked' value="+img_id+" /></span></a></li>"
        $('.localUpload .Upy').append(src);
        $('.localUpload .Upy li').each(function(){
            $(this).removeClass('Cover');
        });
        $('.localUpload .Upy li:last').addClass('Cover');
        //小图Hover
        $('.localUpload .Upy span').hover(function(){
            $(this).addClass('hover');
        },function(){
            $(this).removeClass('hover');
        });
    }else{
        var tip = source.reason;
        Tuli.mods.tipBox(225,190,3,tip);
    }
    $('.localUpload .Save_disable .editload,.localUpload .uploadLoading').hide();
    $('.localUpload .Save_disable').removeClass('Save_disable').addClass('Save_btn').attr('rel','ok');
};
$.extend(Tuli.mods,{
    //封面切换
    changeCover:function(event,sign){
    event.find('.Feng a').click(function(){
        var $Cover = event.find('.Cover');
        if($(this).hasClass('Tr')){
            if($Cover.next('li').attr('class') == undefined){
                $Cover.removeClass('Cover');
                event.find('.Upy li').first().addClass('Cover');
            }else{
                $Cover.removeClass('Cover').next('li').addClass('Cover');
            };
        }else{
            if($Cover.prev('li').attr('class') == undefined){
                $Cover.removeClass('Cover');
                event.find('.Upy li').last().addClass('Cover');
            }else{
                $Cover.removeClass('Cover').prev('li').addClass('Cover');
            };
        }
        var $cover =event.find('.Cover img');
        var src = $cover.attr('src');
        var cwidth = $cover.attr('cwidth');
        var cheight = $cover.attr('cheight');
        var cover_id = $cover.attr('id');
        event.find('input[name=cover_pin_id]').val(cover_id);
        event.find('.Feng_img img').attr({src:src,width:cwidth,height:cheight});
        if(sign == 1){
            $('#editPhoto input[name=cover_pin_id]').val(cover_id);
        }
        return false;
    });        
    },
    //上传图片
    uploadPhoto:function(){
    function init() {
        uploadImgs();
    };
    function navTab() {
        $('#Upimg_Web .Upimg_Tab li').click(function(){
            $('.Tab_on').removeClass('Tab_on');
            $(this).addClass('Tab_on');
            var rel = $(this).attr('rel');
            if(rel == 'web'){
                $('#Upimg_Web .webUpload').show();
                $('#Upimg_Web .localUpload').hide();
            }else{
                $('#Upimg_Web .localUpload').show();
                $('#Upimg_Web .webUpload').hide();
            };
            return false;
        });
    };
    function eventBindImgUplad() { /*本地图片上传绑定*/
        $('#save_upload_img').click(function(e){
            e.preventDefault();
            if($(this).attr('rel') != 0){
                var title =  $.trim($('.localUpload textarea').val());
                if(title == ''){
                    $('.localUpload h3 span').show();
                }else{
                    $('.localUpload .Save_btn .editload').show();
                    $('.localUpload .Save_btn').removeClass('Save_btn').addClass('Save_disable').attr('rel',0);
                    $('.uploadBtn').attr('rel',0);
                    $.post('/album/add/?number='+Math.random(),$('#uploadForm').serialize(),function(data){
                        var source = JSON.parse(data);
                        if(source.ok == true){
                            Tuli.mods.tipBox(190,100,1,'上传成功！');
                            $('#Upimg_Web,.dialog').hide();
                            if($('#mod-modif-img').attr('rel') == 1){
                                $.get('pin/manager/',{is_contain_header:1,album_state:1},function(data){
                                    $('.Wap_R div').remove();
                                    var $new = $('.Wap_R').append(data);
                                    $new.each(function(){
                                        $('#Mnpic .MnTab_on').removeClass('MnTab_on');
                                        $('#Mnpic .islock').parent().addClass('MnTab_on');
                                    });
                                });
                            }else{
                                window.location.href = '/pin/manager/?album_state=1';
                            }
                        }else{
                            Tuli.mods.tipBox(190,155,3,'上传失败,请重试！');
                        }    
                            $('.localUpload .Save_disable .editload').hide();
                            $('.localUpload .Save_disable').removeClass('Save_disable').addClass('Save_btn').attr('rel','ok');
                            $('.uploadBtn').attr('rel','ok');
                        });
                    }
            }
        });
        $("#img_upload").change(function(){                
            var fileName = $('#img_upload').val();
            var num = fileName.lastIndexOf('.');
            var allowType="jpg|gif|bmp|png";
            allowType= allowType.split('|');
            var fileType = fileName.substr(num+1,fileName.length);
            var pass = false;
            for(var i in allowType){
                if(fileType.toLowerCase() == allowType[i].toLowerCase()){
                    pass = true;
                    break;
                };
            };
            if(pass){
                $('.localUpload .uploadLoading').show();
                $('.localUpload .Save_btn').removeClass('Save_btn').addClass('Save_disable').attr('rel',0);
                document.getElementById("uploadForm").submit();
            }else{
                Tuli.mods.tipBox(190,155,3,'上传文件类型不符！');
            }
        });
    };
    function getWebImg(){ /*网页抓取绑定*/
        $('.webUpload .Upload_btn').click(function(e){
            e.preventDefault();
            var url = $('input[name=web_url]').val();
            if(url == ''){
                Tuli.mods.tipBox(190,155,2,'请输入抓取地址！');
            }else{
                $('.webUpload .loadImg').show();
                $('.webUpload .Save_btn').removeClass('Save_btn').addClass('Save_disable').attr('rel',0);
                $.get('pins/network/upload/',{url_string:url},function(data){
                    var source = JSON.parse(data);
                    if(source.ok){
                        var len = source.data.length;
                        var data = source.data;
                        var str = '';
                        for(var i = 0; i < len; i++){
                            str +="<li class=''><a class='checked' href='#'><img src="+data[i].img_url+" cwidth="+data[i].cover_img_width+" cheight="+data[i].cover_img_height+" width="+data[i].small_img_width+" height="+data[i].small_img_height+" /><span class='Frd_Cbox' ><input name='img_urls[]' type='checkbox' checked='checked' value="+data[i].img_url+" /></span></a></li>";
                        };
                        $('input[name=cover_img_url]').val(data[0].img_url);
                        var img = "<img src="+data[len-1].img_url+" width="+data[len-1].cover_img_width+" height="+data[len-1].cover_img_height+" />";
                        $('.webUpload .Feng_img img').remove();
                        $('.webUpload .Feng_img').append(img);
                        $('.webUpload .Upy').append(str);
                        $('.webUpload .Upy li').each(function(){
                            $(this).removeClass('Cover');
                        });
                        $('.webUpload .Upy li:last').addClass('Cover');
                        //小图Hover
                        $('.webUpload .Upy span').hover(function(){
                            $(this).addClass('hover');
                        },function(){
                            $(this).removeClass('hover');
                        });
                    }else{
                        Tuli.mods.tipBox(190,155,2,'图片尺寸不正确！');
                    }
                    $('.webUpload .Save_disable').removeClass('Save_disable').addClass('Save_btn').attr('rel','ok');
                    $('.webUpload .Save_btn .editload,.webUpload .loadImg').hide();
                });
            }
        });
        $('#save_web_img').click(function(e){
            e.preventDefault();
            if($(this).attr('rel')!=0){
                var title =  $.trim($('.webUpload textarea').val());
                if(title == ''){
                    $('.webUpload h3 span').show();
                }else{
                    $.post('/album/add/net/?number='+Math.random(),$('form[name=webAlbum]').serialize(),function(data){
                        var source = JSON.parse(data);
                        if(source.ok){
                            Tuli.mods.tipBox(190,100,1,'上传成功！');
                            $('#Upimg_Web,.dialog').hide();
                            if($('#mod-modif-img').attr('rel') == 1){
                                $.get('pin/manager/',{is_contain_header:1,album_state:1},function(data){
                                    $('.Wap_R div').remove();
                                    var $new = $('.Wap_R').append(data);
                                    $new.each(function(){
                                        $('#page_nav a').attr('href','/pin/manager/2/?album_state=1');
                                        $('#Mnpic .MnTab_on').removeClass('MnTab_on');
                                        $('#Mnpic .islock').parent().addClass('MnTab_on');
                                    });
                                });
                            }else{
                                window.location.href = '/pin/manager/?album_state=1';
                            }
                        }else{
                            Tuli.mods.tipBox(190,155,3,'上传失败,请重试！');
                        }
                    });
                }
            }
        });
    };
    function uploadImgs(){
        this.__innerHTML = '<div class="Uweb localUpload">'+
                            '<iframe id="upload_img_frame" style="display:none" name="upload_img_frame" src="about:blank"></iframe>'+
                            '<form enctype="multipart/form-data" method="POST" target="upload_img_frame" id="uploadForm" action="/pins/local/upload/" action-type="form" node-type="form" name="uploadForm">'+
                            '<div class="Feng">'+
                            '<a href="#" class="Tl" title="上一张"></a>'+
                            '<span class="Feng_img">'+
                            '<em></em>'+
                            '</span>'+
                            '<input type="hidden" name="cover_pin_id" />'+
                            '<a href="#" class="Tr" title="下一张"></a>'+
                            '</div>'+
                            '<div class="Up_Rcon">'+
                            '<div class="web_upload uploadField">'+
                            '<a href="#" class="Upload_btn" title="上传图片">上传图片</a>'+
                            '<input type="file" name="pin_img" id="img_upload" class="uploadBtn"></input>'+
                            '<p>'+
                            '<div class="uploadLoading">'+
                            '<img width="28" height="28" src="/images/Loading.gif" />'+
                            '<span>正在上传</span>'+
                            '</div>'+
                            '</p>'+
                            '</div>'+
                            '<h3>标题<span class="Red_A ">不填标题，不让你提交~</span></h3>'+
                            '<textarea name="album_name"></textarea>'+
                            '<a href="#" id="save_upload_img" class="Save_btn">确认提交<div class="editload"></div></a>'+
                            '</div>'+
                            '<div class="Imglist">'+
                            '<ul class="Upy">'+
                            '</ul>'+
                            '</div>'+
                            '</form>'+
                            '</div>'+
                            '<div class="Uweb webUpload">'+
                            '<form name="webAlbum">'+
                                '<div class="Feng">'+
                                    '<a href="#" class="Tl" title="上一张"></a>'+
                                    '<span class="Feng_img"><em></em></span>'+
                                    '<a href="#" class="Tr" title="下一张"></a>'+
                                    '<input type="hidden" name="cover_img_url" />'+
                                '</div>'+
                                '<div class="Up_Rcon">'+
                                    '<div class="web_upload">'+
                                        '<span class="Txt_s_off">'+
                                            '<input name="web_url" type="text" />'+
                                        '</span>'+
                                        '<a href="#" class="Upload_btn" title="开始抓取">开始抓取</a>'+
                                        '<img class="loadImg" width="28" height="28" src="/images/Loading.gif" />'+
                                    '</div>'+
                                    '<h3>标题<span class="Red_A ">不填标题，不让你提交~</span></h3>'+
                                    '<textarea name="album_name"></textarea>'+
                                    '<a href="#" id="save_web_img" class="Save_btn">确认提交<div class="editload"></div></a>'+
                                '</div>'+
                                '<div style="clear:both;+clear:none;color:#333;font-size:12px;padding: 10px 0 10px 30px;float:left">只能提交宽高大于450x300尺寸的图片</div>'+
                                '<div class="Imglist" style="padding:0 0 0 30px">'+
                                    '<ul class="Upy">'+                        
                                    '</ul>'+
                                '</div>'+
                            '</form>'+
                            '</div>';
            //本地上传提交
            $('#Upimg_Web .Log_M').html(this.__innerHTML);
            //本地上传--封面切换
            Tuli.mods.changeCover($('.localUpload'));
            //网页抓取--封面切换
            Tuli.mods.changeCover($('.webUpload'));
            //textarea focusin
            $('.localUpload textarea,.webUpload textarea').focusin(function(){
                $(this).parents('#Upimg_Web').find('h3 span').hide();
            });
            $('.localUpload unploadBtn').click(function(event){
                    if($(this).attr('rel') == 0){
                        event.stopPropagation();
                        event.preventDefault();
                    };
            });
            $('.webUpload .Upy,.localUpload .Upy').delegate('li','click',function(){
                    var $self = $(this);
                    var $checkbox = $self.find('input'); 
                    var checked = $checkbox.attr('checked');
                    if(checked == "checked"){
                        $checkbox.attr('checked',false);
                        $self.find('span').addClass('Cbox-off').parents('a').removeClass('checked');
                    }else{
                        $checkbox.attr('checked','checked');
                        $self.find('span').removeClass('Cbox-off').parents('a').addClass('checked');
                    };    
                    return false;
            });
            navTab();
            /* event bind */
            eventBindImgUplad();
            getWebImg();
    }
    //nav upload
    $('#Header .Upload').each(function(){
        $(this).click(function(){
            $('#PlayerGuide').hide();
            $('.Data-Msg').parent().remove();
            uploadImgs();
            if(mybrowser.ie && mybrowser.version == 6.0){
                $('html,body').addClass('unScroll');
                var top =  (document.body.scrollTop || document.documentElement.scrollTop);
                $('.dialog').css('top',top).show();
            }else{
                $('.dialog').show();
            }
            var left = Math.floor(document.body.clientWidth/2-382);
            var y = 0;
            if(mybrowser.ie && mybrowser.version == 6.0){
                y = document.body.scrollTop || document.documentElement.scrollTop;
            }
            var top = Math.floor(y + window.screen.availHeight*0.35-245);
            if(Tuli.mods.kwVerson && Tuli.mods.kwVerson <3.0){
                left = 0;
                top = Math.floor(y);
            }
            $('#Upimg_Web .localUpload .Upy,#Upimg_Web .webUpload .Upy').empty();
            $('#Upimg_Web .Feng_img img').each(function(){
                $(this).remove();
            });
            $('#Upimg_Web textarea,input[name=web_url]').val('');
            $('#Upimg_Web').css({'left':left,"top":top}).show();
            $('.Upimg_Tab li:first-child').addClass('Tab_on');
            $('.Upimg_Tab li:last-child').removeClass('Tab_on');
            return false;
        });
        $('#Upimg_Web .Close2').click(function(){
            $('#Upimg_Web,.dialog').hide();
            if(mybrowser.ie && mybrowser.version == 6.0){
                $('html,body').removeClass('unScroll');
            }
            return false;
        });
    });
    },
    //第一个参数：外框tipBox宽度，第二参数为tipRequest宽度，第三个参数为类型：1为成功2为异常3为警告，第四个参数为提示语言，第五个为反馈的特殊情况
    tipBox:function(width,midWidth,type,str,diff){
        var state = '';
        if(type==1){
            state = 'succ';
        }else if (type == 2){
            state = 'abnormal'
        }else{
            state = 'warn';
        };
        var top = (document.body.scrollTop || document.documentElement.scrollTop)+250;
        var code = '<div class="tipBBox"><div class="tipRequest" style="width:'+midWidth+'px"><p class="tipContent" ><a class="'+state+'"></a>'+str+'</p></div></div>';
        $('body').append(code);
        var showWidth = $('body').width();
        $('.tipBBox').css({'left':showWidth/2-width/2,'top':top,'width':width}).show();
        setTimeout(function(){$('.tipBBox').fadeOut(1500,function(){
            $('.tipBBox').remove();
        })},1000);
    },
    //第一个为获得焦点的对象，第二个为将要改变CSS的样式
    eventFocus:function(event,focus){
        event.focusin(function(){
            focus.addClass('onFocus');
        });
        event.focusout(function(){
            focus.removeClass('onFocus');
        });
    },
    removeDefault:function(event){
        if($('.defaultHover').length>0){
            $('.defaultHover').removeClass('defaultHover');
        };
        event.parent().addClass('defaultHover');
        if($('#mod-modif-img').attr('rel')=='1'){
            $('.Wap_R').css('border-top','none');
        }else{
            $('.Wap_R').css('border-top','2px solid #aa0000');
        }
    },
    //数据验证
    checkEmail:function(strEmail) {
        var emailReg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if(emailReg.test(strEmail)){
            return true;
        }else{
            return false;
        };
    },
    //回车提交
    keySubmit:function(form,btn){
        form.find('input').each(function(){
            $(this).keydown(function(event){
                if (event.keyCode == 13){  
                    btn.trigger('click');
                }
            })
        })
    },
    //屏幕resize 
    resizeWater:function(option){
        var clientWidth = document.body.clientWidth;
        if(clientWidth>=1425){
            if(option){
                $('.autoW').css('width',1425);
            }
            $('#Header .Wapper').css('width',1410);
        }else if(clientWidth >=1185){
            if(option){
                $('.autoW').css('width',1185);
            }
            $('#Header .Wapper').css('width',1170);
        }else{
            if(Tuli.mods.kwVerson){
                if(Tuli.mods.kwVerson <3.0)
                    divWidth = 0;
                else{
                    if(clientWidth<918){
                        if(clientWidth>585){
                            $('#Header .Wapper').css('width',clientWidth-15);
                            if(option){
                                $('.autoW').css('width','100%');
                            };
                        }else{
                            $('#Header .Wapper').css('width',515);
                            if(option){
                                $('.autoW').css('width',200);
                            };
                        }
                    }else{
                        if(option){
                            $('.autoW').css('width',933);
                        }
                        $('#Header .Wapper').css('width',900);
                    }
                }
            }else{
                if(clientWidth>530){
                    $('#Header .Wapper').css('width',clientWidth-15);
                }else{
                    $('#Header .Wapper').css('width',515);
                }
                if(option){
                    $('.autoW').css('width',933);
                }
            }
        };
        
        
    }
});
