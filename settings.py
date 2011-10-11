# Django settings for simpleshop project.
from common_settings import *

from local_settings import *

INSTALLED_APPS = INSTALLED_APPS + [
    'sorl.thumbnail',
    'polymorphic',
    'shop',
    # useful 3rd party apps
    'south',
    'sitetree',
    'tinymce',
#    'feedback',
    # Our own apps
    'apps.common',
    'apps.customshop',
    'apps.customshop.address',
    'apps.articles',
    'apps.banners',
]
SHOP_SHIPPING_BACKENDS = [
    'apps.customshop.shipping.backends.pickup.PickupShipping',
    'apps.customshop.shipping.backends.delivery_in_moscow.DeliveryInMoscowShipping',
]
SHOP_PAYMENT_BACKENDS = [
    'apps.customshop.payments.backends.pay_with_cash.PayWithCashBackend'
]

SHOP_ADDRESS_MODEL = 'apps.customshop.address.models.Address'

TINYMCE_JS_URL = os.path.join(STATIC_ROOT, "tiny_mce/tiny_mce.js")
TINYMCE_JS_ROOT = os.path.join(MEDIA_ROOT, "tiny_mce")
TINYMCE_DEFAULT_CONFIG = {
    'plugins': "table,paste,searchreplace",
    'theme': "advanced",
    'cleanup_on_startup': True,
    'custom_undo_redo_levels': 10,
}


TEMPLATE_DEBUG = DEBUG

if DEBUG:
    DEBUG_TOOLBAR_PANELS = (
        'debug_toolbar.panels.version.VersionDebugPanel',
        'debug_toolbar.panels.timer.TimerDebugPanel',
        'debug_toolbar.panels.settings_vars.SettingsVarsDebugPanel',
        'debug_toolbar.panels.headers.HeaderDebugPanel',
    #    'debug_toolbar.panels.request_vars.RequestVarsDebugPanel',
        'debug_toolbar.panels.template.TemplateDebugPanel',
        'debug_toolbar.panels.sql.SQLDebugPanel',
        'debug_toolbar.panels.signals.SignalDebugPanel',
        'debug_toolbar.panels.logger.LoggingPanel',
    )
    MIDDLEWARE_CLASSES = (('debug_toolbar.middleware.DebugToolbarMiddleware',)
                                                        + MIDDLEWARE_CLASSES)
    INTERNAL_IPS = ('127.0.0.1',)
    DEBUG_TOOLBAR_CONFIG = dict(
        INTERCEPT_REDIRECTS = False
    )
    INSTALLED_APPS += ['debug_toolbar',]

    STATICFILES_DIRS += (os.path.join(PROJECT_DIR, 'media'),)
else :
    TEMPLATE_LOADERS = (
        ('django.template.loaders.cached.Loader', TEMPLATE_LOADERS),
    )