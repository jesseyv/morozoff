from django.contrib import admin
from django.contrib.flatpages.models import FlatPage
from django.contrib.flatpages.admin import FlatPageAdmin as FlatPageAdminOld


class FlatPageAdmin(FlatPageAdminOld):
    class Media:
        js = ('tiny_mce/tiny_mce.js',
              'filebrowser/js/TinyMCEAdmin.js',)

# We have to unregister it, and then reregister
admin.site.unregister(FlatPage)
admin.site.register(FlatPage, FlatPageAdmin)