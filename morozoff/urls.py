from django.conf import settings
from django.conf.urls.defaults import patterns, url, include
from django.contrib import admin
from filebrowser.sites import site

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/filebrowser/', include(site.urls)),
    (r'^tinymce/', include('tinymce.urls')),
    (r'^grappelli/', include('grappelli.urls')),
    (r'^admin/', include(admin.site.urls)),
    (r'^tinymce/', include('tinymce.urls')),
#    (r'^feedback/', include('feedback.urls')),
#    url(r'^', include('apps.articles.urls')),
#    (r'^cart/', include('shop_simplevariations.urls')),
    url(r'^catalog/', include('shop_categories.urls')),
    (r'^', include('morozoff.apps.customshop.urls')),
)

if settings.DEBUG:
    urlpatterns += patterns('django.contrib.staticfiles.views',
        url(r'^static/(?P<path>.*)$', 'serve'),
    )
    urlpatterns += patterns('django.contrib.staticfiles.views',
        url(r'^media/(?P<path>.*)$', 'serve'),
    )
