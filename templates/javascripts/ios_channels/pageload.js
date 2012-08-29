window.ajaxBaseUrl = 'http://log.umtrack.com';//'http://10.18.101.5:8000'//'http://10.18.101.222:8080';//
window.appkey = location.search.split('=')[1] || '';
window.appkey = window.appkey.split('&')[0] || '';
$(function(){
	var pageLoad = function(){
		var t = this;
		this.public = {
			userid :$('#userid').attr('userid')||'',
			list : []
		}
	}
	pageLoad.prototype={
		loadStart : function(){
			//console.log('loadstart');
		},
		loadEnd : function(){
			//console.log('loadend');
		},
		makeAjax : function(options,callback){
			options = options || {
				type : 'get',
				url : '',
				params :'',
				contenetType :'application/x-www-form-urlencoded',
				dataType: 'jsonp'
			};
			callback = callback || function(){};
			$.ajax({
				url : options.url,
				type : options.type,
				data : options.params,
				dataType : options.dataType,
				contentType : 'application/x-www-form-urlencoded',
				success : function(data){
					callback(options.operationDom,data);
				}
			});
		},
		makeAppList : function(o,data){
			load.loadEnd();
			for(i in data.apps){
				load.public.list.push(data.apps[i].appname);
				o.find('tbody').append('<tr id="'+data.apps[i].appkey+'"><td class="umengADsystem_align_left"><a href="/channels?app_key='+data.apps[i].appkey+'" class="copy_link">'+data.apps[i].appname+'</a></td><td><div style="width:810px; overflow:hidden; word-warp:break-all;">'+data.apps[i].url+'</div></td><td class="del_btn"><a onclick="delApp(\''+data.apps[i].appkey+'\',\''+data.apps[i].appname+'\')" class="ui-icon ui-icon-circle-close"></a></td></tr>');
			o.find('tbody tr:even').addClass('transbg');
			}		
		},
		makeChannelList : function(o,data){
			load.loadEnd();
			$('.umengADsystem_panel_info table th.title').html('应用：'+data.appname);
			$('.umengADsystem_panel_info table td.title').html(data.url);
			load.public.appname = data.appname;
			load.public.url = data.url;
			var click;
			var active;
			var rate;
			var moibleClick;
			var allClick;
			for(i in data.channels){
				load.public.list.push(data.channels[i].source);
				click = typeof(data.channels[i].click)=='undefined' ? '0' : data.channels[i].click;
				active = typeof(data.channels[i].install)=='undefined' ? '0' : data.channels[i].install;
				rate = typeof(data.channels[i].rate)=='undefined' ? '0' : data.channels[i].rate;
				pcClick = typeof(data.channels[i].click_pc)=='undefined' ? '0' : data.channels[i].click_pc;
				moibleClick = click-pcClick;
				o.find('tbody').append('<tr id="'+data.channels[i].channelkey+'"><td class="umengADsystem_align_left"><a href="/channel_detail?cid='+data.channels[i].channelkey+'&appid='+data.channels[i].appkey+'">'+data.channels[i].source+'</a></td><td>'+pcClick+'</td><td>'+moibleClick+'</td><td>'+click+'</td><td>'+active+'</td><td>'+rate+'%</td><td><div class="ui-button"><input class="urlinput" type="text" value="'+data.channels[i].encodeurl+'" /></div></td><td width="75"><span style="position:relative; display:block;"><a class="copyText" href="javascript:void(0);">复制URL</a><p class="textToCopy" style="display:none">'+data.channels[i].encodeurl+'</p></span></td><td class="del_btn"><a onclick="delChannel(\''+data.channels[i].appkey+'\',\''+data.channels[i].channelkey+'\',\''+data.channels[i].source+'\')" class="ui-icon ui-icon-circle-close"></a></td></tr>');
				o.find('tbody tr:even').addClass('transbg');
			}
			//$("#chartRate").renderChart(
			var d = new Array();
			var tmp = new Array();
			for(key in data.ratecnt.xAis){
				tmp[data.ratecnt.xAis[key]] = key;
				d.push(data.ratecnt.xAis[key]);
			}
			d.sort();
			for(i in d){
				d[i] = tmp[d[i]];
			}
			var tmp = [];
			for(i in data.ratecnt.xAis){
				tmp[i] = data.ratecnt.xAis[d[i]];
			}
			data.ratecnt.xAis = tmp;
			
			for(j in data.ratecnt.series){
				var tmp = [];
				for(i in data.ratecnt.series[j].data){
					tmp[i] = data.ratecnt.series[j].data[d[i]];
				}
				data.ratecnt.series[j].data = tmp;
			}
			chart = new Highcharts.Chart(
                {
                    chart: {
                        renderTo: "chartRate",
						type:"spline"
                    },
                    title:"",
                    xAxis: {
                        categories: data.ratecnt.xAis,
                        labels:{
                            align:"right",
                            step: parseInt(data.ratecnt.xAis.length / 7)
                        }
                    },
					credits: {
						"enabled":false
					},
					yAxis: {
						title:"",
						min:0,
						labels: {
								formatter: function() {
									return this.value +'%';
								}
            			},
					},
                    series: data.ratecnt.series,
					tooltip: {
						enabled: true,
						formatter: function() {
							return ''+
							this.x + '日'+ this.series.name + ' : '+ this.y;
						}
					},
					legend: {
						margin: 25,
						enabled: true
					},
					subtitle: {}					
                });

			$("#theCode").html($("#theCode").prev("a").prev(".dp-c").text());
			$("#theCode2").html($("#theCode2").prev("a").prev(".dp-c").text());
			var fls=flashChecker();
			$(".copyText").each(function(index, element) {
				$(element).hover(function(){
					$(element).css("background","#069");
					$(element).css("color","#CCC");
					},
					function(){
					$(element).css("background","#CCC");
					$(element).css("color","#069");
					})
				if(fls.f){
					$(element).zclip({        
						path:'/javascripts/ios_channels/ZeroClipboard.swf',        
						copy:$(element).next("p").text(),
						beforeCopy:function(){  
						},        
						afterCopy:function(){
							$.blockUI({ 
								message:  '内容已复制到剪贴板', 
								css: { 
									width:'300',
									top: '30%',
									border:'5px solid #069',
									padding:'10px',
									cursor:'pointer',
									textAlign:'center',
									borderRadius:'5px',
									fontSize:'14px',
									boxShadow:'2px 2px 5px #000'
								},
								overlayCSS:{
									backgroundColor: 'none',
									cursor:'normal'
								}
							});
							setTimeout($.unblockUI, 1000);  
						}    
					});
				}
				if(!fls.f){
					$(element).click(function(){
						$(".umengADsystem_panel_clip .main2").text($(element).next("p").text());
						$.blockUI({ 
							message:  $('.umengADsystem_panel_clip'), 
							css: { 
								width:'450',
								top: '30%',
								border:'none',
								padding:'0',
								cursor:'default',
								textAlign:'left',
								borderRadius:'5px',
								boxShadow:'2px 2px 5px #000'
							},
							overlayCSS:{
								backgroundColor: '#666',
								cursor:'normal'
							}
						});
					 	$(".umengADsystem_panel_clip .main2").select();				
					});
				}
			});
		},
		makeChannelDetail : function(o,data){
			load.loadEnd();
			$('.app th').html('应用：'+data.app.appname);
			$('.app td').html(data.app.url);
			$('.channel .main th').html('渠道：'+data.detail.source);
			$('.channel .main td').html(data.detail.encodeurl);
			$('.umengADsystem_title_primary a')[0].href = '/channels?app_key='+data.app.appkey;
			var d = [];
			for(key in data.detail.clickcnt){
				d.push(key);
			}
			d.sort();
			var click;
			var install;
			var rate;
			var moibleClick;
			var allClick;
			var chartData = new Array();
			chartData.series = new Array();
			chartData.xAix = new Array();
			chartData.series[0] = new Array();
			chartData.series[1] = new Array();
			chartData.series[2] = new Array();
			chartData.series[3] = new Array();
			chartData.series[4] = new Array();
			chartData.series[1].name = "点击(非iOS设备)";
			chartData.series[2].name = "点击(iOS设备)";
			chartData.series[0].name = "点击（总数）";
			chartData.series[3].name = "激活";
			chartData.series[4].name = "转化";
			chartData.series[0].data = new Array();
			chartData.series[1].data = new Array();
			chartData.series[2].data = new Array();
			chartData.series[3].data = new Array();
			chartData.series[4].data = new Array();
			for(i in d){
				click = typeof(data.detail.clickcnt[d[i]])=='undefined' ? '0' : data.detail.clickcnt[d[i]];
				install = typeof(data.detail.installcnt[d[i]])=='undefined' ? '0' : data.detail.installcnt[d[i]];
				rate = typeof(data.detail.mobile_ratecnt[d[i]])=='undefined' ? '0' : data.detail.mobile_ratecnt[d[i]];
				pcClick = typeof(data.detail.clickcnt_pc[d[i]])=='undefined' ? '0' : data.detail.clickcnt_pc[d[i]];
				moibleClick = click-pcClick;
				chartData.xAix[i] = d[i];
				chartData.series[1].data[i] = pcClick;
				chartData.series[2].data[i] = moibleClick;
				chartData.series[0].data[i] = click;
				chartData.series[3].data[i] = install;
				chartData.series[4].data[i] = rate;
				//o.find('tbody').append('<tr><td>'+d[i]+'</td><!--<td>'+pcClick+'</td><td>'+moibleClick+'</td>--><td>'+click+'</td><td>'+install+'</td><td>'+rate+'%</td></tr>');
				o.find('tbody').html('<tr><td>'+d[i]+'</td><td>'+pcClick+'</td><td>'+moibleClick+'</td><td>'+click+'</td><td>'+install+'</td><td>'+rate+'%</td></tr>'+o.find('tbody').html());
			}
			$('#chartClick').renderChart(
                {
                    chart: {
                        renderTo: 'chartClick',
            			//type: 'areaspline'
            			type: 'column'
                    },
                    title:"",
                    xAxis: {
                        categories: chartData.xAix,
                        labels:{
                            //align:"right",
                            step: parseInt(chartData.xAix.length / 7)
                        }
                    },
					tooltip: {formatter: function() {  return this.series.name + this.x +': '+ this.y;} },
					yAxis: {
						lineWidth: 1,
						tickWidth: 1,
					},
					 plotOptions: {
						series: {
							groupPadding: 0.3,
							pointPadding:0.03
						},column: {stacking: 'normal'} 
					},
			        series: chartData.series.slice(1,3)
                });
		
			$('#chartInstall').renderChart(
                {
                    chart: {
                        renderTo: 'chartInstall',
                    },
                    title:"",
                    xAxis: {
                        categories: chartData.xAix,
                        labels:{
                            align:"right",
                            step: parseInt(chartData.xAix.length / 7)
                        }
                    },
                    series: chartData.series.slice(3,4)
                });
			$(".ac1").addClass("hidden");
			o.find('tbody tr:even').addClass('transbg');
		},
		checkform : function(options){
			options= options || {
				appname : "required",
				appurl : "required"
			};
			var validateElem = [];// array for element needs validate
			var names = [];//arrry key
			var status = [];//true or false
			var validated = true;
			var a = true,b = true;
			for(key in options){
				names.push(key);
				validateElem.push(makeupEl(key));
			}
			//validate require
			for(ii in names){
				if(options[names[ii]]=='required' || 'true'){
					a = checkRequre(validateElem[ii]);
					if(names[ii]=='appname'||names[ii]=='channelname'){
						b = checkUnique(validateElem[ii]);
					}
					if(names[ii]=='appurl'){
						b = checkUrl(validateElem[ii]);
					}
					status[ii] =  (a && b);
				}
			}
			showError(status);
			return validated;
			//show error
			function showError(status){
				for(i in status){
					if(!status[i]){
						validateElem[i].parent().parent().next().find('.tips_week_warning').show();
						validated = false;
					}else{
						validateElem[i].parent().parent().next().find('.tips_week_warning').hide();
					}
				}
			};
			function makeupEl(keys){
				var elem = $('input[name='+keys+']');
				if(elem.length>0){
					return elem;
				}
				return null;
			};
			//vadate requred or not
			function checkRequre(el){
				if($(el).val()==''){
					return false;
				}else{
					return true;
				}
			};
			//validate unique
			function checkUnique(el){
				var v = el.val();
				for(i in load.public.list){
					if($.trim(v) == load.public.list[i] || $.trim(v).match(/[`~!@#$%^&*{}\[\];:\'\"\/<>\\]|admin|root/i)){
						return false;
					}
				}
				
				return true;
			};
			function checkUrl(el){
				var pattern = /(^http:\/\/)/;
				return pattern.test($.trim(el.val()));
				
			}
		}
	};
	window.load = new pageLoad();
})
function cutText(text,size){
	return (!text || text=='' ||text == 'NULL')?text:((text.length>size)?text.substr(0,size)+"...":text);
}
function delChannel(appkey,channelkey,name){
		$('.umengADsystem_del .main2 span').text('确定要删除渠道"'+name+'"么？该操作不可恢复！');
        $.blockUI({ 
            message:  $('.umengADsystem_del'), 
            css: { 
				width:'450',
				top: '30%',
				border:'none',
				padding:'0',
				cursor:'default',
				textAlign:'left',
				borderRadius:'5px',
				boxShadow:'2px 2px 5px #000'
			},
			overlayCSS:{
				backgroundColor: '#666',
				cursor:'normal'
			}
        });
		$(".umengADsystem_del .btn_sure").click(function(e) {
			if(appkey&&channelkey){
				$.getJSON(window.ajaxBaseUrl+"/channel/delete/"+appkey+"/"+channelkey+"/?callback=?",
					function(data){
						if(data.status == 0){
							alert_msg("删除失败！");
						}else{
							alert_msg("删除成功！");
							$("#"+channelkey).remove();
							for(i in chart.series){
								if(chart.series[i].name == name){
									chart.series[i].remove();
									break;
								}else{
									continue;
								}
							}
							
						}
				});
			}else{
				alert_msg("参数不全");
			}
        }); 

}
function delApp(appkey,name){
		$('.umengADsystem_del .main2 span').text('确定要删除应用"'+name+'"么？该操作不可恢复！');
        $.blockUI({ 
            message:  $('.umengADsystem_del'), 
            css: { 
				width:'450',
				top: '30%',
				border:'none',
				padding:'0',
				cursor:'default',
				textAlign:'left',
				borderRadius:'5px',
				boxShadow:'2px 2px 5px #000'
			},
			overlayCSS:{
				backgroundColor: '#666',
				cursor:'normal'
			}
        });
		$(".umengADsystem_del .btn_sure").click(function(e) {
			if(appkey){
				$.getJSON(window.ajaxBaseUrl+"/app/delete/"+appkey+"/?callback=?",
					function(data){
						if(data.status == 0){
							alert_msg("删除失败！");
						}else{
							alert_msg("删除成功！");
							$("#"+appkey).remove();
						}
				});
			}else{
				alert_msg("参数不全");
			}
        }); 

}
function alert_msg(msg){
	$.blockUI({ 
		message: msg, 
		css: { 
			width:'300',
			top: '30%',
			border:'5px solid #069',
			padding:'10px',
			cursor:'pointer',
			textAlign:'center',
			borderRadius:'5px',
			fontSize:'14px',
			boxShadow:'2px 2px 5px #000'
		},
		overlayCSS:{
			backgroundColor: 'none',
			cursor:'normal'
		}
	});
	setTimeout($.unblockUI, 1000);  
}
function flashChecker(){
	var hasFlash=0;　　　　//是否安装了flash
	var flashVersion=0;　　//flash版本
	
	if(document.all){
		var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash'); 
		if(swf){
			hasFlash=1;
			VSwf=swf.GetVariable("$version");
			flashVersion=parseInt(VSwf.split(" ")[1].split(",")[0]); 
		}
	}else{
		if(navigator.plugins && navigator.plugins.length > 0){
			var swf=navigator.plugins["Shockwave Flash"];
			if (swf){
				hasFlash=1;
			    var words = swf.description.split(" ");
			    for (var i = 0; i < words.length; ++i){
					 if (isNaN(parseInt(words[i]))) continue;
					 flashVersion = parseInt(words[i]);
				}
			}
		}
	}
	return {f:hasFlash,v:flashVersion};
}
