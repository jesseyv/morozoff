# -*- coding: utf-8 -*-
from django.conf import settings
from django.db import models
from django.utils.translation import ugettext_lazy as _
from shop.models.productmodel import Product

from apps.common.models import ObjectMixin, upload_to


class BaseProduct(Product, ObjectMixin):
    class Meta:
        abstract = True

    def images_ordered(self):
        return self.images.order_by('-id')

    def logo(self):
        try:
            return self.images.order_by('-id')[0]
        except :
            return None


class BaseProductParameter(ObjectMixin):
    name = models.CharField(max_length=256)
    slug = models.SlugField(verbose_name=_('Slug'), unique=True)
    order = models.PositiveSmallIntegerField(verbose_name=u'Приоритет')
    logo = models.ImageField(upload_to=upload_to, verbose_name=u'Изображение')

    class Meta:
        ordering = ['order',]
        abstract = True


class BaseProductImage(models.Model):
    alt = models.CharField(max_length=200,
        verbose_name=u'Описание изображения',
        help_text=u'не больше 200 символов и желательно не больше 16 слов')
    src = models.ImageField(upload_to=upload_to, verbose_name=u'Изборажение')

    class Meta:
        abstract = True

    def __unicode__(self):
        return u'{alt}"'.format(alt=self.alt)

    def url(self):
        return '{MEDIA_URL}{src}'.format(
            MEDIA_URL=settings.MEDIA_URL, src=self.src)
