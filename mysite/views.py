from django.template.loader import get_template
from django.template import Context
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.http import HttpResponseNotFound

import datetime
import settings
import func	
import hashlib
import json
import types

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
	request.session['userName'] = ''
	request.session['userId'] = ''
	return HttpResponseRedirect('/index')

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
		t = get_template(_str+'.html')
		html = t.render(Context({'userName': usrName,'userId': usrId,'page':_str}))
		return HttpResponse(html)	
