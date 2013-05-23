from django.conf.urls import patterns, include, url
from mysite.views import *
#from album.views import album_info as alll
import settings

urlpatterns = patterns('',
    ('^$', index),
    ('^all/', index),
    ('^hot/',hot),
    #('^album/',include('album.urls')),
    ('^album/',album),
    ('^user/',user),
    ('^counter/',counter),
    ('^new/',new),
    ('^music/',music),
    ('^friend/',friend),
    ('^helpinfo',helpinfo),
    ('^login/', login),
    ('^login/tip/',login_tip),
    ('^new/pin/count/(?P<path>.*)$',count),

    (r'^images/(?P<path>.*)$','django.views.static.serve',{'document_root': settings.TEMPLATE_DIRS[0]+'/images'}),
    (r'^img/(?P<path>.*)$','django.views.static.serve',{'document_root': settings.TEMPLATE_DIRS[0]+'/img'}),
    (r'^pic/(?P<path>.*)$','django.views.static.serve',{'document_root': settings.PROJECT_DIR+'/data/pic'}),
    (r'^ms/(?P<path>.*)$','django.views.static.serve',{'document_root': settings.TEMPLATE_DIRS[0]+'/ms'}),
    (r'^css/(?P<path>.*)$','django.views.static.serve',{'document_root': settings.TEMPLATE_DIRS[0]+'/css'}),
    (r'^js/(?P<path>.*)$','django.views.static.serve',{'document_root': settings.TEMPLATE_DIRS[0]+'/js'}),
    # Examples:
    # url(r'^$', 'mysite.views.home', name='home'),
    # url(r'^mysite/', include('mysite.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
