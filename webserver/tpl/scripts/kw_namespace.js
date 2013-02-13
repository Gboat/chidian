/**
* @file config
* @encode utf-8
* @author brian
* @version 1.0.0
* @date 2012-03-09
*/

var KW_API_External = {
		"getVersion": ["GetSoftWareVersion", "3.0", true],
		"getHardwareID": ["GetHardwareID", "3.0", true],
		"getGameInfo": ["GetGameInfo", "3.0", true],
		"getUserInfo": ["GetUserInfo", "3.0", true],
		"getChannel": ["GetChannel", "3.0", true],
		"getFileSize": ["GetFileSize", "3.0", true],
		"getGameStatus": ["GetGameStatus", "3.0", true],
		"getFavPic": ["GetFavPic","3.0", true],
		
		"openLoginWindow": ["OpenLoginWindow", "3.0", false],
		"openWindow": ["OpenWindow", "3.0", false],
		"openTab": ["OpenTab", "3.0", false],
		"OpenTab": ["OpenTab", "3.0", false],
		"openHideTable": ["OpenHideTable", "3.0", false],
		"openWebGame": ["OpenWebGame", "3.0", false],
		"openDialog": ["OpenDialog", "3.0", false],
		"openClassifyGame": ["OpenClassifyGame", "3.0", false],
		"openUrlTips": ["OpenUrlTips", "3.0", false],
		"openUrlByIE": ["OpenUrlByIE", "3.0", false],
		"openFlashGame": ["OpenFlashGame", "3.0", false],
		"openExeGame": ["OpenExeGame", "3.0", false],		
		
		"reNavigate": ["ReNavigate", "3.0", false],
		"reNavigatePage": ["ReNavigatePage", "3.0", false],	
		"closeTab": ["CloseTab", "3.0", false],		
		"queryTaskProgress": ["QueryTaskProgress", "3.0", false],
		"openUrlByDefaultBorwser": ["OpenUrlByDefaultBorwser", "3.0", false],
		"recordClassfyGameURL": ["RecordClassfyGameURL", "3.0", false],
		"searchKeyword": ["SearchKeyword", "3.0", false],
		
		"setPopSize": ["SetPopSize", "3.0", false],
		"closeWindow": ["CloseWindow", "3.0", false],
		"collectFlashGame": ["CollectFlashGame", "3.0", false],
		"showBHOCheck": ["ShowBHOCheck", "3.0", true],
		"uploadTwitterImage": ["UploadTwitterImage", "3.0", false],
		"openTwitter": ["OpenTwitter", "3.0", false],
		"startWebGame": ["StartWebGame", "3.0", false],
		"setWebgameTabUserInfo": ["SetWebgameTabUserInfo", "3.0", false],	
		"checkEquipment": ["CheckEquipment", "3.0", true],
		"signUrl": ["SignUrl", "3.0", false],
		"collectOneGame": ["CollectOneGame", "3.0", true],

        "setGameLowEquipment": ["SetGameLowEquipment", "3.01", false], //设置游戏最低配置信息
        "setGameHighEquipment": ["SetGameHighEquipment", "3.01", false], //设置游戏最高配置信息
        "checkEquipment": ["CheckEquipment", "3.0", true], //检测游戏是否达标
        "openGameEquipment": ["OpenGameEquipment", "3.01", false], //显示游戏配置信息检测结果
        "checkEquipmet": ["CheckEquipmet", "3.0", true], //检测游戏是否达标
        
        "updateUserInfo": ["UpdateUserInfo", "3.0", false],
        "searchGuide": ["SearchGuide", "3.0", false],
        "searchWen": ["SearchWen", "3.0", false],
        "subscribeMsg": ["SubscribeMsg", "3.0", false],

        "getSkinName": ["GetSkinName", "3.0", true],
        "skinStart": ["SkinStart", "3.0", false],
        "skinQueryProgress": ["SkinQueryProgress", "3.0",true],
        "skinChange": ["SkinChange", "3.0", false],
        "skinPause": ["SkinPause", "3.0", false],

        "bHOWGGetPopCount": ["BHOWGGetPopCount", "3.0", true],
        "bHOWGAddPopCount": ["BHOWGAddPopCount", "3.0", false],
        "bHOWGClearInvalidPopCount": ["BHOWGClearInvalidPopCount", "3.0", false]
};
var KW_Config = {};

KW_Config.namespace = function(str) { //JS命名空间核心层
	var arr = str.split(".");
	var o = KW_Config;
	for(i = (arr[0] == "KW_Config") ? 1 :0; i< arr.length; i++) {
		o[arr[i]] = o[arr[i]] || {};
		o = o[arr[i]];
	}
};
KW_Config.namespace("CALL_API");
KW_Config.namespace("getExternalAPI");
KW_Config.namespace("Ajax");
KW_Config.namespace("__externalCall");
KW_Config.namespace("__getCrossDomainData");
KW_Config.namespace("Cookie");
KW_Config.namespace("download");
KW_Config.namespace("queryString");
KW_Config.namespace("_CALL_JS");
KW_Config.namespace("registerJS");
KW_Config.namespace("insertScript");
KW_Config.namespace("autoReloadScript");
KW_Config.namespace("check_authenticated");
KW_Config.namespace("getAssess");

KW_Config.check_authenticated = function() { //检测用户登录状态
    var user_id = CALL_API('getUserInfo', 'userid');
    if (parseInt(user_id) < 5000000000){
        return true;
    }else{
        return false;
    }
};

KW_Config.queryString = function(parameter){ //获得网页地址栏中参数
	var sValue=location.search.match(new RegExp("[\?\&]"+parameter+"=([^\&]*)(\&?)","i"));
	return sValue?sValue[1]:sValue;
};

KW_Config.download = function(gamename, gameid, game_type) { //浏览器中启动游戏
	var kuaiwan;
    var fromString = queryString("from") == null || queryString("from") == "" ? "no_from_by_web" : queryString("from") ;
    var game_type = game_type == "webgame" ? "webgame" : '' ;
    var plugin = "<object "+
        "<embed id=\"KWCheck\" name=\"KWCheck\""+
        "Query='<invoke name=\"startgame\" gamename=\""+gamename+"\" gameid=\""+gameid+"\"  from=\""+fromString+"\" gametype=\""+game_type+"\"></invoke>'"+
        "type=\"application/kwcheck-plugin\" width=\"0\" height=\"0\">"+
        "</embed>"+
        "</object>";
    var postiframe=null;
    postiframe=document.createElement("iframe");
    postiframe.style.dispaly="none";
    try{
        if($.browser.msie) {
            kuaiwan = new ActiveXObject("KWCheck.KuaiWan");
            var xmlkuaiwan = "<invoke name=\"startgame\" gametype=\""+game_type+"\" gamename=\"" + gamename + "\" gameid=\"" + gameid + "\" from=\""+fromString+"\"></invoke>";
            kuaiwan.Query(xmlkuaiwan);
        } else {
        	$(plugin).appendTo(document.body);
        	try{
        		var a = 1;
        		document.getElementById("KWCheck").Query(a);
        	}catch(e) {
        		CALL_API("alert", "对不起，您的快玩插件已被禁用，请设置浏览器加载项。|IMAGE_ERROR");
        	}
        } try {
        	postiframe.src="http://stats.kuaiwan.com/c/gameweb/game/start/"+gameid+"/?installed=true";
        	document.body.appendChild(postiframe);
        }catch(e){
        	CALL_API("alert", "对不起，您的快玩插件已被禁用，请设置浏览器加载项。|IMAGE_ERROR");
        };
    }catch(e){
    	try{
    		postiframe.src="http://stats.kuaiwan.com/c/gameweb/game/start/"+gameid+"/?installed=false";
    		document.body.appendChild(postiframe);
    	}catch(e){};
    }
    setTimeout(function() {
    	document.body.removeChild(postiframe);
    },1000);

};

KW_Config.Cookie = { //Cookie设置
		cookieExpires: function(){ //设置Cookie失效时间，默认三个月
			var expires = new Date();
			return expires.setTime( expires.getTime() + 3*30*24*60*60*1000);
		},
		setCookie: function(cName, cValue) { //设置Cookie赋值
			var expires = this.cookieExpires();
			document.cookie = cName + '=' + escape(cValue)+';expires='+expires.toGMTString();
		},
		getCookie: function(cName) { //获得指定Cookie Value
			var cookieString = document.cookie;
			var start =cookieString.indexOf(cName+'=');
			if(start == -1) {
				return null;
			}
			
			start += cName.length + 1;
			var end = cookieString.indexOf(';', start);
			
			if(end == -1) { 
				return unescape(cookieString.substring(start));
			}
			
			return unescape(cookieString.substring(start,end));
		},
		removeCookie: function(cName) { //删除指定Cookie
			var expires = new Date();
			expires.setTime(expires.getTime() - 1);
			document.cookie = cookieName + '=fooxxx;expires='+expires.toGMTString();
		}
};

KW_Config.CALL_API = function(funcName, parameters) { //快玩API应用
    try{
        parameters = parameters || "";
        var __fun_check = {
            "openTab":true,
            "OpenTab":true,
            "openHideTable": true,
            "openWebGame": true,
            "openFlashGame": true,
            "openExeGame": true
        };
        if(KW_Config.queryString("kwFrom") != "" && __fun_check[funcName] == true) {
            var _b = '';
            var _c = KW_Config.queryString("kwFrom");
            if(parameters.split('|').length >3 ) {
                _b = parameters.substr(parameters.lastIndexOf("|")+1, parameters.length);
                parameters = parameters.replace(_b, _c);
            }
        }
        funcName = funcName.replace(funcName.charAt(0), funcName.substring(0, 1).toLowerCase());
        var __api = KW_Config.getExternalAPI(funcName);
        if(__api[1] != 0){
            if(getVersion() > __api[1]){
                if(__api[2]) {
                    return KW_Config.__externalCall(__api[0], parameters);
                }else {
                    KW_Config.__externalCall(__api[0], parameters);
                }
            }
        }
    }catch(e){
        return false;
    }

};

KW_Config.getExternalAPI =function(external){ //获取快玩API
	return KW_API_External[external];
};

KW_Config.Ajax = { // ajax postting
   getJSON: function(url, data, cb) {
      KW_Config.__getCrossDomainData(url, data, cb);
   },
   getDynJSON: function(url, data, cb) {
        if (data.online_token == null) {
            data.online_token = CALL_API('getUserInfo', 'token');
        }
      $.getJSON(url, data, cb);
   },
   postFrom: function(url, data, cb) {
      $.post(url, data, cb, "json");	
   },
   uploadFile: function(url, data, cb) {
   },
   get: function(url, data, cb) {
      $.get(url, data, cb, "json");
   }
};


KW_Config.__externalCall = function(funcName, parameters) { //API执行接口
	try{
		return window.external.CALL_API(funcName, parameters);
	}catch(e){
		return false;
	}
};

KW_Config.__getCrossDomainData = function(url, data, cb) { //跨域调用
    if (data.online_token == null) {
        data.online_token = CALL_API('getUserInfo', 'token');
    }
    if(url.indexOf('?') == -1){
        $.getJSON(url+'?callback=?', data, cb);
    } else { 
        $.getJSON(url+'&callback=?', data, cb);
    }

};

KW_Config._CALL_JS = {};

KW_Config.registerJS = function(name, func, formater) { // 注册javascript 方法调用
	KW_Config._CALL_JS[name] = {"func": func, "formater": formater};
};

KW_Config.getAssess = function(link) { //快玩点击统计接口
   this.link = "http://adstatistics.kuaiwan.com/app/advertising/add/?stats_id="+link+"&online_token="+CALL_API("getUserInfo", "token");
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

function CALL_API(funcName, parmeters) { //供外部调用
	return KW_Config.CALL_API(funcName, parmeters);	
};

function checkAPI() { //检测当前脚本是否在快玩内执行
	var api_exist = false;
    if(getVersion()>0){
        api_exist=true;
    }
    return api_exist;
};

function getVersion() { //获取版本号
	var version = KW_Config.__externalCall("GetSoftWareVersion", "");
    version=parseFloat(version).toFixed(3);
    return version;
};

function CALL_JS(funcname, parameters) { //供外部调用
    function formatParameters(parameters, formater) {
        return parameters;
    }
    func = KW_Config._CALL_JS[funcname].func;
    try{
        func(formatParameters(parameters, KW_Config._CALL_JS[funcname].formater));
    }catch(e){};
};
/*
(function(){
   if(checkAPI()) {
      window.alert = function(msg) { //弹出快玩消息框
         CALL_API("openDialog","DLG_OK|"+msg+"|IMAGE_INFO");	
      };
      window.confirm = function(msg) { //弹出快玩选择消息框
	return CALL_API("openDialog", "DLG_YES_NO|"+msg+"|IMAGE_QUESTION");
      };
      window.prompt = function(msg) { //
         return CALL_API("openDialog", "DLG_OK"+msg+"|IMAGE_RIGHT");
      };
   }
})();*/

window.onerror = function(){
	
};

function charLen(str) { //获取字符长度
   var l = 0;
   str = str || '';
   var a = str.split(""); 
   for (var i=0;i<a.length;i++) { 
      if (a[i].charCodeAt(0)<299) { 
         l++; 
      } else { 
         l+=2; 
      } 
   } 
   return l; 
};


function subString(str, len) { //截取指定长度字符并返回
   var l = 0;
   var s = "";
   var a = str.split(""); 
   for (var i=0; i<a.length; i++) { 
      if (a[i].charCodeAt(0)<299) { 
         l++; 
      } else { 
         l+=2; 
      }
      if (l > len) {
         return s;
      }
      s += a[i];
   }
   return s;
};

function showPop(msg, x, y, time) { //提示tip消息
   
   function init() {
      getHtml(); 
   };

   function getHtml (){
      this.__innerHTML = '<div class="Ac_Feed" id="Feed02" style="left:'+x+'px;top:'+y+'px">'+
         '<div class="Ac_Feed_L"></div>'+
         '<div class="Ac_Feed_Con"><em></em>'+msg+'</div>'+
         '<div class="Ac_Feed_R"></div>'+
         '</div>';
      if($("div.Ac_Feed").html() == "" || $("div.Ac_Feed").html() == null) {
         $(this.__innerHTML).prependTo(document.body);
      }else {
         $("div.Ac_Feed").show();
      }
      time = time || 1500;
      setTimeout(close, time);
   };

   function close() {
      $("div.Ac_Feed").remove();
   };

   init();
};


function errorPop(msg, x, y, time) { //提示tip消息
   
   function init() {
      getHtml(); 
   };

   function getHtml (){
      this.__innerHTML = '<div class="Ac_Feed" id="Feed01" style="left:'+x+'px;top:'+y+'px">'+
         '<div class="Ac_Feed_L"></div>'+
         '<div class="Ac_Feed_Con"><em></em>'+msg+'</div>'+
         '<div class="Ac_Feed_R"></div>'+
         '</div>';
      if($("div.Ac_Feed").html() == "" || $("div.Ac_Feed").html() == null) {
         $(this.__innerHTML).prependTo(document.body);
      }else {
         $("div.Ac_Feed").show();
      }
      time = time || 1500;
      setTimeout(close, time);
   };

   function close() {
      $("div.Ac_Feed").remove();
   };

   init();
};


function plusPop(msg, x, y, time) { //提示tip消息
   
   function init() {
      getHtml(); 
   };

   function getHtml (){
      this.__innerHTML = '<div class="Ac_Feed" id="Feed03" style="left:'+x+'px;top:'+y+'px">'+
         '<div class="Ac_Feed_L"></div>'+
         '<div class="Ac_Feed_Con">'+msg+'</div>'+
         '<div class="Ac_Feed_R"></div>'+
         '</div>';
      if($("div.Ac_Feed").html() == "" || $("div.Ac_Feed").html() == null) {
         $(this.__innerHTML).prependTo(document.body);
      }else {
         $("div.Ac_Feed").show();
      }
      time = time || 1500;
      setTimeout(close, time);
   };

   function close() {
      $("div.Ac_Feed").remove();
   };

   init();
};

function checkInstalled(m) { //检测QQ 安装
    switch(m){
        case 'msn':
            try {
                new ActiveXObject("MSNMessenger.P4QuickLaunch");
                return true;
            }catch (e) {
                return false;
            }
        case 'skype':
            try {
                new ActiveXObject("Skype.Detection");
                return true;
            }catch(e){
                return false;
            }
        case 'qq':
            try {
                new ActiveXObject("TimwpDll.TimwpCheck");
                return true;
            }catch (e) {
                return false;
            }
    }
};

function starQQ(qq,em) {
    if(checkInstalled('qq')) {
        this.link = "tencent://message/?uin="+qq+"&Site=kuaiwan.com&Menu=yes";
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

    }else {
          errorPop('对不起，您的电脑尚未安装QQ，请安装QQ聊天软件', $(em).offset().left + 110, $(em).offset().top, 1500);
    }
};


/* 页面参数配置获取 */

function getMediaPrefix() { return $("#MEDIA_PREFIX").val();};
function getDynUri() {return $("#DYN_URI").val();};
function getStcUri() {return $("#STC_URI").val();};
function getTwitterUri() {return $("#TWEET_URI").val();};
