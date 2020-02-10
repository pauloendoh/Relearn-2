from django.db.models import Q

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from main.serializers import UserSerializer
from django.contrib.auth.models import User 
from main.models import Profile

import json

@login_required
def createDefaultProfileForAllUsers(request):
    jsonResult = {}
    if request.user.is_superuser:
        users = User.objects.filter(profile=None)
        jsonResult["updatedUsers"] = UserSerializer(users, many=True, context={'request': request}).data
        for user in users:
            profile = Profile.objects.create(user=user, fullname=user.username, bio="", website="")
            user.profile = profile
            user.save()
        jsonResult["message"] = "Users got default profile."

    # SETTINGS FULLNAME FOR USERS WHO DON'T HAVE IT 
    profiles = Profile.objects.filter(Q(fullname=None)|Q(fullname=""))
    for profile in profiles:
        profile.fullname = profile.user.username
        profile.save()

    return JsonResponse(jsonResult)

@login_required
def getSuperUsers(request):
    jsonResult = {}
    if request.user.is_superuser:
        users = User.objects.filter(is_superuser=True)
        jsonResult["users"] = UserSerializer(users, many=True, context={'request': request}).data
    return JsonResponse(jsonResult)