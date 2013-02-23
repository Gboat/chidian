#!/usr/bin/env python
# -*- coding: UTF-8 -*-
from django.template.loader import get_template
from django.template import Context
from django.http import HttpResponse, HttpResponseRedirect
from django.http import HttpResponseNotFound

import datetime
import settings
import hashlib
import json
import types
import pymongo
from pymongo.objectid import ObjectId
import random

class mongo():
    db = None
    @classmethod
    def get_db(self):
        if self.db is None:
            self.db = pymongo.Connection("localhost",27017)['chidian']
        return self.db

def index(request):
    """
    default views for site
    """
    data = request.path.split("/")
    print data
    """
    if len(data) is 5:
        categray =int(data[2])
        pagenum =int(data[3][:-5:])
    else :
        categray = 0
        pagenum = 1
    """
    pagenum=random.randint(1,290)
    db = mongo.get_db()
    rs = list(db.pin.find({"height":{"$exists":True},"width":{"$exists":True}},
        {"name":1,"tags":1,"width":1,"height":1,"_id":1},skip=(pagenum*20),limit=20))#.skip(pos).limit(pagesize)
    rs_ok = []
    for item in rs:
        item['height'] = int(196*item['height']/item['width'])
        item['width'] = 196
        item['pinid'] = item['_id']
        rs_ok.append(item)

    t = get_template('index.html')
    html = t.render(Context({"rs":rs_ok}))
    return HttpResponse(html)

def album(request):
    album_id = request.POST.get("album_id")
    print album_id
    pin_id = album_id
    #random = request.POST.get("random")
    db = mongo.get_db()
    rs = db.pin.find_one({"_id":ObjectId(album_id)})
    c = Context({"name":rs['name'],"pin_id":pin_id,"album_id":album_id,
        "height":rs['height'],"tags":rs['tags']})
    height=(750*rs['height']/rs['width'])
    
    data = {}
    data['data'] = {}
    data['data']['qq'] = None
    data['data']['nickname'] = u"\u7cd6\u8001\u864e"
    data['data']['user_id'] = 1244578889
    data['data']['album_type'] = 0
    data['data']['is_already_follow'] = False
    data['data']['unlock_pin_count'] = 256
    data['data']['large_head_url'] = "/images/"
    data['data']['album_width'] = 750
    data['data']['lock_pin_count'] = 16
    data['data']['origin_album_id'] = 1358647116519
    data['data']['album_id'] = 1358647116519
    pin = [{"pin_id": "1358654397556", "large_image_url": "/pic/full/"+rs['name'], "large_image_height": height }]
    data['data']['pin_info_list'] = pin

    data['data']['album_name']=rs['tags']
    data['reason'] = []
    data['ok'] = True

    return HttpResponse(json.dumps(data))

def counter(request):
    return HttpResponse("100000")

def music(request):
    return HttpResponse("111111")

def new(request):
    html = '{"data": {"lock_pin_count": 3946, "unlock_pin_count": 81156}, "reason": "", "ok": true}'
    return HttpResponse(html)

def hot(request):
    t = get_template('index.html')
    html = t.render(Context({}))
    return HttpResponse(html)

def friend(request):
    t = get_template('index.html')
    html = t.render(Context({}))
    return HttpResponse(html)

def login(request):
    username = request.POST.get('username','')
    userpass = request.POST.get('userpass','')
    return HttpResponse('{ok:true}')
    if username and userpass:
        pass
        try:
            t = get_template(_str+'.html')
            html = t.render(Context({'userName': usrName,'userId': usrId,'page':_str}))
            html = '{"data": "", "reason": null, "ok": false}'
            return HttpResponse(html)
        except:
            html = get_template('404.html').render(Context({}))
            return HttpResponseNotFound(html)
        return HttpResponseRedirect('/apps/')
    pass
def login_tip(request):
    t = get_template('index.html')
    html = t.render(Context({}))
    return HttpResponse(html)
def count(request):
    pass

def music(request):
    request.path
    pass
def helpinfo(request):
    _path = request.path
    if _path is '':
        pass
    pass

def user(request):
    request.POST.get('user_id')
    #request.POST.
    t = get_template('index.html')
    html = t.render(Context({}))
    return HttpResponse(html)

def users(request):
    userName = request.POST.get('userName', '')
    userPwd = request.POST.get('userPwd', '')
    auth = hashlib.md5(userName+userPwd+'_umtrack_api_')
    auth.digest()
    if userName and userPwd:
        url = 'http://www.umeng.com/users/login_verify'
        data = {'email': userName, 'pwd': userPwd, 'auth':auth.hexdigest()}
        f = open('testpw', 'a')
        f.write(str(data))
        res = json.loads(func.post(url,data))
        f.write(str(res) + '\n\n')
        f.close()
        if (type(res) is types.DictType) == False:
            res = {'result':'-1'}
        if res.get('result','-1') == '1':
            request.session['userName'] = userName
            request.session['userId'] = res['user_id']
            #print 'Session:', request.session.items()
        else:
            request.session['userName'] = ''
        return HttpResponse(res['result'])
    else:
        return HttpResponse('-1')

def logout(request):
    request.session['user'] = ''
    request.session['id'] = ''
    return HttpResponseRedirect('/index')

def updateurl(request):
    usrName = request.session.get('userName', '')
    usrId = request.session.get('userId', None)
    _url = request.POST.get('url', '')
    _appkey = request.POST.get('appkey', '')
    if usrName in [None, ''] or usrId in [None, '']:
        return HttpResponse('-1') #no login
    elif _url in [None, ''] or _appkey in [None, '']:
        return HttpResponse('-2') #params is not integral
    else:
        url = 'http://log.umtrack.com/app/update/'+_appkey+'/?url='+_url+'&userid='+usrId
        res = json.loads(func.post(url,''))
        if (type(res) is types.DictType) == False:
            resStatus = '-3' #res is not a Dict
            resAppkey = ''
        else:
            resStatus = res.get('status','-4') # res is undefined
            resAppkey = res.get('appkey','')
        if resAppkey != _appkey:
            resStatus = '-5' # appkey is not true
        return HttpResponse(resStatus)

def dispatch(request):
    adminAccount = 'chenyukun03@gmail.com'
    _str = request.path
    _str = _str.replace('ios_channels/','')
    _str = _str.replace('/','')
    usrName = request.session.get('userName', '')
    usrId = request.session.get('userId', None)
    if _str in [None, '']:
        _str = 'index'
    if usrName in [None, '']:
        usrInfo = {'status':''}
    else:
        usrInfoJson = json.loads(func.post('http://log.umtrack.com/users/get/'+usrName+'/',''))
        #usrInfo = json.loads(func.post('http://127.0.0.1/user.php?id='+usrId,''))
        if usrInfoJson.get('status') not in ['',{},None]:
    #if _str in ['apps','channels','channel_detail'] and usrInfo.get('status', 'ok') not in ['ok', '', {}] and usrName != adminAccount:
        #return HttpResponseRedirect('/not_invited/')
            usrInfo  = usrInfoJson['status']
        else:
            usrInfo = {'status': ''}

    f = open('testpw', 'a')
    f.write(str(usrInfo) + '\n')
    f.close()

    if (type(usrInfo) is types.DictType) == False:
        usrInfo = {"status": ''}
    else:
        usrInfo['status'] = usrInfo.get('status','')

    if _str in ['apps','channels','channel_detail'] and usrInfo['status'] != 'ok' and usrName != adminAccount:
        return HttpResponseRedirect('/not_invited/')
    elif usrInfo['status'] == 'ok' and _str in ['not_invited','register']:
        return HttpResponseRedirect('/apps/')
    elif _str in ['apps','channels','channel_detail'] and usrName in [None, '']:
        return HttpResponseRedirect('/')
    elif _str in ['admin'] and usrName != adminAccount:
        html = get_template('404.html').render(Context({}))
        return HttpResponseNotFound(html)
        #return HttpResponseRedirect('http://www.umeng.com/public/404.html')
    elif _str in ['index','login','prompt'] and usrName != '':
        return HttpResponseRedirect('/apps/')
    else:
        if usrInfo.get('status', '') == 'rejected' and usrName != adminAccount:
            _str = 'rejected';
        elif usrInfo.get('status', '') == 'pending' and usrName != adminAccount:
            _str = 'pending';
        try:
            t = get_template(_str+'.html')
            html = t.render(Context({'userName': usrName,'userId': usrId,'page':_str}))
            return HttpResponse(html)
        except:
            html = get_template('404.html').render(Context({}))
            return HttpResponseNotFound(html)
