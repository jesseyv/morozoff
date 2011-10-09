# -*- coding: utf-8 -*-

from django.db import models

from apps.common.models import ObjectMixin


class Article(ObjectMixin):
    title = models.CharField(max_length=100, verbose_name=u'Название статьи')
    slug = models.SlugField(verbose_name=u'Метка (используется в ссылке)')
    short_text = models.TextField(verbose_name=u'Краткое описание')

    class Meta:
        verbose_name = u'Статья'
        verbose_name_plural = u'Статьи'

    def __unicode__(self):
        return u'{0}'.format(self.title)