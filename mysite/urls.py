from django.conf.urls import patterns, include, url
from mysite.views import dispatch,users,logout
import settings

urlpatterns = patterns('',
	('^$', dispatch),
	
	('^index/', dispatch),
	('^apps/', dispatch),
	('^channels/', dispatch),
	('^feedback/', dispatch),
	('^channel_detail/', dispatch),
	('^not_invited/', dispatch),
	('^register/', dispatch),
	('^prompt/', dispatch),
	('^admin/', dispatch),
	('^login/', dispatch),
	('^logout/', logout),
	('^users/', users),
	(r'^ios_channels/',dispatch),
	
	(r'^javascripts/(?P<path>.*)$','django.views.static.serve',{'document_root': settings.TEMPLATE_DIRS[0]+'/javascripts'}),
	(r'^stylesheets/(?P<path>.*)$','django.views.static.serve',{'document_root': settings.TEMPLATE_DIRS[0]+'/stylesheets'}),
	(r'^images/(?P<path>.*)$','django.views.static.serve',{'document_root': settings.TEMPLATE_DIRS[0]+'/images'}),
	
    
	# Examples:
    # url(r'^$', 'mysite.views.home', name='home'),
    # url(r'^mysite/', include('mysite.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
