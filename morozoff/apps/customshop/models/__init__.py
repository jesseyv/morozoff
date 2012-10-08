# -*- coding: utf-8 -*-
from django.db import models
from shop.order_signals import completed

from base import BaseProductImage, BaseProduct
from morozoff.apps.customshop.signals import confirmed_email_notification


class CustomProduct(BaseProduct):
    """Master data: info about product"""
    long_text = models.TextField(u'Описание для страницы товара')

    class Meta:
        abstract = False
        verbose_name = u'Товар'
        verbose_name_plural = u'Товары'

    def __unicode__(self):
        return u'{0}'.format(self.name)


class ProductImage(BaseProductImage):
    product = models.ForeignKey(CustomProduct, related_name='images')


completed.connect(confirmed_email_notification)

