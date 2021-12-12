from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import EmployeeSerializer, RestaurantSerializer, RestaurantMenuSerializer, EmployeeVotesSerializer, UserSerializer
from .models import Employee, User, Restaurant, RestaurantMenu, EmployeeVotes, WinnerRestaurant
from .auth import JWTAuthentication, AdminUserOnly, RestaurantUserOnly, EmployeeUserOnly
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.decorators import api_view
from .auth import Auth
from .enums import UserTypes
import datetime
from django.views.decorators.http import require_http_methods
from django.db.models import Count


auth_handler = Auth()


class EmployeeViews(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [AdminUserOnly]

    def post(self, request):
        password = request.data.pop('password')
        serializer = EmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            User.objects.create(
                username=serializer.data.get('email'),
                password=auth_handler.encode_password(password),
                user_type=UserTypes.Employee.value,
                party_id=serializer.data.get('id')
            )
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, id=None):
        if id:
            employee = Employee.objects.get(id=id)
            serializer = EmployeeSerializer(employee)
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

        employees = Employee.objects.all()
        serializer = EmployeeSerializer(employees, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)


class RestaurantViews(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [AdminUserOnly]

    def post(self, request):
        password = request.data.pop('password')
        serializer = RestaurantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            User.objects.create(
                username=serializer.data.get('email'),
                password=auth_handler.encode_password(password),
                user_type=UserTypes.Restaurant.value,
                party_id=serializer.data.get('id')
            )
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, id=None):
        if id:
            restaurant = Restaurant.objects.get(id=id)
            serializer = RestaurantSerializer(restaurant)
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

        restaurants = Restaurant.objects.all()
        serializer = RestaurantSerializer(restaurants, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)


class RestaurantMenuViews(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [RestaurantUserOnly]

    def post(self, request):
        serializer = RestaurantMenuSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class VoteViews(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [EmployeeUserOnly | AdminUserOnly]

    def post(self, request):
        serializer = EmployeeVotesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        restaurants = Restaurant.objects.all()
        data_list = []
        for restaurant in restaurants:
            data_dict = dict(
                id=restaurant.id,
                name=restaurant.name,
                vote=restaurant.vote_count,
                menu=restaurant.current_day_menu or None
            )
            data_list.append(data_dict)
        return Response({"status": "success", "data": data_list}, status=status.HTTP_200_OK)


class WinnerViews(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [AdminUserOnly]

    def post(self, request):
        current_winner = WinnerRestaurant.objects.filter(entry_date__exact=datetime.datetime.today()).first()  # checking current winner exists or not
        if current_winner:
            return Response({"status": "success", "data": current_winner.winner_restaurant}, status=status.HTTP_200_OK)
        data = EmployeeVotes.objects.filter(entry_date__exact=datetime.datetime.today()).all().values('restaurant_id').annotate(total=Count('restaurant_id')).order_by('-total')  # Getting restaurants with vote count in descending order
        prev_winner_query = WinnerRestaurant.objects.all().order_by('-entry_date')  # Getting previous winners
        if prev_winner_query:
            prev_winner_data = [int(obj.restaurant_id) for obj in prev_winner_query[0:3]]  # Last 3 winners
            for item in data:
                if int(item.get('restaurant_id')) not in prev_winner_data or prev_winner_data.count(int(item.get('restaurant_id'))) < 2: # if new restaurant or selected at most once in last 3 days
                    current_winner = WinnerRestaurant.objects.create(restaurant_id=item.get('restaurant_id'))
                    break
            return Response({"status": "success", "data": current_winner.winner_restaurant}, status=status.HTTP_200_OK)
        else:
            if data:
                restaurant_id = data[0].get('restaurant_id')
                current_winner = WinnerRestaurant.objects.create(restaurant_id=restaurant_id)
                return Response({"status": "success", "data": current_winner.winner_restaurant}, status=status.HTTP_200_OK)
            return Response({"status": "error", "data": "No Winner. No Vote Found!"}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        data = WinnerRestaurant.objects.filter(entry_date__exact=datetime.datetime.today()).first()
        if data:
            return Response({"status": "error", "data": "Today's Winner is {name}".format(name=data.winner_restaurant)}, status=status.HTTP_200_OK)
        return Response({"status": "error", "data": "No Winner Yet!"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request, **kwargs):
    username = request.data.get('username')
    password = request.data.get('password')
    user = User.objects.filter(username=username).first()
    if not user:
        return Response({"username": "Username not found"}, status=status.HTTP_404_NOT_FOUND)

    if not auth_handler.verify_password(password, user.password):
        return Response({"password": "Wrong Password"}, status=status.HTTP_404_NOT_FOUND)
    payload = {"user_id": user.id, "user_type": user.user_type, "party_id": user.party_id} # payload to use in frontend
    current_winner = WinnerRestaurant.objects.filter(entry_date__exact=datetime.datetime.today()).first()
    payload['current_winner'] = current_winner.winner_restaurant if current_winner else None
    if user.user_type == UserTypes.Employee.value:
        payload['voted'] = user.voted_for_today()
    elif user.user_type == UserTypes.Restaurant.value:
        payload['uploaded'] = user.uploaded_for_today()
    token = auth_handler.encode_token(payload)
    refresh_token = auth_handler.encode_refresh_token({"user_id": user.id, "user_type": user.user_type})

    return Response({"access_token": token, "token_type": "bearer", "refresh_token": refresh_token}, status=status.HTTP_200_OK)


@api_view(['POST'])
def refresh_token(request, **kwargs):
    token = request.data.get('token', '')
    print(token)
    new_token = auth_handler.refresh_token(token)
    return Response({'access_token': new_token}, status=status.HTTP_200_OK)


