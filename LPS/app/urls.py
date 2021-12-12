from django.urls import path
from .views import EmployeeViews, RestaurantViews, RestaurantMenuViews, VoteViews, WinnerViews


urlpatterns = [
    path('employees/', EmployeeViews.as_view()),
    path('restaurants/', RestaurantViews.as_view()),
    path('restaurants_menu/', RestaurantMenuViews.as_view()),
    path('votes/', VoteViews.as_view()),
    path('winners/', WinnerViews.as_view()),
]