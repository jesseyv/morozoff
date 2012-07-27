# -*- coding: utf-8 -*-
"""
Holds all the information relevant to the client (addresses for instance)
"""
from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.utils.translation import ugettext_lazy as _

BASE_ADDRESS_TEMPLATE = u"""
Имя получателя: {name}
Телефон получателя: {phone}
email: {email}
Адрес доставки: {address}
"""

ADDRESS_TEMPLATE = getattr(settings, 'SHOP_ADDRESS_TEMPLATE',
                           BASE_ADDRESS_TEMPLATE)

class Address(models.Model):
    user_shipping = models.OneToOneField(User, related_name='shipping_address',
                                         blank=True, null=True)
    user_billing = models.OneToOneField(User, related_name='billing_address',
                                        blank=True, null=True)

    phone = models.CharField(u'Ваш номер телефон', max_length=30)
    name = models.CharField(u'Ваше имя', max_length=100)
    email = models.EmailField(u'Ваш email', blank=True, null=True)
    address = models.TextField(u'Адрес доставки', max_length=255, blank=True, null=True)

    class Meta(object):
        verbose_name = _('Address')
        verbose_name_plural = _("Addresses")

    def __unicode__(self):
        return u'{0}'.format(self.address)

    def as_text(self):
        return ADDRESS_TEMPLATE.format(
            name = self.name,
            phone = self.phone,
            email = self.email,
            address = self.address
        )
