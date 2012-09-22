from django.conf import settings
from django.contrib import admin
from django.utils.translation import ugettext_lazy as _
from shop.admin.orderadmin import OrderAdmin
#from shop.models.ordermodel import Order
from shop.models import Order, Product
from shop_simplecategories.admin import ProductWithCategoryForm

from models import ProductImage



class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductForm(ProductWithCategoryForm):
    class Meta:
        model = Product


class CustomProductAdmin(admin.ModelAdmin):
    class Media:
        form = ProductForm

        js = (
            'tiny_mce/tiny_mce.js',
            'filebrowser/js/TinyMCEAdmin.js',
        )

    inlines = [ProductImageInline,]
    prepopulated_fields = {"slug": ("name",)}


class MyOrderAdmin(OrderAdmin):
    fieldsets = (
            (None, {'fields': ('user', 'status', 'order_total',
                'order_subtotal', 'created', 'modified')}),
            (_('Shipping'), {
                'fields': ('shipping_address_text',),
                }),
            )

admin.site.register(Product, CustomProductAdmin)
admin.site.unregister(Order)
ORDER_MODEL = getattr(settings, 'SHOP_ORDER_MODEL', None)
if not ORDER_MODEL:
    admin.site.register(Order, MyOrderAdmin)

