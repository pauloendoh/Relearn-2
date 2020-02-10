"""Relearn URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls import include, path
from main import views, dbScripts
from django.contrib.auth import views as auth_views
from rest_framework import routers


router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'links', views.LinkViewSet)
router.register(r'userResources', views.UserResourceViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),
    path('login', views.login, name="login"),
    path('createUser', views.createUser, name='createUser'),
    path('logout', auth_views.LogoutView.as_view(
        next_page="renderIndex"), name='logout'),
    path('oauth/', include('social_django.urls', namespace='social')),  # <--

    # Render
    path('', views.renderIndex, name='renderIndex'),
    path('path', views.renderPath, name='renderPath'),
    path('user/<str:username>', views.renderUserPage, name='renderUserPage'),

    # User Resource
    path('userResource/getLastRatings', views.getLastRatings, name='getLastRatings'),
    path('userResource/getBookmarkedUserResources', views.getBookmarkedUserResources, name='getBookmarkedUserResources'),

    
    # Follow
    path('follow', views.follow, name='follow'),

    # Profile
    path('profile', views.profile, name="profile"),

    # REST
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/userLinkInteractions', views.userLinkInteractions, name='userLinkInteractions'),


    # DB Scripts
    path('admin/createDefaultProfileForAllUsers', dbScripts.createDefaultProfileForAllUsers, name='createDefaultProfileForAllUsers'),
    path('admin/getSuperUsers', dbScripts.getSuperUsers, name='getSuperUsers'),

]
