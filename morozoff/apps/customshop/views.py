# -*- coding: utf-8 -*-
from django.core.urlresolvers import reverse
from django.http import HttpResponseRedirect
from django.views.generic import DeleteView, DetailView
from shop.models.defaults.cartitem import CartItem
from shop.util.address import assign_address_to_request
from shop.views.checkout import CheckoutSelectionView
from shop_categories.models import Category

from forms import OrderExtraInfoForm
from signals import payment_instructions_email_notification


class MyCheckoutSelectionView(CheckoutSelectionView):

    def post(self, *args, **kwargs):
        """ Called when view is POSTed """
        shipping_form = self.get_shipping_address_form()

        if shipping_form.is_valid():

            # Add the address to the order
            shipping_address = shipping_form.save()
            order = self.create_order_object_from_cart()

            self.save_addresses_to_order(order, shipping_address,
                                         shipping_address)

            assign_address_to_request(self.request, shipping_address)
            assign_address_to_request(self.request, shipping_address,
                                      shipping=False)

            billingshipping_form = (
                self.get_billing_and_shipping_selection_form())
            if billingshipping_form.is_valid():
                self.request.session['payment_backend'] = (
                    billingshipping_form.cleaned_data['payment_method'])
                self.request.session['shipping_backend'] = (
                    billingshipping_form.cleaned_data['shipping_method'])
                orderextrainfo_form = OrderExtraInfoForm(self.request.POST)
                if orderextrainfo_form.is_valid():
                    orderextrainfo = orderextrainfo_form.save(commit=False)
                    orderextrainfo.order = order
                    orderextrainfo.save()
                payment_instructions_email_notification(
                    order=order,
                    address=shipping_address,
                    request=self.request
                )
                return HttpResponseRedirect(reverse('checkout_shipping'))

        return self.get(self, *args, **kwargs)

    def get_context_data(self, **kwargs):
        ctx = super(MyCheckoutSelectionView, self).get_context_data(**kwargs)
        orderextrainfo_form = OrderExtraInfoForm()
        ctx.update({'orderextrainfo_form': orderextrainfo_form})
        return ctx


class CartItemDeleteView(DeleteView):
    model = CartItem

    success_url = '/cart/'
