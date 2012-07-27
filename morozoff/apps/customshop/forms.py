# -*- coding: utf-8 -*-
from django.forms import ModelForm
from shop.models import OrderExtraInfo


class OrderExtraInfoForm(ModelForm):
    class Meta:
        model = OrderExtraInfo
        fields = ('text',)