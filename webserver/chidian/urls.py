from django.conf.urls import patterns, include, url
from views import *

urlpatterns = patterns('',
    ('^$', album),
    ('^(P<albumm_id>.{0,})/$', album),
    ('^test/$', album),
)
