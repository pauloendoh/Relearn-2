from django.shortcuts import render, get_object_or_404
from main.forms import SignUpForm, LoginForm
from django.http import JsonResponse
from django.contrib.auth.models import User, Group
from django.contrib import auth as django_auth
from rest_framework import status
import random
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError


from main.models import Link, UserResource, Follow, Profile
from rest_framework import viewsets
from rest_framework.response import Response

from main.serializers import UserSerializer, GroupSerializer, LinkSerializer, UserResourceSerializer, FollowSerializer, ProfileSerializer
from main.utils import getJsonFromRequest
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login

from django.core.serializers import serialize, deserialize
from rest_framework.decorators import api_view
from django.contrib.auth.forms import AuthenticationForm


import json


# PE 3/3
def renderIndex(request):
    return render(request, 'index.html')


# PE 3/3
def renderPath(request):
    return render(request, 'path/path.html')


def renderUserPage(request, username):
    # PE 2/3

    returns = {}
    returns["user"] = get_object_or_404(User, username=username)
    return render(request, 'user/user.html', returns)

# PE 2/3
# should redirect you after successful login?
@api_view(['POST'])
def login(request):
    jsonResult = {}

    # Login with email
    user = User.objects.filter(email=request.data["username"])
    if(user.count() > 0):
        request.data["username"] = user[0].username
    form = AuthenticationForm(request, data=request.data)

    if form.is_valid():
        django_auth.login(request._request, form.get_user())
    else:
        jsonResult["errors"] = form.errors
    return JsonResponse(jsonResult)


@api_view(['POST'])
def createUser(request):
    '''
    INTUITIVE: PE 2/3

    DESCRIPTION: Create user by authModal 

    HOW TO TEST: 
    '''
    jsonResult = {}
    rData = request.data

    # If username already exists, add random numbers (eg: pauloendoh -> pauloendoh_123)
    dUsers = User.objects.filter(username=rData["username"])
    while(dUsers.count() > 0):
        newUsername = rData["username"] + "_" + str(random.randint(0, 100))
        dUsers = User.objects.filter(username=newUsername)
        rData["username"] = newUsername

    # Duplicated emails are not allowed
    if(User.objects.filter(email=rData["email"]).count() > 0):
        jsonResult["errors"] = {"email": "Email already exists"}
        return JsonResponse(jsonResult)

    # Validating rest of signup form + logging in
    form = SignUpForm(rData)
    if form.is_valid():
        dUser = form.save()
        dUser.createProfile()
        form.login(request)
        jsonResult["result"] = "OK"
    else:
        jsonResult["result"] = "ERROR"
        jsonResult["errors"] = form.errors
    return JsonResponse(jsonResult)


@login_required
@api_view(['GET', 'POST'])
def userLinkInteractions(request):
    '''
    INTUITIVE: PE 2/3

    DESCRIPTION: It's not a model, but an aggregate of different
    interactions between user and links. 
    Eg: ratings, bookmark or added to path.

    REFERENCES: main feed and user feed (GET), addUserLinkModal (POST)    

    TODO:  
    '''
    jsonResult = {}

    if request.method == 'GET':
        '''
        AVAILABLE PARAMETERS
        username(string): get userLinks from a user with this username
        following(boolean): get userLinks from the users that the user follows.
        rating__gte(int): returns userLinks with ratings >= this rating. 

        To test, check if the feeds are working
        '''
        queryFilter = {}
        dFollowingUserLinks = UserResource.objects.none()

        username = request.GET.get('username', None)
        if(username):
            dUser = User.objects.get(username=username)
            queryFilter["user"] = User.objects.get(username=username)

            # If following = true, get userLinks of users you follow
            following = request.GET.get('following', None)
            if(following):
                dFollows = dUser.followingUsers
                for dFollow in dFollows.all():
                    dFollowingUserLinks = UserResource.objects.filter(
                        user=dFollow.following)

        # Ratings greater than equals
        rating__gte = request.GET.get('rating__gte', None)
        if(rating__gte):
            queryFilter["rating__gte"] = rating__gte

        dUserLinks = UserResource.objects.filter(
            **queryFilter) | dFollowingUserLinks

        jsonResult["ratings"] = UserResourceSerializer(
            dUserLinks, many=True).data
        return JsonResponse(jsonResult)

    if request.method == 'POST':
        rData = request.data

        # rData["url"] is valid?
        urlValidator = URLValidator()
        try:
            urlValidator(rData["url"])
        except ValidationError:
            jsonResult["errors"] = []
            jsonResult["errors"].append("URL inválida!")
            return JsonResponse(jsonResult)

        # get or create Link with rData["url"]
        dLinks = Link.objects.filter(url=rData["url"])
        if(dLinks.count() > 0):
            dLink = dLinks[0]
        else:
            dLink = Link.objects.create(url=rData["url"])

        # update or create UserLink
        dUserLinks = UserResource.objects.filter(
            user=request.user, resource=dLink)
        if dUserLinks.count() > 0:
            dUserLink = dUserLinks[0]
            dUserLink.rating = rData["rating"]
            dUserLink.title = rData["title"]
            dUserLink.isBookmarked = rData["isBookmarked"]
            dUserLink.save()
        else:
            dUserLink = UserResource.objects.create(
                user=request.user, resource=dLink, title=rData["title"], rating=rData["rating"], isBookmarked=rData["isBookmarked"])
        context = {'request': request}

        # return serialized UserLink
        jsonResult["userResource"] = UserResourceSerializer(
            dUserLink).data
        jsonResult["message"] = "Success"

    return JsonResponse(jsonResult)


@api_view(['GET'])
@login_required
def getBookmarkedUserResources(request):
    jsonResults = {}
    user = request.user
    userResources = UserResource.objects.filter(user=user, isBookmarked=True)
    jsonResults["userResources"] = UserResourceSerializer(
        userResources, many=True).data
    return JsonResponse(jsonResults)

# PE 2/3
# What does it do? Maybe "ratings" and "userResource" are confusing?
@login_required
def getLastRatings(request):
    jsonResult = {
        "errors": []
    }
    userResources = UserResource.objects.filter(
        user=request.user, rating__gte=4).order_by("-updatedAt")
    jsonResult["ratings"] = UserResourceSerializer(
        userResources, many=True).data
    return JsonResponse(jsonResult)


@api_view(["GET", "POST", "DELETE"])
def follow(request):
    jsonResult = {
        "errors": []
    }

    if request.method == "GET":
        dFollowerUser = User.objects.get(username=request.GET.get('follower'))
        dFollowingUser = User.objects.get(
            username=request.GET.get('following'))
        if dFollowerUser and dFollowingUser:
            dFollow = Follow.objects.filter(
                follower=dFollowerUser, following=dFollowingUser)
            if(dFollow.count() > 0):
                jsonResult["follow"] = FollowSerializer(dFollow[0]).data
            else:
                jsonResult["follow"] = None
        else:

            jsonResult["follow"] = None
    elif request.method == "POST":
        try:
            dFollowerUser = request.user
            dFollowingUser = User.objects.get(
                username=request.data["following"])
            dFollow = Follow.objects.create(
                follower=dFollowerUser, following=dFollowingUser)
            jsonResult["follow"] = FollowSerializer(dFollow).data
        except:
            jsonResult["follow"] = None
    elif request.method == "DELETE":
        dFollowerUser = request.user
        dFollowingUser = User.objects.get(username=request.data['following'])
        dFollow = Follow.objects.create(
            follower=dFollowerUser, following=dFollowingUser)
        dFollow.delete()

    return JsonResponse(jsonResult)

# PE 3/3
@api_view(["GET"])
def profile(request):
    # Get profile by username
    if request.method == "GET":
        username = request.GET.get("user", None)
        if username:
            user = User.objects.get(username=username)
            profile = Profile.objects.get(user=user)
            serializer = ProfileSerializer(profile)
            return Response(serializer.data)
    return Response(status=status.HTTP_204_NO_CONTENT)


'''**********
REST ViewSets
**********'''


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class LinkViewSet(viewsets.ModelViewSet):
    queryset = Link.objects.all()
    serializer_class = LinkSerializer


class UserResourceViewSet(viewsets.ModelViewSet):
    queryset = UserResource.objects.all()
    serializer_class = UserResourceSerializer
