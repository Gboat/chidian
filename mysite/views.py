from django.template.loader import get_template
from django.template import Context
from django.http import HttpResponse
from django.http import HttpResponseRedirect
import datetime
import settings
import func	
import hashlib
import json

def users(request):
	userName = request.POST['userName']
	userPwd = request.POST['userPwd']
	auth = hashlib.md5(userName+userPwd+'KEY')
	auth.digest()
	if userName and userPwd:
		'''url = 'http://127.0.0.1/demo.php'
		data = {'email': userName, 'pwd': userPwd, 'auth':auth.hexdigest()}
		res = json.loads(func.post(url,data))
		if res['result'] == '1':
			request.session['userName'] = userName
			request.session['userId'] = res['user_id']
			#print 'Session:', request.session.items()
		else:
			request.session['userName'] = ''
		return HttpResponse(res['result'])
	else:
		return HttpResponse('-1')'''
		request.session['userName'] = userName
		request.session['userId'] = '4fb22e855270152b4b00003a'
		return HttpResponse('1')

def logout(request):
	request.session['userName'] = ''
	request.session['userId'] = ''
	return HttpResponseRedirect('/')
	
def dispatch(request):
	str = request.path
	str = str.replace('/','')
	usrName = request.session.get('userName', '')
	usrId = request.session.get('userId', None)
	if str in [None, '']:
		str = 'index'
	if str in ['apps','channels','channel_detail'] and usrName in [None, '']:
		return HttpResponseRedirect('/')
	elif str in ['admin'] and usrName != 'chenyukun03@gmail.com':
		return HttpResponseRedirect('http://www.umeng.com/public/404.html')
	elif str in ['index','register','login','not_invited','prompt'] and usrName != '':
		return HttpResponseRedirect('/apps/')
	else:
		t = get_template(str+'.html')
		html = t.render(Context({'userName': usrName,'userId': usrId,'page':str}))
		return HttpResponse(html)	
