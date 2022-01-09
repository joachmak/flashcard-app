from rest_framework.routers import DefaultRouter
from django.urls import include, path

from learning.views.set import SetViewset

router = DefaultRouter()
router.register(r'sets', SetViewset)

urlpatterns = [
    path('', include(router.urls)),
]