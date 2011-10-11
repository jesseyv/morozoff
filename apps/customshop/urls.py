#-*- coding: utf-8 -*-
from django.conf.urls.defaults import patterns, include, url
from django.views.generic import ListView
from shop.views.cart import CartDetails, CartItemDetail
from shop.views.checkout import ThankYouView, ShippingBackendRedirectView,\
    PaymentBackendRedirectView
from shop.views.order import OrderListView, OrderDetailView
from shop.views.product import ProductDetailView

from apps.customshop.models import CustomProduct
from apps.customshop.views import MyCheckoutSelectionView


urlpatterns = patterns('',
    # Products
    url(r'^$',
        ListView.as_view(model=CustomProduct),
        name='product_list'
        ),
    url(r'^product/(?P<slug>[0-9A-Za-z-_.//]+)$',
        ProductDetailView.as_view(),
        name='product_detail'
        ),
    (r'^pay/', include('shop.payment.urls')),
    (r'^ship/', include('shop.shipping.urls')),

    # Cart
    url(r'^cart/delete/$', CartDetails.as_view(action='delete'), # DELETE
        name='cart_delete'),
    url('^cart/item/$', CartDetails.as_view(action='post'), # POST
        name='cart_item_add' ),
    url(r'^cart/$', CartDetails.as_view(), name='cart'), # GET
    url(r'^cart/update/$', CartDetails.as_view(action='put'),
        name='cart_update'),

    # CartItems
    url('^cart/item/(?P<id>[0-9A-Za-z-_.//]+)$', CartItemDetail.as_view(),
        name='cart_item' ),

    # Checkout
    url(r'^checkout/$', MyCheckoutSelectionView.as_view(),
        name='checkout_selection' # First step of the checkout process
        ),
    url(r'^checkout/ship/$', ShippingBackendRedirectView.as_view(),
        name='checkout_shipping' # First step of the checkout process
        ),
    url(r'^checkout/pay/$', PaymentBackendRedirectView.as_view(),
        name='checkout_payment' # First step of the checkout process
        ),
    url(r'^checkout/thank_you/$', ThankYouView.as_view(),
        name='thank_you_for_your_order' # Second step of the checkout process
        ),
    # Orders
    url(r'^orders/$',
        OrderListView.as_view(),
        name='order_list'),
    url(r'^orders/(?P<pk>\d+)/$',
        OrderDetailView.as_view(),
        name='order_detail'),
)
