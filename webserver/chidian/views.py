from django.template.loader import get_template
from django.template import Context
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.http import HttpResponseNotFound

from chidian.models import chidian
import datetime
import json

def album_info(request):
    parh = request.path
    album_id = request.POST.get("album_id")
    random = request.POST.get("random")
    album(album_id="11",album_name="test",album_width=750)
    html = get_template('album.html').render(Context({}))
    return HttpResponse(html)

def album(request,album_id):
    parh = request.path
    album_id = request.POST.get("album_id")
    random = request.POST.get("random")
    album(album_id="11",album_name="test",album_width=750)
    html = get_template('album.html').render(Context({}))
    return HttpResponse(html)

def counter(request):
    return HttpResponse("100000")

def new(request):
    html = '{"data": {"lock_pin_count": 3946, "unlock_pin_count": 81156}, "reason": "", "ok": true}'
    return HttpResponse(html)

def hot(request):
    t = get_template('index.html')
    html = t.render(Context({}))
    return HttpResponse(html)
