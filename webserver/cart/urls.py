from django.conf.urls import patterns, include, url
from views import *
#from album.views import album_info as alll

urlpatterns = patterns('',
    ('^add','add_to_cart'),
    ('^remove','remove_from_cart'),
    ('^get','get_cart'),
)
