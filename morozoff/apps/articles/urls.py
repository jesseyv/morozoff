from django.conf.urls.defaults import patterns, url
from django.views.generic import ListView, DetailView

from models import Article

urlpatterns = patterns('',
    # Products
    url(r'^stat.html$',
        ListView.as_view(model=Article),
        name='article_list'
        ),
    url(r'^stat(?P<slug>[0-9A-Za-z-_.//]+).html$',
        DetailView.as_view(model=Article),
        name='article_detail'
        ),
)