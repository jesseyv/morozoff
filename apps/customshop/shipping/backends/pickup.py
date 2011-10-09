# -*- coding: utf-8 -*-
from decimal import Decimal

from django.conf import settings
from django.conf.urls.defaults import patterns, url

from shop.util.decorators import on_method, shop_login_required


class PickupShipping(object):
    """
    This is just an example of a possible flat-rate shipping module, that
    charges a flat rate defined in settings.SHOP_SHIPPING_FLAT_RATE
    """
    url_namespace = 'pickup_process'
    backend_name = u'Самовывоз'
    
    def __init__(self, shop):
        self.shop = shop # This is the shop reference, it allows this backend
        # to interact with it in a tidy way (look ma', no imports!)
        self.rate = getattr(settings, 'SHOP_SHIPPING_FLAT_RATE', '0')

    @on_method(shop_login_required)
    def view_process_order(self, request):
        """
        A simple (not class-based) view to process an order.

        This will be called by the selection view (from the template) to do the
        actual processing of the order (the previous view displayed a summary).

        It calls shop.finished() to go to the next step in the checkout process.
        """
        self.shop.add_shipping_costs(self.shop.get_order(request),
                                     u'Самовывоз',
                                     Decimal(self.rate))
        return self.shop.finished(self.shop.get_order(request))
        # That's an HttpResponseRedirect

    def get_urls(self):
        """
        Return the list of URLs defined here.
        """
        urlpatterns = patterns('',
#            url(r'^$', self.view_display_fees, name='pickup'),
            url(r'^process/$', self.view_process_order, name='pickup_process'),
        )
        return urlpatterns

