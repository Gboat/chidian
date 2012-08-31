window.ajaxUrl = "http://10.18.101.94:8000";
$(function(){
	gettag();
	getchannel();
	$("#new_tag").focusin(function(e){
		$("#color_sel").show().delay(20000).fadeOut("slow");
		newtag();
    });
	$("#tag_manage").click(function(e) {
        if($(this).attr("status") == 0){
			$(this).attr("style","background:#005176; color:#FFF;");
			$(this).attr("status","1");
			$(".umt_left ul li").css("background","url(/images/layout.png) 180px -1062px no-repeat");
			$(".umt_left ul li").css("color","#000");
			$("#new_tag").hide();
		}else{
			$(this).attr("style","");
			$(this).attr("status","0");
			$(".umt_left ul li").css("background-image","none");
			$("#new_tag").show();
			gettag();
		}
    });
	$(".umt_left ul li").live("click",function(){
		if($("#tag_manage").attr("status") == 0){
			window.location.href = $(this).attr("href");
		}else{
			var key = $(this).attr("key");
			$.post(window.ajaxUrl+"/issue/tag/delete/",{appkey:urlGet("app_key"), tagkey:$(this).attr("key") },function(data){
				if(data){
					window.location.href = location.href.replace("tags=","tags=,").replace(","+key,"").replace("tags=,","tags=");
				}
			},"jsonp");
		}
	});
	$(".umt_main .umt_list .umt_list_item").live("mouseover",function(){
		edittag($(this));
		$(this).children("div.link").children("a.link").show();
		$(this).children("div.link").children(".jiathis_style").css("display","inline-block");
		$(this).children(".jiathis_style").css("display","inline-block");
		setShare($(this).children("span:first").text(),$(this).children("span:first").children("a").attr("href")?$(this).children("span:first").children("a").attr("href"):"http://");
	});
	$(".umt_main .umt_list .umt_list_item").live("mouseleave",function(){
		$(this).children("div.link").children("a.link").hide();
		$(this).children("div.link").children(".jiathis_style").hide();
		$(this).children(".jiathis_style").css("display","none");
	});
	$("#tag_sel").mouseleave(function(){
			$("#tag_sel").hide();
	});
	$(".umt_main .umt_list .umt_list_item input.manage_btn").live("change",function(){
		edittag2content();
	});
	$(".sel_all").click(function(){
		var checkbox = $(".umt_main .umt_list .umt_list_item .manage_btn:checked");
		if(!checkbox.val()){
			$(".umt_main .umt_list .umt_list_item .manage_btn").each(function(index, element) {
				$(this).attr("checked","checked");
				$(this).show();
				edittag2content();
			});
		}else{
			$(".umt_main .umt_list .umt_list_item .manage_btn").each(function(index, element) {
				$(this).removeAttr("checked");
				$(this).hide();
				$(this).parent("div.umt_list_item").css("background","none");
				edittag2content();
			});
		}
	});
	$("#tag_sel").css("left",$(".umengADsystem_container").offset("").left+$(".umengADsystem_container").width());
	$("#tag_sel").draggable();
	$("#tag_sel .close_btn").click(function(e) {
        $("#tag_sel").hide();
		var checkbox = $(".umt_main .umt_list .umt_list_item .manage_btn:checked");
		checkbox.each(function(index, element) {
            $(this).removeAttr("checked");
			$(this).hide();
			$(this).parent("div.umt_list_item").css("background","none");
        });
    });
	
})
function tabTo(e){
	$(".umt_main .umt_tab li").each(function(index, element) {
        $(this).removeClass("umt_active");
    });
	$(e).addClass("umt_active");
	$(".umt_list").each(function(index, element) {
        $(this).attr("id") != "umt_list_"+$(e).attr("tabto")?$(this).hide():$(this).show();
    });
	dt = urlGet("dt") == ""?"-1":urlGet("dt");
	var postdata = urlGet("tags")==""?{appkey: urlGet("app_key"), channel:$(e).attr("tabto"), dt:dt}:{appkey: urlGet("app_key"), channel: $(e).attr("tabto"), dt:dt, tag:urlGet("tags")};
	$.post(window.ajaxUrl+"/issue/comment/get/",postdata,
		function(data){
			$("#umt_list_"+$(e).attr("tabto")).html("");
			for(i in data){
				if( data[i].channel == "appstore"){
					$("#umt_list_"+$(e).attr("tabto")).append('<div class="umt_list_item" id="content_'+data[i].commentkey+'"><span>'+data[i].content+'</span><span class="time">'+dateTime(data[i].dt)+'</span><br />'+$(".share").html()+'<div class="star"></div><input type="checkbox" class="manage_btn" value="'+data[i].commentkey+'" /><ul class="lable"></ul><div class="c"></div></div>');
					for(n=0;n<parseInt(data[i].star);n++){
						$("#umt_list_"+$(e).attr("tabto")+' #content_'+data[i].commentkey+" .star").append("<span></span>");
					}
				}else{
					$("#umt_list_"+$(e).attr("tabto")).append('<div class="umt_list_item" id="content_'+data[i].commentkey+'"><a href="'+data[i].userlink+'" target="_blank"><img src="'+data[i].usericon+'" /></a><span><a href="'+data[i].contentlink+'" target="_blank">'+data[i].content+'</a></span><span class="time">'+dateTime(data[i].dt)+'</span><input type="checkbox" class="manage_btn" value="'+data[i].commentkey+'" /><div class="link">'+$(".share").html()+'<a class="link" href="'+data[i].userlink+'" target="_blank">联系用户</a><a class="link" href="'+data[i].contentlink+'" target="_blank">回复评论</a></div><ul class="lable"></ul><div class="c"></div></div>');
				}
				if($(e).attr("tabto") == "all"){
					var text = data[i].channel=='appstore'?"appstore":"新浪微博";
					$("#umt_list_"+$(e).attr("tabto")+" #content_"+data[i].commentkey+" span:first").append("<span class='from'>(来自："+text+")</span>");
				}
				for(j in data[i].tags){
					if(data[i].tagnames[j] != "-1"){
						$("<li style='border-color:"+creatColor(data[i].colors[j])+"' color='"+data[i].tags[j]+"'>"+data[i].tagnames[j]+"</li>").appendTo("#content_"+data[i].commentkey+" ul.lable");
					}
				}
			}
			if(!data[0]){
				$("<div class='notice'>没有符合您标签选项的issue.<br />可能因为该标签确实无对应issue，或者您选择的标签组合不正确</div>").appendTo(".umt_main .umt_list");
			}
			var time = data[9]?data[9].dt:"none";
			if(urlGet("dt") == "-1"){
				$.cookies.set( 'page', "-1,"+time);
				$(".prev").attr("href","#");
			}
			if(urlGet("dt") == ""){
				$.cookies.set( 'page', "-1,"+time);
				$(".next").attr("href",location.href+"&dt="+time);
			}else{
				var cookie = $.cookies.get("page").split(",");
				if(urlGet("dt") != cookie[cookie.length-1]){
					$(".pagenav span").text(cookie.length-2);
					if(cookie[cookie.length-4])
					$(".prev").attr("href",location.href.replace(urlGet("dt"),cookie[cookie.length-4]));
					$(".next").attr("href",location.href.replace(urlGet("dt"),time));
					var set = "-1";
					for(i=1;i<=cookie.length-2;i++){
						set = set+","+cookie[i];
					}
					$.cookies.set( 'page', set);
				}else{
					$(".pagenav span").text(cookie.length);
					if(cookie[cookie.length-2])
					$(".prev").attr("href",location.href.replace(urlGet("dt"),cookie[cookie.length-2]));
					$(".next").attr("href",location.href.replace(urlGet("dt"),time));
					$.cookies.set( 'page', cookie+","+time);
				}
			}
			if(urlGet("dt") == "-1"){
				$.cookies.set( 'page', "-1,"+time);
				$(".prev").attr("href","#");
			}
			if(time == "none"){
				$(".next").removeAttr("href");
			}
			if(parseInt($(".pagenav span").text())<1){
				$(".pagenav span").text("1");
				$.cookies.set( 'page', "-1,"+time);
			}
			var sel_left = $(".umt_main").offset().left+$(".umt_main").width()+20;
			while(sel_left+200 >= window.screen.availWidth){
				$(".umt_main").width($(".umt_main").width()-200);
				$(".umt_main .umt_list .umt_list_item span a").width($(".umt_main .umt_list .umt_list_item span a").width()-200);
				sel_left = sel_left-200;
			}
			$("#tag_sel").css("left",sel_left);
			$("html").append('<script type="text/javascript" src="http://v1.jiathis.com/code/jia.js?uid=您的UID" charset="utf-8"></script>');
		},"jsonp");
}
function getchannel(){
	var channel = urlGet("channel");
	if(channel != ""){
		$(".umt_main .umt_tab li").each(function(index, element) {
			$(this).click(function(e){
				window.location.href = location.href.replace(location.search,"")+'?app_key='+urlGet("app_key")+'&channel='+$(this).attr("tabto");
			});        
		});
	}else{
		var channel = 'all';
		$(".umt_main .umt_tab li").each(function(index, element) {
			$(this).click(function(e){
				window.location.href = location.href+"&channel="+$(this).attr("tabto");
			});        
		});

	}
	$(".umt_tab li.tab_"+channel).size()>0?tabTo(".umt_tab li.tab_"+channel):tabTo(".umt_tab li.tab_all");
}
function gettag(){
	var tags = ","+urlGet("tags");
	$.post(window.ajaxUrl+"/issue/tag/all/",{ appkey: urlGet("app_key")},
		function(data){
			$(".umt_left ul").html("");
			for(i in data){
				var color = creatColor(parseInt(data[i].color));
				if(tags.indexOf(","+data[i].tagkey) != -1){
					var url = decodeURI(location.href).replace("tags=","tags=,").replace(","+data[i].tagkey,"").replace("tags=,","tags=").replace("&dt="+urlGet("dt"),"");
					$(".umt_left ul").append('<li color="'+data[i].color+'" style="border-color:'+color+';background:'+color+';color:#FFF;" href="'+url+'" key="'+data[i].tagkey+'">'+data[i].name+'<span>'+data[i].num+'</span></li>');
				}else{
					var url = (tags == ',')&&(location.href.indexOf("tags=") == -1) ?decodeURI(location.href).replace("&dt="+urlGet("dt"),"")+"&tags="+data[i].tagkey:decodeURI(location.href).replace("tags=","tags="+data[i].tagkey+",").replace("&dt="+urlGet("dt"),"");
					
					$(".umt_left ul").append('<li color="'+data[i].color+'" style="border-color:'+color+';" href="'+url+'" key="'+data[i].tagkey+'">'+data[i].name+'<span>'+data[i].num+'</span></li>');
				}
			}
		},"jsonp");
}
function newtag(){
	$("#color_sel").html("");
	for(i=0;i<16;i++){
		color = creatColor(i);
		$("#color_sel").append("<div color="+i+" style='background:"+color+";color:#fff;'></div>");
	}
	$("#color_sel div").each(function(index, element) {
		$(this).click(function(e) {
			if($("#new_tag").val() != ""){
				var i = parseInt($(this).attr("color"));
				$.post(window.ajaxUrl+"/issue/tag/add/",{ appkey:urlGet("app_key"), name:$("#new_tag").val(),color:$(this).attr("color")},
					function(data){
						if(data.tagkey){
							$("#color_sel").hide();
							color = creatColor(i);
							var tags = ","+urlGet("tags");
							var url = (location.href.indexOf("tags=") == -1) ?decodeURI(location.href)+"&tags="+data.tagkey:decodeURI(location.href).replace("tags=","tags="+data.tagkey+",");						
							$(".umt_left ul").append('<li color="'+i+'" style="border-color:'+color+'" href="'+url+'" key="'+data.tagkey+'">'+$("#new_tag").val()+'<span>0</span></li>');
													$("#new_tag").val("");
						}

				},"jsonp");
			}else{
						$("#color_sel").hide();
			}
		});
	});
}
function urlGet(key){
	var value = location.search.indexOf(key+"=");
	if(value != -1){
		var value = location.search.substr(value+key.length+1);
		var others = value.indexOf("&");
		if(others != -1){
			var value = decodeURI(value.substr(0,others));
		}else{
			var value = decodeURI(value);
		}
	}else{
		value = "";
	}
	if(value == "undefined"){
		value = "";	
	}
	return value;
}
function creatColor(num){
	/*var x = 255-(50*num)%256;
	var color;
	switch(num%6){
		case 0:	color = "rgba(244,126,"+x+",1)";break;
		case 1:	color = "rgba(244,"+x+",126,1)";break;
		case 2:	color = "rgba(126,244,"+x+",1)";break;
		case 3:	color = "rgba(126,"+x+",244,1)";break;
		case 4:	color = "rgba("+x+",244,126,1)";break;
		case 5:	color = "rgba("+x+",126,244,1)";break;
	}*/
	num = parseInt(num);
	var color;
	switch(num%16){
		case 0: color = '#7ecef4';break;
		case 1: color = '#00b7ee';break;
		case 2: color =  '#00a0e9';break;
		case 3: color =  '#0075a9';break;
		case 4: color =  '#004986';break;
		case 5: color =  '#535353';break;
		case 6: color =  '#e60012';break;
		case 7: color =  '#22ac38';break;
		case 8: color =  '#f39800';break;
		case 9: color =  '#f7ea58';break;
		case 10: color =  '#00561f';break;
		case 11: color =  '#9e00d2';break;
		case 12: color =  '#6400df';break;
		case 13: color =  '#6837bb';break;
		case 14: color =  '#7e58be';break;
		case 15: color =  '#9a85be';break;
	}
	return color;
}
/*function edittag2content(){
		var checkbox = $(".umt_main .umt_list .umt_list_item .manage_btn:checked");
		var content = new Array();
		var contentstr;
		checkbox.each(function(index, element) {
			content[index] = $(this).val();
			contentstr = contentstr?contentstr+","+$(this).val():$(this).val();
		});
		if(checkbox.val()){
			$("#tag_sel ul").html("");
			$(".umt_left ul li").each(function(index, element) {
				var tag = $(this).text();
				var tagbeselected = 1;
				for(i in content){
					var has = 0;
					$("#content_"+content[i]+" ul.lable li").each(function(index, element) {
                        $(this).text()==tag?has++:has;
                    });
					if(has == 0){
						tagbeselected = 0;
						break;
					}
				}
				if( tagbeselected != 1){
					$("#tag_sel ul").append("<li style='border-color:"+creatColor($(this).attr("color"))+"' sel='0' color='"+$(this).attr("color")+"'>"+$(this).text()+"</li>");
				}else{
					$("#tag_sel ul").append("<li style='border-color:"+creatColor($(this).attr("color"))+";background:"+creatColor($(this).attr("color"))+";color:#FFF' sel='1' color='"+$(this).attr("color")+"'>"+$(this).text()+"</li>");
				}
            });
			$("#tag_sel").show();
			$("#tag_sel").css("left",$(".umengADsystem_container").offset("").left+$(".umengADsystem_container").width()/2);
			$("#tag_sel").css("opacity","1");
			$("#tag_sel").hover(function(){
				$("#tag_sel").css("opacity","1");
				},function(){
				$("#tag_sel").css("opacity","1");
				});
			$("#tag_sel ul li").each(function(index, element) {
                $(this).click(function(e) {
					var tag = $(this);
					$.post(window.ajaxUrl,{ action: "changetag", content: contentstr, tag: tag.text(),method: tag.attr("sel")==0?"add":"del"},function(data){
						if(tag.attr("sel")!=1){
							tag.attr("style","border-color:"+creatColor(tag.attr("color"))+";background:"+creatColor(tag.attr("color"))+";color:#FFF");
							tag.attr("sel","1");
						}else{
							tag.attr("style","border-color:"+creatColor(tag.attr("color"))+";");
							tag.attr("sel","0");

						}
						if(data.status == 1){
							for(i in content){
								var hasthistag = 0;
								$("#content_"+content[i]+" ul.lable li").each(function(index, element) {
                                	if($(this).text() == tag.text()){
										if(tag.attr("sel")!=1){
											$(this).remove();
										}
										hasthistag = 1;
										return;
									}
                                });
								if(hasthistag == 0){
									$("#content_"+content[i]+" ul.lable").append("<li style='border-color:"+creatColor(tag.attr("color"))+"' color='"+tag.attr("color")+"'>"+tag.text()+"</li>");
								}
							}
						}
						
					},"jsonp");
                    
                });
            });
		}else{
			$("#tag_sel").hide();
		}
}

function edittag2content(){
		var checkbox = $(".umt_main .umt_list .umt_list_item .manage_btn:checked");
		var content = new Array();
		var contentstr;
		checkbox.each(function(index, element) {
			content[index] = $(this).val();
			contentstr = contentstr?contentstr+","+$(this).val():$(this).val();
		});
		if(checkbox.val()){
			$("#tag_sel ul").html("");
			$(".umt_left ul li").each(function(index, element) {
			var tag = $(this).text();
			$("#tag_sel ul").append("<li style='border-color:"+creatColor($(this).attr("color"))+"' sel='0' color='"+$(this).attr("color")+"' name='"+$(this).text()+"'>"+$(this).text()+"<span class='add'>+</span><span class='del'>-</span></li>");
            });
			$("#tag_sel").css("top",$(".umt_main .umt_list .umt_list_item .manage_btn:checked").offset("").top);
			$("#tag_sel").show();
			$("#tag_sel ul li").each(function(index, element) {
				var tag = $(this);
				$(this).children(".add").click(function(){
					$.post(window.ajaxUrl,{ action: "changetag", content: contentstr, tag: tag.attr("name"),method:"add"},function(data){
						if(data.status == 1){
							for(i in content){
								var hasit = 0;
								$("#content_"+content[i]+" ul.lable li").each(function(index, element) {
                                	if($(this).text() == tag.attr("name")){
											hasit++;
									}
                                });
								if(hasit == 0){
									$("#content_"+content[i]+" ul.lable").append("<li style='border-color:"+creatColor(tag.attr("color"))+"' color='"+tag.attr("color")+"'>"+tag.attr("name")+"</li>");
								}
							}
						}
						
					},"jsonp");
				});
                $(this).children(".del").click(function(e) {
					$.post(window.ajaxUrl,{ action: "changetag", content: contentstr, tag: tag.attr("name"),method:"del"},function(data){
						if(data.status == 1){
							tag.remove(".add");
							for(i in content){
								$("#content_"+content[i]+" ul.lable li").each(function(index, element) {
                                	if($(this).text() == tag.attr("name")){
											$(this).remove();
									}
                                });
							}
						}
						
					},"jsonp");
                    
                });
            });
		}else{
			$("#tag_sel").hide();
		}
}*/
function edittag(content){
	
			$("#tag_sel ul").html("");
			$(".umt_left ul li").each(function(index, element) {
				var tag = $(this).html().replace("<span>"+$(this).children("span").text()+"</span>","");
				var has = 0;
				content.children(" ul.lable").children("li").each(function(index, element) {
					if($(this).text() == tag){
						has =1;
						return;
					}
				});
				if( has != 1){
					$("#tag_sel ul").append("<li style='border-color:"+creatColor($(this).attr("color"))+"' sel='0' color='"+$(this).attr("color")+"' key='"+$(this).attr("key")+"'>"+$(this).html().replace("<span>"+$(this).children("span").text()+"</span>","")+"</li>");
				}else{
					$("#tag_sel ul").append("<li style='border-color:"+creatColor($(this).attr("color"))+";background:"+creatColor($(this).attr("color"))+";color:#FFF' sel='1' color='"+$(this).attr("color")+"'  key='"+$(this).attr("key")+"'>"+$(this).html().replace("<span>"+$(this).children("span").text()+"</span>","")+"</li>");
				}
				
            });
			$("#tag_sel").css("top",content.offset().top);
			$("#tag_sel").show();
			$("#tag_sel ul li").click(function(e) {
				var tag = $(this);
				$.post(window.ajaxUrl+"/issue/comment/update/",{appkey:urlGet("app_key"), channel: urlGet("channel")!=""?urlGet("channel"):"all", commentkey: content.children("input").val(), tagkey: tag.attr("key"),action: tag.attr("sel")==0?"add":"delete"},function(data){
					if(tag.attr("sel")!=1){
						tag.attr("style","border-color:"+creatColor(tag.attr("color"))+";background:"+creatColor(tag.attr("color"))+";color:#FFF");
						tag.attr("sel","1");
					}else{
						tag.attr("style","border-color:"+creatColor(tag.attr("color"))+";");
						tag.attr("sel","0");

					}
					if(data.st == 1){
						if(tag.attr("sel")==1){
							content.children("ul").append("<li style='border-color:"+creatColor(tag.attr("color"))+"' color='"+tag.attr("color")+"'>"+tag.html().replace("<span>"+tag.children("span").text()+"</span>","")+"</li>");
						}else{
							content.children("ul").children("li").each(function(){
								if($(this).text() == tag.text()){
									$(this).remove();
									return;
								}
							});
						}
					}
					
				},"jsonp");
				
			});
}
function dateTime(nS) {
	var time = new Date(parseInt(nS));
	return (time.getMonth()+1)+"-"+time.getDate()+" "+time.getHours()+":"+(time.getMinutes()<10?"0":"")+time.getMinutes();
}

