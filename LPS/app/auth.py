from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from LPS import settings
from rest_framework.exceptions import APIException
from rest_framework import status
from rest_framework import authentication, permissions, exceptions
from .models import User


APIException.status_code = status.HTTP_401_UNAUTHORIZED


class Auth:
    hasher = CryptContext(schemes=['bcrypt'], deprecated="auto")
    secret = settings.SECRET_KEY
    algorithm = settings.ALGORITHM
    jwt_expire_minutes = settings.JWT_EXPIRE_MINUTES
    jwt_refresh_expire_hours = 10

    def encode_password(self, password):
        return self.hasher.hash(password)

    def verify_password(self, password, encoded_password):
        return self.hasher.verify(password, encoded_password)

    def encode_token(self, payload_data: dict):
        payload = {
            'exp': datetime.utcnow() + timedelta(minutes=int(self.jwt_expire_minutes)),
            'iat': datetime.utcnow(),
            'scope': 'access_token',
            'data': payload_data
        }
        return jwt.encode(
            payload,
            self.secret,
            algorithm=self.algorithm
        )

    def decode_token(self, token):
        try:
            payload = jwt.decode(token, self.secret, algorithms=[self.algorithm])
            if payload['scope'] == 'access_token':
                return payload['data']
            raise APIException(detail='Scope for the token is invalid')
        except jwt.ExpiredSignatureError:
            raise APIException(detail='Token expired')
        except JWTError:
            raise APIException(detail='Invalid token')

    def encode_refresh_token(self, payload_data: dict):
        payload = {
            'exp': datetime.utcnow() + timedelta(hours=int(self.jwt_refresh_expire_hours)),
            'iat': datetime.utcnow(),
            'scope': 'refresh_token',
            'data': payload_data
        }
        return jwt.encode(
            payload,
            self.secret,
            algorithm=self.algorithm
        )

    def refresh_token(self, refresh_token):
        try:
            payload = jwt.decode(refresh_token, self.secret, algorithms=[self.algorithm])
            if payload['scope'] == 'refresh_token':
                data = payload['data']
                new_token = self.encode_token(data)
                return new_token
            raise APIException(detail='Invalid scope for token')
        except JWTError:
            raise APIException(detail='Invalid refresh token')


class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_handler = Auth()
        auth = request.META.get('HTTP_AUTHORIZATION', '').split(' ')
        if auth[0] != 'Bearer' or len(auth) != 2:
            raise exceptions.AuthenticationFailed("Authorization Failed!")
        token = auth[1]
        try:
            payload = auth_handler.decode_token(token)
            user_id = payload.get('user_id')
            user = User.objects.get(pk=user_id)
            return user, None
        except Exception as e:
            raise exceptions.AuthenticationFailed("Invalid Token!")


class AdminUserOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return True


class EmployeeUserOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return True


class RestaurantUserOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return True

