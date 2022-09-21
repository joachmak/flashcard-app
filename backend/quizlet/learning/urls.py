from rest_framework.routers import DefaultRouter
from django.urls import include, path
from learning.views import CardViewset, SetViewset, ImageViewset

router = DefaultRouter()
router.register(r'sets', SetViewset)
router.register(r'cards', CardViewset)
router.register(r'images', ImageViewset)

urlpatterns = [
    path('', include(router.urls)),
]