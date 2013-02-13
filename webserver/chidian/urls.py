from django.conf.urls import patterns, include, url
from chidian.views import *

urlpatterns = patterns('',
    ('^$', album),
    ('^(P<albumm_id>.{0,})/$', album),
    ('^test/$', album),
)
