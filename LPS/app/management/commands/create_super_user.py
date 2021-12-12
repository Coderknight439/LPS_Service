from django.core.management.base import BaseCommand
from django.utils.crypto import get_random_string
from ...models import User
from ...auth import Auth

auth_handler = Auth()


class Command(BaseCommand):
    help = 'Create Super User'

    def add_arguments(self, parser):
        parser.add_argument('password', type=str, help='Indicates the su user password')

    def handle(self, *args, **kwargs):
        password = kwargs['password']
        User.objects.create(username='su@gmail.com', user_type=0, password=auth_handler.encode_password(password))
