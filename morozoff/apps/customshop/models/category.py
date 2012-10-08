# -*- coding: utf-8 -*-
from django.db import models
from shop_categories.models.defaults.category.base import ProductCategoryBase


class Category(ProductCategoryBase):
    description = models.TextField(u'Описание')
#    image = models.ImageField(upload_to='categoryimages/', null=True, blank=True)

    class Meta:
        abstract = False
        app_label = 'customshop'
        verbose_name = u'Категория товаров'
        verbose_name_plural = u'Категории товаров'
