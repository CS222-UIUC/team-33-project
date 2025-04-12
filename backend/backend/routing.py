# your_project_name/routing.py

from django.urls import re_path
from your_app_name import consumers

websocket_urlpatterns = [
    re_path(r'ws/data/$', consumers.DataConsumer.as_asgi()),
]
