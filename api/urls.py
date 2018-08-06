from django.conf.urls import include, url
from rest_framework import routers

from api import views as api_views

router = routers.DefaultRouter()
router.register(r'players', api_views.PlayerViewSet)
router.register(r'locations', api_views.LocationViewSet)
router.register(r'games', api_views.GameViewSet)
router.register(r'schedules', api_views.ScheduleViewSet)
router.register(r'attending', api_views.AttendingViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),
]