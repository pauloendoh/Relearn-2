from django.contrib.auth.models import User, Group
from main.models import UserResource, Link, Follow, Profile
from rest_framework import serializers

# USER
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email']

class UserListingField(serializers.RelatedField):
    def to_representation(self, value):
        return value.username

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

# RESOURCE
class LinkSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Link
        fields = ['url', 'avgRating']

class ResourceListingField(serializers.RelatedField):
    def to_representation(self, value):
            return value.url

# USER RESOURCE
class UserResourceSerializer(serializers.ModelSerializer):
    user = UserListingField(read_only=True)
    resource = ResourceListingField(read_only=True)

    class Meta:
        model = UserResource
        fields = ['id', 'user', 'resource', 'title', 'rating',
                  'isBookmarked', 'createdAt', 'updatedAt']


class FollowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = ["follower", "following", "createdAt"]

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["user", "fullname", "bio", "website"]