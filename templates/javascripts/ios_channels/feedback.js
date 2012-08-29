window.ajaxUrl = "http://10.18.102.111/test.php";
$(function(){
	gettag();
	getchannel();
	$("#new_tag").focusin(function(e){
		$("#color_sel").show().delay(20000).fadeOut("slow");
		newtag();
    });
	$(".umt_left ul li").live("click",function(){
		window.location.href = $(this).attr("href");
	});
	$(".umt_main .umt_list .umt_list_item").live("mouseover",function(){
		$(this).children(".manage_btn").show();
	});
	addtag2content();
	
})
function tabTo(e){
	$(".umt_main .umt_tab li").each(function(index, element) {
        $(this).removeClass("umt_active");
    });
	$(e).addClass("umt_active");
	$(".umt_list").each(function(index, element) {
        $(this).attr("id") != "umt_list_"+$(e).attr("tabto")?$(this).hide():$(this).show();
    });
	$.post(window.ajaxUrl,{ action: "getcontent", type: $(e).attr("tabto")},
		function(data){
			$("#umt_list_"+$(e).attr("tabto")).html("");
			for(i in data){
				$("#umt_list_"+$(e).attr("tabto")).append('<div class="umt_list_item" id="content_'+data[i].id+'"><img src="/images/ios_channels/app_changba.png" /><span>'+data[i].text+'</span><input type="checkbox" class="manage_btn" value="'+data[i].id+'" /><ul class="lable"></ul><div class="c"></div></div>');
				for(j in data[i].tags){
					$("<li style='border-color:"+creatColor(data[i].tags[j].color)+"' color='"+data[i].tags[j].color+"'>"+data[i].tags[j].name+"</li>").appendTo("#content_"+data[i].id+" ul.lable");
				}
			}
		},"jsonp");
}
function getchannel(){
	var channel = urlGet("channel");
	if(channel != ""){
		$(".umt_main .umt_tab li").each(function(index, element) {
			$(this).click(function(e){
				window.location.href = location.href.replace("channel="+channel,"channel="+$(this).attr("tabto"));
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
	$.post(window.ajaxUrl,{ action: "gettag"},
		function(data){
			$(".umt_left ul").html("");
			for(i in data){
				var color = creatColor(parseInt(data[i].color));
				if(tags.indexOf(","+data[i].name) != -1){
					var url = decodeURI(location.href).replace("tags=","tags=,").replace(","+data[i].name,"").replace("tags=,","tags=");
					$(".umt_left ul").append('<li color="'+data[i].color+'" style="border-color:'+color+';background:'+color+';color:#FFF;" href="'+url+'">'+data[i].name+'</li>');
				}else{
					var url = (tags == ',')&&(location.href.indexOf("tags=") == -1) ?decodeURI(location.href)+"&tags="+data[i].name:decodeURI(location.href).replace("tags=","tags="+data[i].name+",");
					$(".umt_left ul").append('<li color="'+data[i].color+'" style="border-color:'+color+';" href="'+url+'">'+data[i].name+'</li>');
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
				$.post(window.ajaxUrl,{ action: "creattag", name:$("#new_tag").val(),color:$(this).attr("color")},
					function(data){
						$("#color_sel").hide();
						color = creatColor(i);
						var tags = ","+urlGet("tags");
						var url = (location.href.indexOf("tags=") == -1) ?decodeURI(location.href)+"&tags="+$("#new_tag").val():decodeURI(location.href).replace("tags=","tags="+$("#new_tag").val()+",");						
						$(".umt_left ul").append('<li color="'+i+'" style="border-color:'+color+'" href="'+url+'">'+$("#new_tag").val()+'</li>');
												$("#new_tag").val("");

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
function addtag2content(){
	$(".umt_main .umt_list .umt_list_item").live("mouseout",function(){
		var selContent = $(".umt_main .umt_list .umt_list_item .manage_btn:checked").val();
		if(selContent){
			$("#tag_sel ul").html("");
			$(".umt_left ul li").each(function(index, element) {
				$("#tag_sel ul").append("<li style='border-color:"+creatColor($(this).attr("color"))+"' color='"+$(this).attr("color")+"'>"+$(this).text()+"</li>");
            });
			$("#tag_sel").show();
			$("#tag_sel").css("left",$(".umengADsystem_container").offset("").left+$(".umengADsystem_container").width()+10);
			$("#tag_sel ul li").each(function(index, element) {
                $(this).click(function(e) {
					var checkbox = $(".umt_main .umt_list .umt_list_item .manage_btn:checked");
					var content = new Array();
					var contentstr = "default";
					checkbox.each(function(index, element) {
                        content[index] = $(this).val();
						contentstr = contentstr+","+$(this).val();
                    });
					var tag = $(this);
					$.post(window.ajaxUrl,{ action: "changetag", content: contentstr, tag: tag.text(),method: "add"},function(data){
						if(data.status == 1){
							for(i in content){
								$("#content_"+content[i]+" ul.lable").append("<li style='border-color:"+creatColor(tag.attr("color"))+"' color='"+tag.attr("color")+"'>"+tag.text()+"</li>");
							}
						}
						$("#tag_sel").hide();
						$(".umt_main .umt_list .umt_list_item .manage_btn:checked").each(function(index, element) {
                            $(this).removeAttr("checked").hide();
                        });
						
					},"jsonp");
                    
                });
            });
		}else{
			$("#tag_sel").hide();
		}
		if($(this).children(".manage_btn").attr("checked") == "checked"){
		}else{
			$(this).children(".manage_btn").hide();
		}
	});
	
}
