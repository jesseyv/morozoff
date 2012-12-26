#-*- coding: utf-8 -*-
from django.conf.urls import patterns, include, url
from django.views.generic import ListView, TemplateView
from shop.views.cart import CartDetails, CartItemDetail
from shop.views.checkout import (ThankYouView, ShippingBackendRedirectView,
    PaymentBackendRedirectView)
from shop.views.order import OrderListView, OrderDetailView
from shop.models import Product
from shop_categories.urls import CategoryProductDetailView

from morozoff.apps.customshop.models import CustomProduct
from morozoff.apps.customshop.views import (MyCheckoutSelectionView,
    CartItemDeleteView, CustomCategoryShopListView)


urlpatterns = patterns('',
    # Products
    url(r'^$',
        TemplateView.as_view(template_name="index.html"),
        name='index'
    ),
    (r'^pay/', include('shop.payment.urls')),
    (r'^ship/', include('shop.shipping.urls')),
    # Cart
    url(r'^cart/delete/$',
        CartDetails.as_view(action='delete'),
        name='cart_delete'
    ),
    url(r'^cart/delete/(?P<pk>\d+)/$',
        CartItemDeleteView.as_view(),
        name='cart_delete_single'
    ),
    url('^cart/item/$',
        CartDetails.as_view(action='post'),
        name='cart_item_add'
    ),
    url(r'^cart/$',
        CartDetails.as_view(),
        name='cart'
    ),
    url(r'^cart/update/$',
        CartDetails.as_view(action='put'),
        name='cart_update'
    ),
    # CartItems
    url('^cart/item/(?P<id>[0-9A-Za-z-_.//]+)$',
        CartItemDetail.as_view(),
        name='cart_item'
    ),
    # Checkout
    url(r'^checkout/$',
        MyCheckoutSelectionView.as_view(),
        name='checkout_selection'  # First step of the checkout process
    ),
    url(r'^checkout/ship/$',
        ShippingBackendRedirectView.as_view(),
        name='checkout_shipping'  # First step of the checkout process
    ),
    url(r'^checkout/pay/$',
        PaymentBackendRedirectView.as_view(),
        name='checkout_payment'  # First step of the checkout process
        ),
    url(r'^checkout/thank_you/$',
        ThankYouView.as_view(),
        name='thank_you_for_your_order'  # Second step of the checkout process
        ),
    # Orders
    url(r'^orders/$',
        OrderListView.as_view(),
        name='order_list'),
    url(r'^orders/(?P<pk>\d+)/$',
        OrderDetailView.as_view(),
        name='order_detail'),
    url(r'^catalog/$',
        ListView.as_view(
            model=CustomProduct,
            paginate_by=12
        ),
        name='product_list'
    ),
    url(r'^catalog/page(?P<page>[0-9]+)/$',
        ListView.as_view(
            model=CustomProduct,
            paginate_by=12
        ),
        name='product_list'
    ),
    url(r'^catalog/(?P<path>[0-9A-Za-z-]+)/~(?P<slug>[0-9A-Za-z-_.]+)/$',
        CategoryProductDetailView.as_view(),
        name='product_detail'
    ),
    url(r'^catalog/(?P<path>[0-9A-Za-z-]+)/$',
        CustomCategoryShopListView.as_view(model=Product),
        name='product_list'
    ),
    url(r'^catalog/(?P<path>[0-9A-Za-z-]+)/page(?P<page>[0-9]+)/$',
        CustomCategoryShopListView.as_view(model=Product),
        name='product_list'
    ),
)
