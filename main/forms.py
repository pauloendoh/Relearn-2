from django.contrib.auth.forms import UserCreationForm
from django import forms
from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login, authenticate


class SignUpForm(UserCreationForm):
    email = forms.CharField(max_length=254, required=True,
                            widget=forms.EmailInput())

    def login(self, request):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password1')
        user = authenticate(username=username, password=password)
        auth_login(request, user)
        return

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')

class LoginForm(forms.Form):
    username = forms.CharField(max_length=255, required=True)
    password = forms.CharField(widget=forms.PasswordInput, required=True)

    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        user = authenticate(username=username, password=password)
        if not user or not user.is_active:
            raise forms.ValidationError("Sorry, that login was invalid. Please try again.")
        return self.cleaned_data

    def login(self, request):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')
        user = authenticate(username=username, password=password)
        return user
