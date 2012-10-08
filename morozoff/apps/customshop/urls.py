#-*- coding: utf-8 -*-
from django.conf.urls.defaults import patterns, include, url
from django.views.generic import ListView, TemplateView
from shop.views.cart import CartDetails, CartItemDetail
from shop.views.checkout import (ThankYouView, ShippingBackendRedirectView,
    PaymentBackendRedirectView)
from shop.views.order import OrderListView, OrderDetailView
from shop.views.product import ProductDetailView
#from shop_simplecategories.views import CategoryDetailView

from morozoff.apps.customshop.models import CustomProduct
from morozoff.apps.customshop.views import (MyCheckoutSelectionView,
    CartItemDeleteView)


urlpatterns = patterns('',
    # Products
#    url(r'^$',
#        ListView.as_view(
#            model=CustomProduct,
#            template_name="new/customshop/customproduct_list.html"
#        ),
#        name='product_list'
#    ),
    url(r'^$',
        TemplateView.as_view(
            template_name="new/index.html"
        ),
        name='index'
    ),

    url(r'^catalog/$',
        ListView.as_view(
            model=CustomProduct,
            template_name="new/customshop/customproduct_list.html",
            paginate_by=12
        ),
        name='product_list'
    ),

    url(r'^product/(?P<slug>[0-9A-Za-z-_.//]+)$',
        ProductDetailView.as_view(
            template_name="new/customshop/product_detail.html"
        ),
        name='product_detail'
    ),
    (r'^pay/', include('shop.payment.urls')),
    (r'^ship/', include('shop.shipping.urls')),

    # Cart
    url(r'^cart/delete/$', CartDetails.as_view(action='delete'), # DELETE
        name='cart_delete'),

    url(r'^cart/delete/(?P<pk>\d+)/$',
        CartItemDeleteView.as_view(),
        name='cart_delete_single'
    ),

    url('^cart/item/$', CartDetails.as_view(action='post'), # POST
        name='cart_item_add' ),
    url(r'^cart/$', CartDetails.as_view(
        template_name="new/customshop/cart.html"
    ), name='cart'), # GET
    url(r'^cart/update/$', CartDetails.as_view(
        action='put',
        template_name="new/customshop/cart.html"
        ),
        name='cart_update'),

    # CartItems
    url('^cart/item/(?P<id>[0-9A-Za-z-_.//]+)$', CartItemDetail.as_view(),
        name='cart_item' ),

    # Checkout
    url(r'^checkout/$', MyCheckoutSelectionView.as_view(
            template_name="new/customshop/selection.html"
        ),
        name='checkout_selection' # First step of the checkout process
        ),
    url(r'^checkout/ship/$', ShippingBackendRedirectView.as_view(),
        name='checkout_shipping' # First step of the checkout process
        ),
    url(r'^checkout/pay/$', PaymentBackendRedirectView.as_view(),
        name='checkout_payment' # First step of the checkout process
        ),
    url(r'^checkout/thank_you/$', ThankYouView.as_view(
            template_name="new/customshop/thank_you.html"
        ),
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
