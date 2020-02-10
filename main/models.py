from django.db import models
from django.contrib import auth
from django.contrib.auth.models import User

# USER EXTENSION METHODS


def createProfile(self):
    profile = Profile.objects.create(user=self, fullname=self.username)
    return profile


auth.models.User.add_to_class('createProfile', createProfile)


class Profile(models.Model):
    '''
    Quality: PE 2/3

    Description: User profile info, in contrast to User account info 
    (eg: username, email, etc)
    
    TODO: Add picture, jobPosition, location  
    '''
    user = models.OneToOneField(
        User, related_name="profile", on_delete=models.CASCADE)
    fullname = models.TextField(null=False)
    bio = models.TextField(null=True, default="")
    website = models.TextField(null=True, default="")


class Link(models.Model):
    '''
    Quality: PE 2/3

    Description: Link summary info. It's used as a 
    focal point for other models, such as UserLinkInteraction and
    PathLinkInteraction. It's also used to update its 
    aggregated values, such as avgRating of a link.

    Notes: 
    '''
    url = models.URLField(null=False, unique=True)
    avgRating = models.FloatField(null=True) 

    def __str__(self):
        return self.url


class UserResource(models.Model):
    '''
    Quality: PE 2/3

    Description: It's the interaction of a user with a link. Eg: rating or bookmark. 

    Notes: - Add 'ratedAt' and 'bookmarkedAt' (instead of isBookmarked, since it's a true binary)
           - Change resource to link
           - change to UserLinkInteraction 
    '''
    user = models.ForeignKey(
        User, related_name="resources", on_delete=models.CASCADE)
    resource = models.ForeignKey(
        Link, related_name="users", on_delete=models.CASCADE)
    title = models.TextField(default="")
    rating = models.FloatField(null=True)
    isBookmarked = models.BooleanField(null=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    # TODO: categories, hasPaidContent, isPrivate


class Follow(models.Model):
    '''
    Quality:  PE 2/3

    Description: 

    Notes: maybe 'followedUser' would be better than 'following'?
    '''
    follower = models.ForeignKey(
        User, related_name="followingUsers", on_delete=models.CASCADE)
    following = models.ForeignKey(
        User, related_name="followers", on_delete=models.CASCADE)
    createdAt = models.DateTimeField(auto_now=True)