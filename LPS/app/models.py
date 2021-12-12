from django.db import models
import datetime
from django.db.models import Count


# Data Models

# For Storing Employee Info
class Employee(models.Model):
    full_name = models.CharField(max_length=200, blank=False, null=False)
    designation = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=False, null=False, unique=True)


# For Storing Restaurant Info
class Restaurant(models.Model):
    name = models.CharField(max_length=200, blank=False, null=False)
    email = models.EmailField(blank=False, null=False, unique=True)
    location = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return (self.name + ' ' + self.location) if self.location else self.name

    # For Current Day Vote Count
    @property
    def vote_count(self):
        res = EmployeeVotes.objects.filter(entry_date__exact=datetime.datetime.today(), restaurant_id=self.id).all().values('restaurant_id').annotate(total=Count('restaurant_id'))
        return res[0].get('total') if res else 0

    # For Current Day Vote Menu
    @property
    def current_day_menu(self):
        res = RestaurantMenu.objects.filter(restaurant_id=self.id, entry_date__exact=datetime.datetime.today()).first()
        return res.menu if res else ''


# For Storing Date Wise Restaurant Menu
class RestaurantMenu(models.Model):
    restaurant_id = models.IntegerField()
    entry_date = models.DateField(auto_now_add=True)
    menu = models.TextField()

    def __str__(self):
        return self.menu

    class Meta:
        unique_together = ('restaurant_id', 'entry_date')  # So that a restaurant can't add menus more than once in a day


# Storing Employees Choice Per Day
class EmployeeVotes(models.Model):
    employee_id = models.IntegerField()
    restaurant_id = models.IntegerField()
    entry_date = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ('employee_id', 'entry_date')  # So that an employee can't vote more than once in a day

    @property
    def restaurant_name(self):
        return Restaurant.objects.get(pk=self.restaurant_id).name


# Storing Winners Per Day
class WinnerRestaurant(models.Model):
    restaurant_id = models.IntegerField()
    entry_date = models.DateField(auto_now_add=True)

    @property
    def winner_restaurant(self):
        return Restaurant.objects.get(id=self.restaurant_id).name


# Auth Models(Basic)
class User(models.Model):
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=256)
    user_type = models.IntegerField()
    party_id = models.IntegerField(null=True, default=None)

    def voted_for_today(self):
        data = EmployeeVotes.objects.filter(employee_id=self.party_id, entry_date__exact=datetime.datetime.today()).first()
        return data.restaurant_name if data else None

    def uploaded_for_today(self):
        data = RestaurantMenu.objects.filter(restaurant_id=self.party_id, entry_date__exact=datetime.datetime.today()).last()
        return data.menu if data else None
