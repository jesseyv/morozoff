# -*- coding: utf-8 -*-

from django.db import models


class Banner(models.Model):
    title = models.CharField(max_length=100, verbose_name=u'Название баннера')
    slug = models.SlugField(verbose_name=u'Метка')
    body = models.TextField(verbose_name=u'html')

    class Meta:
        verbose_name = u'Баннер'
        verbose_name_plural = u'Баннеры'

    def __unicode__(self):
        return u'{0}'.format(self.title)