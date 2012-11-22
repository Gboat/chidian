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

def users(request):
	userName = request.POST.get('userName', '')
	userPwd = request.POST.get('userPwd', '')
	auth = hashlib.md5(userName+userPwd+'_umtrack_api_')
	auth.digest()
	if userName and userPwd:
		url = 'http://www.umeng.com/users/login_verify'
		data = {'email': userName, 'pwd': userPwd, 'auth':auth.hexdigest()}
		res = json.loads(func.post(url,data))
		print 'res', res
		if res['result'] == '1':
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
	return HttpResponseRedirect('/')
	
def dispatch(request):
	adminAccount = 'chenyukun03@gmail.com'
	str = request.path
	str = str.replace('/','')
	usrName = request.session.get('userName', '')
	usrId = request.session.get('userId', None)
	if str in [None, '']:
		str = 'index'
	if usrName in [None, '']:
		usrInfo = {'status':''}
	else:
		usrInfo = json.loads(func.post('http://log.umtrack.com/users/get/'+usrName+'/',''))
		#usrInfo = json.loads(func.post('http://127.0.0.1/user.php?id='+usrId,''))
		usrInfo  = usrInfo['status']
	print 'usrName:', usrName
	print 'adminAccount:', adminAccount
	if str in ['apps','channels','channel_detail'] and usrInfo['status'] != 'ok' and usrName != adminAccount:
		return HttpResponseRedirect('/not_invited/')
	elif usrInfo['status'] == 'ok' and str in ['not_invited','register']:
		return HttpResponseRedirect('/apps/')
	elif str in ['apps','channels','channel_detail'] and usrName in [None, '']:
		return HttpResponseRedirect('/')
	elif str in ['admin'] and usrName != adminAccount:
		html = get_template('404.html').render(Context({}))
		return HttpResponseNotFound(html)
		#return HttpResponseRedirect('http://www.umeng.com/public/404.html')
	elif str in ['index','login','prompt'] and usrName != '':
		return HttpResponseRedirect('/apps/')
	else:
		if usrInfo['status'] == 'rejected' and usrName != adminAccount:
			str = 'rejected';
		elif usrInfo['status'] == 'pending' and usrName != adminAccount:
			str = 'pending';
		t = get_template(str+'.html')
		html = t.render(Context({'userName': usrName,'userId': usrId,'page':str}))
		return HttpResponse(html)	
