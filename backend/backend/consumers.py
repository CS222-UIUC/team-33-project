# your_app_name/consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer

class DataConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("data_group", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("data_group", self.channel_name)

    async def send_data(self, event):
        await self.send(text_data=json.dumps({
            'temperature': event['value']
        }))
