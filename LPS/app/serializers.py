from rest_framework import serializers
from .models import Employee, Restaurant, EmployeeVotes, RestaurantMenu, User, WinnerRestaurant


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'


class RestaurantMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantMenu
        fields = '__all__'


class EmployeeVotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeVotes
        fields = '__all__'


class WinnerRestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = WinnerRestaurant
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = '__all__'
