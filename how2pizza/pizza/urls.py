from django.conf.urls import include, url
from pizza import views


urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^orders/$', views.orders, name='orders'),
]
