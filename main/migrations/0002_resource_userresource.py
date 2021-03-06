# Generated by Django 3.0.1 on 2020-01-05 17:12

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Resource',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('url', models.TextField()),
                ('avgRating', models.FloatField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='UserResource',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.FloatField(null=True)),
                ('isBookmarked', models.BooleanField(null=True)),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
                ('updatedAt', models.DateTimeField(auto_now=True)),
                ('resource', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='users', to='main.Resource')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='resources', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
