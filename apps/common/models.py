# -*- coding: utf-8 -*-
from django.db import models


class ObjectMixin(models.Model):
    """Class about site object for describe base site page params"""
    meta_description = models.CharField(max_length=150, null=True, blank=True,
                    verbose_name=u'Meta-description (не более 150 сиволов)')
    meta_keywords = models.CharField(max_length=150, null=True, blank=True,
                     verbose_name=u'Meta-keywords (не более 150 сиволов)')
    description = models.TextField(verbose_name=u'Описание', null=True,
                                   blank=True)

    class Meta:
        abstract = True

    def __unicode__(self):
        return u'{0}'.format(self.name)


def upload_to(instance, file_name):
    return '{0}s/{1}'.format(instance.__class__.__name__.lower(), file_name)
